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

  const scrollProgress = useRef(0);

  // Global mouse tracking, scroll tracking and intro animation
  useEffect(() => {
    const onMove = (e) => {
      mouseWorld.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseWorld.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onLeave = () => {
      mouseWorld.current.set(9999, 9999, 0);
    };
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress.current = Math.min(window.scrollY / (window.innerHeight * 0.8), 1.0);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll);

    const timeoutId = setTimeout(() => {
      inCenter.current = true;
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uScroll: { value: 0.0 },
          uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
          uHover: { value: 0.0 },
          uResolution: { value: new THREE.Vector2() },
          uColor: { value: new THREE.Color('#ffffff') },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uMorph;
          uniform float uScroll;
          uniform vec3  uMouse;
          uniform float uHover;
          uniform vec2  uResolution;

          attribute vec3  aLogoPos;
          attribute vec3  aRandomDir;
          attribute vec3  aOrbit;    // x=flySpeed, y=flyDelay, z=startDepth
          attribute float aHasTarget;
          attribute float aEdgeDist;

          varying float vAlpha;
          varying float vGlow;
          varying float vShadow;

          void main() {
            float flySpeed   = aOrbit.x;
            float flyDelay   = aOrbit.y;
            float startDepth = aOrbit.z;

            // ── Animation 1: Permanent continuous particle stream (Inwards -> Outside towards user) ──
            float forwardTime = uTime + flyDelay * 0.5;
            // Extra-slow speed factor (0.18 multiplier for ultra slow motion)
            float depthZ = mod(-startDepth * 1.5 + forwardTime * 2.0 * flySpeed, 35.0) - 20.0;
            
            vec3 streamPos = vec3(
              aRandomDir.xy * (4.0 + (depthZ + 10.0) * 0.45),
              depthZ
            );

            // ── Animation 2: Logo formation particles (Flying from OUTSIDE screen into logo position after 1 sec) ──
            vec3 outsidePos = vec3(
              normalize(aRandomDir.xy + vec2(0.001)) * (20.0 + startDepth * 1.5),
              (aRandomDir.z - 0.5) * 10.0
            );

            float morphEased = smoothstep(0.0, 1.0, uMorph);
            vec3 logoFormationPos = mix(outsidePos, aLogoPos, morphEased);

            // ── Scroll Random Dispersion Outwards ──
            // Each dot spreads out randomly off-screen along its individual random direction (aRandomDir) on scroll
            vec3 scrollRandomOffset = aRandomDir * (uScroll * 30.0);
            logoFormationPos += scrollRandomOffset;

            vec3 pos = (aHasTarget > 0.5) ? logoFormationPos : streamPos;
            
            // 3D Depth & Bowl curve for logo once formed
            float normalizedDist = aEdgeDist;
            if (aHasTarget > 0.5) {
              float zOffset = mix(0.0, -1.8 * (1.0 - normalizedDist), morphEased);
              pos.z += zOffset;
            }

            // Continuous surface ripple wave across logo body
            if (morphEased > 0.05 && aHasTarget > 0.5) {
              float waveStrength = smoothstep(0.05, 0.7, morphEased);

              float w1 = sin(pos.x * 3.0 + pos.y * 2.0 + uTime * 1.2) * 0.16;
              float w2 = sin(-pos.x * 2.0 + pos.y * 3.5 + uTime * 0.8 + 1.0) * 0.11;
              float r = length(pos.xy);
              float w3 = sin(r * 4.0 - uTime * 1.5) * 0.09;

              pos.z += (w1 + w2 + w3) * waveStrength;
            }

            vShadow = 1.0;
            float d = distance(pos.xy, uMouse.xy);
            
            // Interactive mouse dome displacement & dispersion
            float bulgeRadius = 1.1;
            float falloff = exp(-d * d / (bulgeRadius * bulgeRadius));
            
            if (falloff > 0.01 && morphEased > 0.1) {
              pos.z += falloff * 0.55 * uHover;
              vec2 dir = normalize(pos.xy - uMouse.xy + 0.0001);
              pos.xy += dir * falloff * 0.55 * uHover;
            }

            // Spotlight glow effect
            float glowRadius = 1.3;
            vGlow = 0.0;

            if (morphEased > 0.1 && d < glowRadius && aHasTarget > 0.5) {
              float proximity = smoothstep(glowRadius, 0.0, d) * uHover;
              float morphFactor = smoothstep(0.1, 0.6, morphEased);
              vGlow = proximity * morphFactor;
            }

            // Continuous pulse / luminous border dynamics
            float opacityWave = 0.0;
            if (morphEased > 0.1 && aHasTarget > 0.5) {
              float angle = atan(aLogoPos.y, aLogoPos.x);
              float sweep = sin(angle * 3.0 - uTime * 2.5) * 0.5 + 0.5;
              float distFromCenter = length(aLogoPos.xy);
              float radialWave = sin(distFromCenter * 5.0 - uTime * 3.0) * 0.5 + 0.5;

              float borderWeight = mix(0.5, 1.25, aEdgeDist);
              opacityWave = (sweep * 0.6 + radialWave * 0.4) * borderWeight;
            }

            // Luminance & particle sizing logic
            float logoAlpha = 0.45 + opacityWave * 0.55; 
            
            if (aHasTarget > 0.5) {
              // ── Full Vibrant Logo Sparkle / Twinkle Animation (Extra-slow time scale) ──
              float logoSparkleFreq = 2.5 + sin(aLogoPos.x * 35.0 + aLogoPos.y * 45.0) * 1.5;
              float logoSparklePhase = aLogoPos.x * 25.0 + aLogoPos.y * 35.0 + uTime * 0.4;
              float logoSparkle = sin(uTime * logoSparkleFreq + logoSparklePhase) * 0.5 + 0.5;
              
              // Vibrant sparkle pulse exponent
              float logoTwinkle = pow(logoSparkle, 3.0) * 1.6 * morphEased; 
              
              vGlow += logoTwinkle * 1.2;
              
              // Scale size to 0 and fade opacity to 0 on scroll smoothly
              float scrollFade = clamp(1.0 - uScroll * 1.5, 0.0, 1.0);
              vAlpha = mix(0.0, clamp(logoAlpha + logoTwinkle * 0.5, 0.0, 1.0), morphEased) * scrollFade;
              
              float sizeCurve = pow(normalizedDist, 2.5);
              float logoTargetSize = mix(1.2, 4.5, sizeCurve); 
              float sz = (mix(1.0, logoTargetSize, morphEased) + vGlow * 2.0 + logoTwinkle * 1.2) * scrollFade;
              
              if (sz < 0.1 || vAlpha < 0.01) {
                gl_Position = vec4(9999.0);
                return;
              }
              
              vec4 mv = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = sz * (uResolution.y / 800.0);
              gl_Position  = projectionMatrix * mv;
            } else {
              // Smooth opacity gradient: 0.0 at deep origin (-20.0) ramping smoothly to 1.0 at user end (+10.0)
              float streamProgress = clamp((pos.z - (-20.0)) / 30.0, 0.0, 1.0);
              // Starts at exact 0.0 opacity at origin, ramping smoothly up to 1.0
              float alphaRamp = smoothstep(0.0, 1.0, streamProgress); 
              
              // Fade out gently at the very edge end
              float endFade = smoothstep(15.0, 8.0, pos.z);
              
              // ── Dynamic Star Sparkle / Twinkle effect ──
              float sparkleFreq = 6.0 + sin(aRandomDir.z * 100.0) * 4.0;
              float sparklePhase = aOrbit.y * 12.0 + aRandomDir.x * 50.0;
              float sparkle = sin(uTime * sparkleFreq + sparklePhase) * 0.5 + 0.5;
              
              float twinkle = pow(sparkle, 4.0) * 1.5; 
              
              // Opacity starts strictly at 0.0 at origin (-20.0) and reaches 1.0
              vAlpha = alphaRamp * endFade * mix(0.7, 1.0, sparkle * 0.3);
              vGlow = twinkle * 0.6;
              
              // Particle size also scales smoothly from 0.0 at origin up to full size
              float sz = (1.75 + twinkle * 1.25) * alphaRamp;
              
              if (sz < 0.1 || vAlpha < 0.01) {
                gl_Position = vec4(9999.0);
                return;
              }
              
              vec4 mv = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = sz * (uResolution.y / 800.0);
              gl_Position  = projectionMatrix * mv;
            }
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

    // Smooth morph easing (slowed down for smooth intro build)
    const target = inCenter.current ? 1.0 : 0.0;
    morphProgress.current += (target - morphProgress.current) * 0.035; // Slower transition
    pointsRef.current.material.uniforms.uMorph.value = morphProgress.current;

    // Update scroll progress uniform smoothly
    pointsRef.current.material.uniforms.uScroll.value +=
      (scrollProgress.current - pointsRef.current.material.uniforms.uScroll.value) * 0.1;

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
      // Balanced ambient particle volume
      const total = logoPoints.length + 1200;
      const spreadX = 30;
      const spreadY = 18;
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

        // Direction vector for central burst expansion (3D sphere direction)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const rx = Math.sin(phi) * Math.cos(theta);
        const ry = Math.sin(phi) * Math.sin(theta);
        const rz = Math.cos(phi);

        randomDirsArray[i * 3] = rx;
        randomDirsArray[i * 3 + 1] = ry;
        randomDirsArray[i * 3 + 2] = rz;

        // Fall/Burst parameters: speed, delay, start distance factor
        const burstSpeed = 0.9 + Math.random() * 0.8;      // speed multiplier
        const burstDelay = Math.random() * 0.4;             // stagger delay (0s - 0.4s)
        const startRadius = 6 + Math.random() * 12;           // explosion radius multiplier
        orbitArray[i * 3] = burstSpeed;
        orbitArray[i * 3 + 1] = burstDelay;
        orbitArray[i * 3 + 2] = startRadius;

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
