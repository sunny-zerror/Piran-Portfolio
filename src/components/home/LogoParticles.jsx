"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════ Particle System ═══════════════════════ */
const ParticleSystem = ({ gridPositions, logoPositions, randomDirs, orbitData, edgeDists, hasTarget }) => {
  const pointsRef = useRef();
  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));
  const hoverStrength = useRef(0.0);
  const morphProgress = useRef(0);
  const inCenter = useRef(false);

  // Global mouse tracking and intro animation
  useEffect(() => {
    const onMove = (e) => {
      mouseWorld.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseWorld.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onLeave = () => {
      mouseWorld.current.set(9999, 9999, 0);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    // Intro animation: form logo after dots fill the screen (~2.5s)
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
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
          uHover: { value: 0.0 },
          uResolution: { value: new THREE.Vector2() },
          uColor: { value: new THREE.Color('#ffffff') },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uMorph;
          uniform vec3  uMouse;
          uniform float uHover;
          uniform vec2  uResolution;

          attribute vec3  aLogoPos;
          attribute vec3  aRandomDir;
          attribute vec3  aOrbit;    // x=fallSpeed, y=fallDelay, z=startYOffset
          attribute float aHasTarget;
          attribute float aEdgeDist;

          varying float vAlpha;
          varying float vGlow;
          varying float vShadow;

          void main() {
            // Fall from above → land at position → then morph to logo
            float fallSpeed    = aOrbit.x;
            float fallDelay    = aOrbit.y;
            float startYOffset = aOrbit.z;  // how far above landing position

            // Staggered fall timing
            float t = max(uTime - fallDelay, 0.0);

            // Fall progress: 0 (above) → 1 (landed)
            float fallProgress = clamp(t * fallSpeed, 0.0, 1.0);
            // Ease-out for natural deceleration on landing
            float easedFall = 1.0 - (1.0 - fallProgress) * (1.0 - fallProgress);

            // Landing position = position attribute (spread across screen)
            vec3 wanderPos = position;
            // Offset upward by startYOffset, reduced by eased fall
            wanderPos.y += startYOffset * (1.0 - easedFall);
            // Gentle horizontal sway while falling
            wanderPos.x += sin(t * 1.5 + position.x * 4.0) * 0.08 * (1.0 - easedFall);

            vec3 pos = mix(wanderPos, aLogoPos, uMorph);
            
            // 3D Shadow & Depth logic for logo
            float normalizedDist = aEdgeDist;
            
            // Push center back to create a 3D bowl shape
            float zOffset = mix(0.0, -2.5 * (1.0 - normalizedDist), uMorph);
            pos.z += zOffset;

            // ── Continuous wave / bulge ripple ──
            // Three sine waves traveling in different directions create
            // an organic, ocean-like undulation across the logo surface
            if (uMorph > 0.05 && aHasTarget > 0.5) {
              float waveStrength = smoothstep(0.05, 0.7, uMorph); // fade in with morph

              // Wave 1: diagonal sweep (bottom-left → top-right)
              float w1 = sin(pos.x * 3.0 + pos.y * 2.0 + uTime * 1.2) * 0.18;

              // Wave 2: opposite diagonal, slower & wider
              float w2 = sin(-pos.x * 2.0 + pos.y * 3.5 + uTime * 0.8 + 1.0) * 0.12;

              // Wave 3: radial pulse outward from center
              float r = length(pos.xy);
              float w3 = sin(r * 4.0 - uTime * 1.5) * 0.10;

              pos.z += (w1 + w2 + w3) * waveStrength;
            }

            // Shadow varying for fragment (center is darker)
            vShadow = 1.0;

            float d = distance(pos.xy, uMouse.xy);
            
            // ── Gradual Dome Bulge (no hard circle edge) ──
            // Large soft radius — effect fades smoothly, no visible boundary
            float bulgeRadius = 1.0;
            float falloff = exp(-d * d / (bulgeRadius * bulgeRadius)); // Gaussian bell curve
            
            if (falloff > 0.01 && uMorph > 0.1) {
              // Smooth dome height using gaussian — gradually builds toward center
              pos.z += falloff * 0.5 * uHover;
              
              // Gradually spread dots outward in XY — creates visible gaps near center
              vec2 dir = normalize(pos.xy - uMouse.xy + 0.0001);
              pos.xy += dir * falloff * 0.5 * uHover;
            }

            // ── Spotlight glow ──
            float glowRadius = 1.2;
            vGlow = 0.0;

            if (uMorph > 0.1 && d < glowRadius && aHasTarget > 0.5) {
              float proximity = smoothstep(glowRadius, 0.0, d) * uHover;
              float morphFactor = smoothstep(0.1, 0.6, uMorph);
              vGlow = proximity * morphFactor;
            }

            // ── Continuous Opacity Wave / Border Movement ──
            float opacityWave = 0.0;
            if (uMorph > 0.1 && aHasTarget > 0.5) {
              // Calculate angle around logo center for a rotating border sweep
              float angle = atan(aLogoPos.y, aLogoPos.x);
              
              // Traveling sweep wave along the border/shape perimeter
              float sweep = sin(angle * 3.0 - uTime * 2.5) * 0.5 + 0.5;
              
              // Radial traveling wave moving outward
              float distFromCenter = length(aLogoPos.xy);
              float radialWave = sin(distFromCenter * 5.0 - uTime * 3.0) * 0.5 + 0.5;

              // Combine border sweep and radial wave (enhance edge dots more for border emphasis)
              float borderWeight = mix(0.5, 1.2, aEdgeDist);
              opacityWave = (sweep * 0.6 + radialWave * 0.4) * borderWeight;
            }

            // Alpha: wander → 0.4 uniform │ logo → modulated by continuous opacity wave
            float logoAlpha = 0.4 + opacityWave * 0.55; 
            vAlpha = mix(0.4, aHasTarget > 0.5 ? logoAlpha : 0.0, uMorph);

            // Size curve
            float sizeCurve = pow(normalizedDist, 3.0);
            float logoTargetSize = mix(2.2, 10.0, sizeCurve); 
            float sz = mix(6.0, aHasTarget > 0.5 ? logoTargetSize : 0.0, uMorph);

            // Spotlight: dots near cursor scale up in logo mode
            sz += vGlow * 4.0;

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
          varying float vShadow;

          void main() {
            if (vAlpha < 0.01) discard;
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.45) discard;
            float edge = smoothstep(0.45, 0.35, d);

            // Spotlight: boost brightness near cursor in logo mode
            vec3 col = (uColor * vShadow) + vGlow * 0.3;

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

    // Smooth hover fade in/out
    const isHovering = mouseWorld.current.x !== 9999;
    hoverStrength.current += ((isHovering ? 1.0 : 0.0) - hoverStrength.current) * 0.12; // Faster fade
    pointsRef.current.material.uniforms.uHover.value = hoverStrength.current;

    // Responsive mouse tracking
    if (isHovering) {
      const mx = (mouseWorld.current.x * vp.width) / 2;
      const my = (mouseWorld.current.y * vp.height) / 2;

      if (pointsRef.current.material.uniforms.uMouse.value.x === 9999) {
        // Snap immediately if it was out of bounds
        pointsRef.current.material.uniforms.uMouse.value.set(mx, my, 0);
      } else {
        // Fast tracking with slight smoothing
        pointsRef.current.material.uniforms.uMouse.value.lerp(
          new THREE.Vector3(mx, my, 0),
          0.2 // Snappy response
        );
      }
    }

    // Smooth morph easing
    const target = inCenter.current ? 1.0 : 0.0;
    morphProgress.current += (target - morphProgress.current) * 0.084; // Slower by ~30%
    pointsRef.current.material.uniforms.uMorph.value = morphProgress.current;

    pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;

    pointsRef.current.material.uniforms.uResolution.value.set(
      state.size.width,
      state.size.height,
    );
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(gridPositions, 3));
    g.setAttribute('aLogoPos', new THREE.BufferAttribute(logoPositions, 3));
    g.setAttribute('aRandomDir', new THREE.BufferAttribute(randomDirs, 3));
    g.setAttribute('aOrbit', new THREE.BufferAttribute(orbitData, 3));
    g.setAttribute('aEdgeDist', new THREE.BufferAttribute(edgeDists, 1));
    g.setAttribute('aHasTarget', new THREE.BufferAttribute(hasTarget, 1));
    return g;
  }, [gridPositions, logoPositions, randomDirs, orbitData, edgeDists, hasTarget]);

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
      // Sub-pixel anti-aliasing logic to remove grid zig-zags on the edges
      const sw = 500; // Render at much higher resolution
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
      const boundaryPoints = [];
      const logoStep = 5; // 1000/12 matches the density of 250/3

      const colsCount = Math.ceil(sw / logoStep);
      const rowsCount = Math.ceil(sh / logoStep);

      // Pass 1: find center-of-mass for each block to allow smooth edge positioning
      const blocks = [];
      for (let r = 0; r < rowsCount; r++) {
        blocks[r] = [];
        for (let c = 0; c < colsCount; c++) {
          let sumWeight = 0, sumX = 0, sumY = 0, maxVal = 0;
          let startY = r * logoStep, startX = c * logoStep;

          for (let dy = 0; dy < logoStep; dy++) {
            for (let dx = 0; dx < logoStep; dx++) {
              let px = startX + dx, py = startY + dy;
              if (px < sw && py < sh) {
                let weight = imgData[(py * sw + px) * 4];
                if (weight > maxVal) maxVal = weight;
                let w = weight > 128 ? weight : 0; // high contrast weight
                sumWeight += w;
                sumX += px * w;
                sumY += py * w;
              }
            }
          }
          if (maxVal > 80 && sumWeight > 0) {
            blocks[r][c] = { avgX: sumX / sumWeight, avgY: sumY / sumWeight };
          } else {
            blocks[r][c] = null;
          }
        }
      }

      // Pass 2: generate points and find boundaries
      for (let r = 0; r < rowsCount; r++) {
        for (let c = 0; c < colsCount; c++) {
          const b = blocks[r][c];
          if (b) {
            let isBoundary = false;
            // Check adjacent blocks
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                let nr = r + dr, nc = c + dc;
                if (nr < 0 || nr >= rowsCount || nc < 0 || nc >= colsCount || !blocks[nr][nc]) {
                  isBoundary = true;
                }
              }
            }
            const pt = {
              x: (b.avgX / sw - 0.5) * logoW,
              y: -(b.avgY / sh - 0.5) * logoH,
              isBoundary
            };
            logoPoints.push(pt);
            if (isBoundary) boundaryPoints.push(pt);
          }
        }
      }

      // Calculate distance to nearest boundary for each point
      let maxDist = 0;
      logoPoints.forEach(p => {
        if (p.isBoundary) {
          p.edgeDist = 0;
        } else {
          let minDist = Infinity;
          boundaryPoints.forEach(bp => {
            const dx = p.x - bp.x;
            const dy = p.y - bp.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < minDist) minDist = d;
          });
          p.edgeDist = minDist;
          if (minDist > maxDist) maxDist = minDist;
        }
      });

      // Normalize edge distance (1.0 = boundary, 0.0 = innermost)
      logoPoints.forEach(p => {
        p.normalizedEdge = maxDist > 0 ? 1.0 - (p.edgeDist / maxDist) : 1.0;
      });

      // Calculate bounding box to perfectly center the logo and fix any asymmetrical weighting
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      logoPoints.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      // Apply exact centering
      logoPoints.forEach(p => {
        p.x -= cx;
        p.y -= cy;
      });

      // Sort from centre outward so inner dots claim nearest grid dots first
      logoPoints.sort(
        (a, b) => a.x * a.x + a.y * a.y - (b.x * b.x + b.y * b.y),
      );

      /* ── 2. Landing positions: fill the entire viewport ── */
      const total = logoPoints.length + 400;
      const spreadX = 20;   // full viewport width coverage
      const spreadY = 12;   // full viewport height coverage
      const grid = [];
      for (let i = 0; i < total; i++) {
        grid.push({
          x: (Math.random() - 0.5) * spreadX,
          y: (Math.random() - 0.5) * spreadY,  // spread across full screen
        });
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
      const randomDirsArray = new Float32Array(total * 3);
      const orbitArray = new Float32Array(total * 3);
      const edgeDists = new Float32Array(total);
      const hasTarget = new Float32Array(total);

      for (let i = 0; i < total; i++) {
        // Landing position: scattered across the full viewport
        positions[i * 3] = grid[i].x;
        positions[i * 3 + 1] = grid[i].y;
        positions[i * 3 + 2] = 0;

        // Legacy attribute (kept for compatibility)
        randomDirsArray[i * 3] = 0;
        randomDirsArray[i * 3 + 1] = 0;
        randomDirsArray[i * 3 + 2] = 0;

        // Fall parameters: fallSpeed, fallDelay, startYOffset
        const fallSpeed = 0.8 + Math.random() * 0.7;       // 0.8–1.5 (progress/sec)
        const fallDelay = Math.random() * 0.8;              // stagger: 0–0.8s
        const startYOffset = 10 + Math.random() * 8;           // 10–18 units above landing
        orbitArray[i * 3] = fallSpeed;
        orbitArray[i * 3 + 1] = fallDelay;
        orbitArray[i * 3 + 2] = startYOffset;

        if (assignment[i] >= 0) {
          // Has a logo target → morph here
          const lp = logoPoints[assignment[i]];
          logoPositions[i * 3] = lp.x;
          logoPositions[i * 3 + 1] = lp.y;
          logoPositions[i * 3 + 2] = 0;
          edgeDists[i] = lp.normalizedEdge;
          hasTarget[i] = 1;
        } else {
          // No target → scatter outward along its angle from centre
          const a = Math.atan2(grid[i].y, grid[i].x);
          logoPositions[i * 3] = Math.cos(a) * 20;
          logoPositions[i * 3 + 1] = Math.sin(a) * 20;
          logoPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
          edgeDists[i] = 0.0;
          hasTarget[i] = 0;
        }
      }

      setData({ gridPositions: positions, logoPositions, randomDirs: randomDirsArray, orbitData: orbitArray, edgeDists, hasTarget });
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
              randomDirs={data.randomDirs}
              orbitData={data.orbitData}
              edgeDists={data.edgeDists}
              hasTarget={data.hasTarget}
            />
          </Canvas>
        )}
      </div>
    </div>
  );
}
