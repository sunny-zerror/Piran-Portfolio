"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveStrokes = () => {
  const count = 20; // 20 strokes
  const meshRef = useRef();

  // Create an instanced mesh of thin planes
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      // Space them out along the Z axis, some in front, some behind
      // Moon is at z = 0, so let's put waves from z = -6 to z = +6
      dummy.position.set(0, 0, (i - count / 2) * 0.8);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uColor: { value: new THREE.Color('#FDF5E6') }, // Cream color
        },
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying float vInstanceId;
          
          void main() {
            vUv = uv;
            vInstanceId = float(gl_InstanceID);
            
            vec3 pos = position;
            
            vec3 instancePos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
            float zOffset = instancePos.z;
            float x = pos.x;
            
            // Sine waves for ocean-like movement
            float wave1 = sin(x * 0.2 + uTime * 1.5 + zOffset * 0.5) * 1.5;
            float wave2 = cos(x * 0.5 + uTime * 2.0 - zOffset * 0.8) * 0.8;
            float wave3 = sin(x * 0.1 - uTime * 0.8 + zOffset) * 2.0;
            
            pos.y += wave1 + wave2 + wave3;
            
            vec4 mvPosition = viewMatrix * instanceMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying vec2 vUv;
          varying float vInstanceId;
          
          void main() {
            // Soft stroke effect using UVs (vUv.y goes 0 to 1)
            float strokeAlpha = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
            
            // Fade out on the horizontal edges
            float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
            
            // Vary opacity per line
            float lineOpacity = 0.3 + 0.5 * fract(sin(vInstanceId * 123.456) * 432.1);
            
            gl_FragColor = vec4(uColor, strokeAlpha * edgeFade * lineOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* 40 units wide, 0.15 units high */}
      <planeGeometry args={[45, 0.2, 128, 1]} />
      <primitive object={material} attach="material" />
    </instancedMesh>
  );
};

const MoonGlobe = () => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color('#1a2130') }, // Darker moon craters
          uColor2: { value: new THREE.Color('#3b4b61') }, // Lighter moon surface
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          // Simple procedural noise
          float noise3D(vec3 p) {
              return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          }
          
          // Value noise interpolation
          float smoothNoise(vec3 p) {
              vec3 i = floor(p);
              vec3 f = fract(p);
              f = f * f * (3.0 - 2.0 * f);
              
              float n000 = noise3D(i + vec3(0.0, 0.0, 0.0));
              float n100 = noise3D(i + vec3(1.0, 0.0, 0.0));
              float n010 = noise3D(i + vec3(0.0, 1.0, 0.0));
              float n110 = noise3D(i + vec3(1.0, 1.0, 0.0));
              float n001 = noise3D(i + vec3(0.0, 0.0, 1.0));
              float n101 = noise3D(i + vec3(1.0, 0.0, 1.0));
              float n011 = noise3D(i + vec3(0.0, 1.0, 1.0));
              float n111 = noise3D(i + vec3(1.0, 1.0, 1.0));
              
              float nx00 = mix(n000, n100, f.x);
              float nx10 = mix(n010, n110, f.x);
              float nx01 = mix(n001, n101, f.x);
              float nx11 = mix(n011, n111, f.x);
              
              float nxy0 = mix(nx00, nx10, f.y);
              float nxy1 = mix(nx01, nx11, f.y);
              
              return mix(nxy0, nxy1, f.z);
          }
          
          float fbm(vec3 p) {
              float f = 0.0;
              float amp = 0.5;
              for(int i = 0; i < 4; i++) {
                  f += amp * smoothNoise(p);
                  p *= 2.0;
                  amp *= 0.5;
              }
              return f;
          }

          void main() {
            // Basic lighting
            vec3 lightDir = normalize(vec3(1.0, 1.5, 2.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            
            // FBM Noise for surface structure (craters and rocky texture)
            float n1 = fbm(vPosition * 1.5); 
            float n2 = fbm(vPosition * 4.0); 
            
            float surface = smoothstep(0.2, 0.7, n1 + n2 * 0.5);
            
            // Base color interpolation based on surface noise
            vec3 baseColor = mix(uColor1, uColor2, surface);
            
            // Apply diffuse lighting
            vec3 finalColor = baseColor * (diff * 0.9 + 0.1);
            
            // Subtle rim glow to make the moon pop against the background
            float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
            rim = smoothstep(0.7, 1.0, rim);
            finalColor += vec3(0.6, 0.7, 0.8) * rim * 0.4;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        transparent: false,
      }),
    []
  );

  const sphereRef = useRef();

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.05; // Slow rotation
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={sphereRef} position={[0, 0, 0]}>
      <sphereGeometry args={[3, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const WorkBehindBg = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <div className="w-full h-full pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Waves overlap the moon (some in front, some behind due to Z positions) */}
          <WaveStrokes />
          <MoonGlobe />
        </Canvas>
      </div>
    </div>
  );
};

export default WorkBehindBg;
