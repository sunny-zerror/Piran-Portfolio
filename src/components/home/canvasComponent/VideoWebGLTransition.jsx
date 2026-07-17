"use client";

import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useVideoTexture } from '@react-three/drei';
import gsap from 'gsap';

const vertexShader = `
uniform float uProgress;
uniform float uDirection;
uniform vec2 uMeshSize;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Animate from 0 to 1 and back to 0 during the transition
    float distortionIntensity = sin(uProgress * 3.14159265);
    
    // Offset the center of the bulge towards the top-left
    vec2 bulgeCenter = vec2(0.2, 0.8);
    float dist = distance(uv, bulgeCenter);
    
    // Create a smooth bell curve for the bulge
    float curve = cos(min(dist * 1.8, 3.14159265 / 2.0));
    
    // Push outwards (+Z) when expanding (uDirection=1), inwards (-Z) when closing (uDirection=-1)
    pos.z += distortionIntensity * curve * 4.0 * uDirection;
    
    // Slight pinch effect to emphasize the 3D stretch
    pos.xy += (uv - bulgeCenter) * distortionIntensity * (1.0 - curve) * 0.5 * uDirection;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uProgress;
uniform vec2 uQuadSize;
uniform vec2 uTextureSize;
varying vec2 vUv;

void main() {
    // Background cover logic for texture (similar to object-fit: cover)
    vec2 rs = uQuadSize;
    vec2 is = uTextureSize;
    
    vec2 ratio = vec2(
        min((rs.x / rs.y) / (is.x / is.y), 1.0),
        min((rs.y / rs.x) / (is.y / is.x), 1.0)
    );
    
    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    gl_FragColor = texColor;
}
`;

const WebGLPlane = ({ targetRef, expanded, isAnimating, onComplete, videoUrl }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    
    const texture = useMemo(() => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = "Anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.play().catch(e => console.log("Video autoplay failed:", e));
        return new THREE.VideoTexture(video);
    }, [videoUrl]);
    
    const { viewport, size } = useThree();
    
    // Store the animating timeline so we don't conflict
    const tlRef = useRef(null);

    useFrame(() => {
        if (!meshRef.current || !materialRef.current || !targetRef.current) return;
        
        // Only track the DOM element when NOT expanded and NOT animating
        if (!expanded && !isAnimating) {
            const bounds = targetRef.current.getBoundingClientRect();
            const widthRatio = viewport.width / size.width;
            const heightRatio = viewport.height / size.height;

            meshRef.current.scale.set(
                bounds.width * widthRatio,
                bounds.height * heightRatio,
                1
            );
            
            meshRef.current.position.set(
                (bounds.left + bounds.width / 2 - size.width / 2) * widthRatio,
                -(bounds.top + bounds.height / 2 - size.height / 2) * heightRatio,
                0
            );

            materialRef.current.uniforms.uQuadSize.value.set(
                meshRef.current.scale.x,
                meshRef.current.scale.y
            );
        }
    });

    useEffect(() => {
        if (!meshRef.current || !materialRef.current || !targetRef.current) return;

        // If we just became 'expanded' or '!expanded' and isAnimating is true, run the animation
        if (isAnimating) {
            if (tlRef.current) tlRef.current.kill();
            
            const tl = gsap.timeline({
                onComplete: () => {
                    if (onComplete) onComplete(expanded);
                }
            });
            tlRef.current = tl;

            const widthRatio = viewport.width / size.width;
            const heightRatio = viewport.height / size.height;
            const bounds = targetRef.current.getBoundingClientRect();

            const targetScaleX = expanded ? viewport.width : (bounds.width * widthRatio);
            const targetScaleY = expanded ? viewport.height : (bounds.height * heightRatio);
            const targetPosX = expanded ? 0 : ((bounds.left + bounds.width / 2 - size.width / 2) * widthRatio);
            const targetPosY = expanded ? 0 : (-(bounds.top + bounds.height / 2 - size.height / 2) * heightRatio);
            const targetProgress = expanded ? 1 : 0;
            const direction = expanded ? 1.0 : -1.0;
            const proxy = { progress: expanded ? 0 : 1 };
            
            if (materialRef.current) {
                materialRef.current.uniforms.uDirection.value = direction;
            }

            tl.to(proxy, {
                progress: targetProgress,
                duration: 1.2,
                ease: "power3.inOut",
                onUpdate: () => {
                    if (materialRef.current) {
                        materialRef.current.uniforms.uProgress.value = proxy.progress;
                    }
                }
            }, 0)
            .to(meshRef.current.position, {
                x: targetPosX,
                y: targetPosY,
                z: 0,
                duration: 1.2,
                ease: "power3.inOut"
            }, 0)
            .to(meshRef.current.scale, {
                x: targetScaleX,
                y: targetScaleY,
                duration: 1.2,
                ease: "power3.inOut",
                onUpdate: () => {
                    if (materialRef.current) {
                        materialRef.current.uniforms.uQuadSize.value.set(
                            meshRef.current.scale.x,
                            meshRef.current.scale.y
                        );
                        // Also update uProgress here just to be safe
                        materialRef.current.uniforms.uProgress.value = proxy.progress;
                    }
                }
            }, 0);
        }
    }, [expanded, isAnimating, viewport, size]);

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uProgress: { value: expanded ? 1 : 0 },
        uDirection: { value: expanded ? 1.0 : -1.0 },
        uQuadSize: { value: new THREE.Vector2(0, 0) }, // Updated in useFrame
        uTextureSize: { value: new THREE.Vector2(1920, 1080) },
    }), [texture]);

    useEffect(() => {
        if (texture && materialRef.current) {
            const video = texture.image;
            const updateSize = () => {
                if (materialRef.current) {
                    materialRef.current.uniforms.uTextureSize.value.set(
                        video.videoWidth || 1920,
                        video.videoHeight || 1080
                    );
                }
            };
            video.addEventListener('loadedmetadata', updateSize);
            updateSize();
            return () => video.removeEventListener('loadedmetadata', updateSize);
        }
    }, [texture]);

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    );
};

export const VideoWebGLTransition = ({ targetRef, expanded, isAnimating, onAnimationComplete }) => {
    const videoUrl = "https://vz-f76b55f9-7b8.b-cdn.net/2b3c385c-35e7-406c-bb11-8c7d71d90001/playlist.m3u8";

    return (
        <div className=" vid_cont  opacity-0 fixed inset-0 w-screen h-screen z-[998] pointer-events-none">
            <Canvas
                style={{ pointerEvents: 'none' }}
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <WebGLPlane 
                        targetRef={targetRef} 
                        expanded={expanded} 
                        isAnimating={isAnimating}
                        onComplete={onAnimationComplete} 
                        videoUrl={videoUrl} 
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};
