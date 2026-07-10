"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveDots = () => {
  const pointsRef = useRef();
  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));
  const previousMouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));
  const smoothedVelocity = useRef(0.0);

  const [positions, setPositions] = useState(null);

  useEffect(() => {
    const cols = 140;
    const rows = 50;
    const viewW = 35;
    const viewH = 9.8;
    const spacingX = viewW / cols;
    const spacingY = viewH / rows;

    const arr = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xOffset = (r % 2 === 0) ? 0 : (spacingX / 2);
        arr[i++] = (c * spacingX) - (viewW / 2) + xOffset;
        arr[i++] = (r * spacingY) - (viewH / 2) - 1.0;
        arr[i++] = 0;
      }
    }
    setPositions(arr);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouseWorld.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseWorld.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (previousMouseWorld.current.x === 9999) {
        previousMouseWorld.current.x = mouseWorld.current.x;
        previousMouseWorld.current.y = mouseWorld.current.y;
      }
    };
    const onLeave = () => {
      mouseWorld.current.set(9999, 9999, 0);
      previousMouseWorld.current.set(9999, 9999, 0);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
          uMouseVelocity: { value: 0.0 },
          uColor: { value: new THREE.Color('#ffffff') },
          uTime: { value: 0.0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader: `
          uniform vec3  uMouse;
          uniform float uMouseVelocity;
          uniform float uTime;
          uniform vec2  uResolution;
          
          varying float vAlpha;

          void main() {
            vec3 pos = position;
            
            // 1. Continuously Moving Mountain Mask
            // Combination of sines that shift over uTime
            float t = uTime * 1.2;
            float curve = sin((pos.x - t) * 0.8) * 0.6 
                        + cos((pos.x - t * 0.8) * 1.5) * 0.3 
                        + sin((pos.x - t * 1.2) * 2.7) * 0.2
                        + cos((pos.x + t * 0.5) * 4.2) * 0.15;
            curve -= 0.5; // Base height adjustment
            
            // 2. Mouse Interaction Wave
            // The mask height increases near the mouse to reveal more dots
            float dX = abs(pos.x - uMouse.x);
            float mouseRadius = 4.0 + uMouseVelocity * 3.0; 
            
            if (dX < mouseRadius) {
                float f = pow(1.0 - dX / mouseRadius, 2.0);
                curve += f * (2.5 + uMouseVelocity * 2.0); // Lift the mask
            }
            
            float size = 23.4; // Target size increased by 30%
            vAlpha = 1.0;
            
            // Hide dots that are above the mask
            float diff = curve - pos.y;
            if (diff < 0.0) {
                size = 0.0;
                vAlpha = 0.0;
            } else if (diff < 0.5) {
                // Smoothly scale up dots right at the boundary so they don't pop harshly
                size *= clamp(diff * 2.0, 0.0, 1.0);
            }

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (uResolution.y / 800.0);
            gl_Position  = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying float vAlpha;

          void main() {
            if (vAlpha < 0.01) discard;
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.45) discard;
            float edge = smoothstep(0.45, 0.35, d);
            gl_FragColor = vec4(uColor, edge * vAlpha); // Solid color
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const vp = state.viewport;

    const mx = (mouseWorld.current.x * vp.width) / 2;
    const my = (mouseWorld.current.y * vp.height) / 2;

    // Smoothly track mouse X for the wave peak
    pointsRef.current.material.uniforms.uMouse.value.lerp(
      new THREE.Vector3(mx, my, 0),
      0.15,
    );

    let speed = 0;
    if (mouseWorld.current.x !== 9999 && previousMouseWorld.current.x !== 9999) {
      const dx = mouseWorld.current.x - previousMouseWorld.current.x;
      speed = Math.abs(dx); // Horizontal speed
    }

    previousMouseWorld.current.x = mouseWorld.current.x;
    previousMouseWorld.current.y = mouseWorld.current.y;

    const targetVelocity = Math.min(speed * 30.0, 1.0);
    smoothedVelocity.current += (targetVelocity - smoothedVelocity.current) * 0.1;

    pointsRef.current.material.uniforms.uMouseVelocity.value = smoothedVelocity.current;
    pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;

    pointsRef.current.material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );
  });

  if (!positions) return null;

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
};

const FooterWave = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-[1] opacity-30 pointer-events-none">
      <div className="w-full h-full pointer-events-auto">
        <Canvas

          gl={{ antialias: true }}
        >
          <WaveDots />
        </Canvas>
      </div>
    </div>
  );
}

export default FooterWave;
