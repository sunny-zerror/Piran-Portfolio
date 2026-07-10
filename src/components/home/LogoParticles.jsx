"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════ Particle System ═══════════════════════ */
const ParticleSystem = ({ gridPositions, logoPositions, hasTarget }) => {
  const pointsRef = useRef();
  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));
  const previousMouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));
  const smoothedVelocity = useRef(0.0);
  const morphProgress = useRef(0);
  const inCenter = useRef(false);

  // Global mouse tracking and intro animation
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
    
    // Intro animation: form logo after 1 second
    const timeoutId = setTimeout(() => {
      inCenter.current = true;
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
          uMouseVelocity: { value: 0.0 },
          uMorph: { value: 0.0 },
          uColor: { value: new THREE.Color('#ffffff') },
          uResolution: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader: `
          uniform vec3  uMouse;
          uniform float uMouseVelocity;
          uniform float uMorph;
          uniform vec2  uResolution;

          attribute vec3  aLogoPos;
          attribute float aHasTarget;

          varying float vAlpha;
          varying float vGlow;

          void main() {
            // Interpolate grid ↔ logo
            vec3 pos = mix(position, aLogoPos, uMorph);

            float d      = distance(pos.xy, uMouse.xy);
            
            // Base radius + scales up based on mouse speed
            float radius = 1.5 + uMouseVelocity * 1.5;

            // ── Bulge repulsion ──
            // Modulated by uMouseVelocity so it scales with movement speed
            float bulgeWeight = mix(1.0, 0.65, uMorph) * uMouseVelocity * 1.5;

            if (d < radius) {
              float f   = pow(1.0 - d / radius, 2.0);
              vec2  dir = normalize(pos.xy - uMouse.xy + 0.0001);
              pos.xy   += dir * f * 0.6 * bulgeWeight;
              pos.z    += f * 0.4 * bulgeWeight;
            }

            // ── Logo-mode: magnetic pull + spotlight glow ──
            float glowRadius = 1.0 + uMouseVelocity * 0.8;
            vGlow = 0.0;

            if (uMorph > 0.1 && d < glowRadius && aHasTarget > 0.5) {
              // Fade effect when mouse stops moving
              float proximity = (1.0 - d / glowRadius) * uMouseVelocity;
              float morphFactor = smoothstep(0.1, 0.6, uMorph);

              // Gentle magnetic pull toward cursor
              vec2 pullDir = normalize(uMouse.xy - pos.xy + 0.0001);
              pos.xy += pullDir * proximity * 0.08 * morphFactor;

              // Glow intensity for fragment shader
              vGlow = proximity * morphFactor;
            }

            // Alpha: grid → 0.4 uniform │ logo → target 0.95, non-target 0
            vAlpha = mix(0.4, aHasTarget > 0.5 ? 0.95 : 0.0, uMorph);

            // Size: grid → uniform 2.64 (+20%) │ logo → target 3.8, non-target 0
            float sz = mix(2.64, aHasTarget > 0.5 ? 3.8 : 0.0, uMorph);

            // Spotlight: dots near cursor scale up in logo mode
            sz += vGlow * 1.8;

            // Kill invisible particles early
            if (sz < 0.1 || vAlpha < 0.01) {
              gl_Position = vec4(9999.0);
              return;
            }

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = sz * (uResolution.y / 800.0);
            gl_Position  = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying float vAlpha;
          varying float vGlow;

          void main() {
            if (vAlpha < 0.01) discard;
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.45) discard;
            float edge = smoothstep(0.45, 0.35, d);

            // Spotlight: boost brightness near cursor in logo mode
            vec3 col = uColor + vGlow * 0.3;

            gl_FragColor = vec4(col, edge * min(vAlpha + vGlow * 0.3, 1.0));
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

    // Mouse → world coords
    const mx = (mouseWorld.current.x * vp.width) / 2;
    const my = (mouseWorld.current.y * vp.height) / 2;
    // Smoother easing for mouse tracking
    pointsRef.current.material.uniforms.uMouse.value.lerp(
      new THREE.Vector3(mx, my, 0),
      0.12, 
    );
    
    // Calculate instantaneous mouse velocity
    let speed = 0;
    if (mouseWorld.current.x !== 9999 && previousMouseWorld.current.x !== 9999) {
      const dx = mouseWorld.current.x - previousMouseWorld.current.x;
      const dy = mouseWorld.current.y - previousMouseWorld.current.y;
      speed = Math.sqrt(dx * dx + dy * dy);
    }
    
    previousMouseWorld.current.x = mouseWorld.current.x;
    previousMouseWorld.current.y = mouseWorld.current.y;
    
    // Map speed to a reasonable range and smoothly ease it
    const targetVelocity = Math.min(speed * 40.0, 1.2); 
    smoothedVelocity.current += (targetVelocity - smoothedVelocity.current) * 0.1;
    
    pointsRef.current.material.uniforms.uMouseVelocity.value = smoothedVelocity.current;

    // Smooth morph easing
    const target = inCenter.current ? 1.0 : 0.0;
    morphProgress.current += (target - morphProgress.current) * 0.084; // Slower by ~30%
    pointsRef.current.material.uniforms.uMorph.value = morphProgress.current;

    pointsRef.current.material.uniforms.uResolution.value.set(
      state.size.width,
      state.size.height,
    );
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(gridPositions, 3));
    g.setAttribute('aLogoPos', new THREE.BufferAttribute(logoPositions, 3));
    g.setAttribute('aHasTarget', new THREE.BufferAttribute(hasTarget, 1));
    return g;
  }, [gridPositions, logoPositions, hasTarget]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

/* ═══════════════════════ Main wrapper ═══════════════════════ */
export default function LogoParticles() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/logo.svg';
    img.onload = () => {
      /* ── 1. Sample logo pixels ── */
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const sw = 250;
      const aspect = img.height / img.width;
      const sh = Math.round(sw * aspect);
      canvas.width = sw;
      canvas.height = sh;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, sw, sh);
      ctx.drawImage(img, 0, 0, sw, sh);
      const imgData = ctx.getImageData(0, 0, sw, sh).data;

      const logoW = 5;
      const logoH = logoW * aspect;
      const logoPoints = [];
      const logoStep = 4;
      for (let y = 0; y < sh; y += logoStep) {
        for (let x = 0; x < sw; x += logoStep) {
          if (imgData[(y * sw + x) * 4] > 80) {
            logoPoints.push({
              x: (x / sw - 0.5) * logoW,
              y: -(y / sh - 0.5) * logoH,
            });
          }
        }
      }
      // Sort from centre outward so inner dots claim nearest grid dots first
      logoPoints.sort(
        (a, b) => a.x * a.x + a.y * a.y - (b.x * b.x + b.y * b.y),
      );

      /* ── 2. Create uniform grid ── */
      const viewW = 19;
      const viewH = 10.5;
      const cols = 80;
      const rows = 48;
      const total = cols * rows;
      const grid = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          grid.push({
            x: ((c + 0.5) / cols - 0.5) * viewW,
            y: ((r + 0.5) / rows - 0.5) * viewH,
          });
        }
      }

      /* ── 3. Nearest-neighbour 1:1 assignment ── */
      const claimed = new Uint8Array(total);
      const assignment = new Int32Array(total).fill(-1);

      for (let li = 0; li < logoPoints.length; li++) {
        const lp = logoPoints[li];
        let best = Infinity;
        let bestGi = -1;
        for (let gi = 0; gi < total; gi++) {
          if (claimed[gi]) continue;
          const dx = grid[gi].x - lp.x;
          const dy = grid[gi].y - lp.y;
          const dd = dx * dx + dy * dy;
          if (dd < best) {
            best = dd;
            bestGi = gi;
          }
        }
        if (bestGi >= 0) {
          assignment[bestGi] = li;
          claimed[bestGi] = 1;
        }
      }

      /* ── 4. Build typed-array buffers ── */
      const positions = new Float32Array(total * 3);
      const logoPositions = new Float32Array(total * 3);
      const hasTarget = new Float32Array(total);

      for (let i = 0; i < total; i++) {
        // Grid position (always set)
        positions[i * 3] = grid[i].x;
        positions[i * 3 + 1] = grid[i].y;
        positions[i * 3 + 2] = 0;

        if (assignment[i] >= 0) {
          // Has a logo target → morph here
          const lp = logoPoints[assignment[i]];
          logoPositions[i * 3] = lp.x;
          logoPositions[i * 3 + 1] = lp.y;
          logoPositions[i * 3 + 2] = 0;
          hasTarget[i] = 1;
        } else {
          // No target → scatter outward along its angle from centre
          const a = Math.atan2(grid[i].y, grid[i].x);
          logoPositions[i * 3] = Math.cos(a) * 14;
          logoPositions[i * 3 + 1] = Math.sin(a) * 14;
          logoPositions[i * 3 + 2] = 0;
          hasTarget[i] = 0;
        }
      }

      setData({ gridPositions: positions, logoPositions, hasTarget });
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
      <div className="w-full h-full pointer-events-auto">
        {data && (
          <Canvas
            orthographic
            camera={{
              zoom: 100,
              position: [0, 0, 10],
              near: 0.1,
              far: 100,
            }}
            gl={{ antialias: true }}
          >
            <ParticleSystem
              gridPositions={data.gridPositions}
              logoPositions={data.logoPositions}
              hasTarget={data.hasTarget}
            />
          </Canvas>
        )}
      </div>
    </div>
  );
}
