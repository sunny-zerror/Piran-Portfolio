"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';


const ParticleSystem = ({ gridPositions, logoPositions, randomDirs, orbitData, edgeDists, hasTarget, trailData }) => {
  const pointsRef = useRef();
  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));
  const hoverStrength = useRef(0.0);
  const morphProgress = useRef(0);
  const inCenter = useRef(false);

  const trailPhase = useRef(0);
  const detachPhase = useRef(0);
  const trailStartTime = useRef(-1);

  const scrollProgress = useRef(0);

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
    }, 4000);

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
          uTrailTime: { value: 0 },
          uMorph: { value: 0 },
          uScroll: { value: 0.0 },
          uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
          uHover: { value: 0.0 },
          uResolution: { value: new THREE.Vector2() },
          uColor: { value: new THREE.Color('#ffffff') },
          uSizeScale: { value: 1.0 },
          uTrailPhase: { value: 0.0 },
          uDetachPhase: { value: 0.0 },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uTrailTime;
          uniform float uMorph;
          uniform float uScroll;
          uniform vec3  uMouse;
          uniform float uHover;
          uniform vec2  uResolution;
          uniform float uSizeScale;
          uniform float uTrailPhase;
          uniform float uDetachPhase;

          attribute vec3  aLogoPos;
          attribute vec3  aRandomDir;
          attribute vec3  aOrbit;
          attribute float aHasTarget;
          attribute float aEdgeDist;
          attribute vec4  aTrailCurve;
          attribute vec3  aTrailParams;
          attribute vec3  aTrailCenter;

          varying float vAlpha;
          varying float vGlow;
          varying float vShadow;

          vec2 curvePosition(float curveType, float t, float radius, float aspect, float phaseOffset) {
            float angle = t * 6.28318 + phaseOffset;
            
            float h1 = sin(t * 3.14 + phaseOffset * 2.0);
            float h2 = cos(t * 2.71 + phaseOffset * 3.0);
            float h3 = sin(t * 4.33 + phaseOffset * 1.5);
            
            if (curveType < 0.5) {
              return vec2(
                cos(angle + h1 * 0.5) * radius * aspect + h2 * 4.0,
                sin(angle + h2 * 0.5) * radius + h3 * 4.0
              );
            } else if (curveType < 1.5) {
              return vec2(
                cos(angle) * radius * aspect + h1 * 5.0,
                sin(angle * 2.0 + h3) * radius * 0.8 + h2 * 3.0
              );
            } else {
              return vec2(
                sin(angle * 1.3 + h2) * radius * aspect * 1.2,
                cos(angle * 1.7 + h1) * radius + h3 * 3.0
              );
            }
          }

          void main() {
            float flySpeed   = aOrbit.x;
            float flyDelay   = aOrbit.y;
            float startDepth = aOrbit.z;

            float curveIndex = aTrailCurve.x;
            float posOnCurve = aTrailCurve.y;
            float curveType  = aTrailCurve.z;
            float curveRadius = aTrailCurve.w;
            float curveSpeed = aTrailParams.x;
            float phaseOffset = aTrailParams.y;
            float curveAspect = aTrailParams.z;

            
            float trailActive = 1.0 - smoothstep(0.7, 1.0, uTrailPhase);
            float rawDetach = smoothstep(0.0, 1.0, uDetachPhase);
            float detachEased = rawDetach * rawDetach * (3.0 - 2.0 * rawDetach); // extra smooth

            float forwardTime = uTime + flyDelay * 0.5;
            float depthZ = mod(-startDepth * 1.5 + forwardTime * 2.0 * flySpeed, 35.0) - 20.0;
            
            vec3 streamPos = vec3(
              aRandomDir.xy * (4.0 + (depthZ + 10.0) * 0.45),
              depthZ
            );

            float trailTime = uTrailTime * curveSpeed;
            float particleT = posOnCurve + trailTime;
            
            vec2 trailXY = curvePosition(curveType, particleT, curveRadius, curveAspect, phaseOffset);
            
            trailXY += aTrailCenter.xy;
            
            float trailThickness = 0.5;
            trailXY += aRandomDir.xy * trailThickness;
            
            float trailZ = sin(particleT * 6.28318 + curveIndex * 0.7) * 0.5;
            vec3 trailPos = vec3(trailXY, trailZ);

            vec3 logoFormationPos = mix(trailPos, aLogoPos, detachEased);

            vec3 scrollRandomOffset = aRandomDir * (uScroll * 30.0);
            logoFormationPos += scrollRandomOffset;

            vec3 pos;
            if (aHasTarget > 0.5) {
              if (uTrailPhase < 0.01 && uDetachPhase < 0.01) {
                pos = trailPos;
              } else if (uDetachPhase < 0.01) {
                pos = trailPos;
              } else {
                pos = logoFormationPos;
              }
            } else {
              if (uDetachPhase < 0.01) {
                pos = trailPos;
              } else {
                vec3 outsideCorner = vec3(
                  aTrailCenter.xy * 2.5,
                  (aRandomDir.z - 0.5) * 3.0
                );
                vec3 nearLogo = vec3(
                  aRandomDir.x * 1.5,
                  aRandomDir.y * 1.5,
                  (aRandomDir.z - 0.5) * 2.0
                );
                float convergeEased = smoothstep(0.0, 1.0, uDetachPhase);
                pos = mix(outsideCorner, nearLogo, convergeEased);
              }
            }
            
            float normalizedDist = aEdgeDist;
            float morphEased = detachEased;
            // Removed bowl/globe Z-offset and ripple wave to ensure the logo is perfectly flat.

            vShadow = 1.0;
            float d = distance(pos.xy, uMouse.xy);
            
            float bulgeRadius = 1.1;
            float falloff = exp(-d * d / (bulgeRadius * bulgeRadius));
            
            if (falloff > 0.01 && morphEased > 0.1) {
              pos.z += falloff * 0.55 * uHover;
              vec2 dir = normalize(pos.xy - uMouse.xy + 0.0001);
              pos.xy += dir * falloff * 0.55 * uHover;
            }

            float glowRadius = 1.3;
            vGlow = 0.0;

            if (morphEased > 0.1 && d < glowRadius && aHasTarget > 0.5) {
              float proximity = smoothstep(glowRadius, 0.0, d) * uHover;
              float morphFactor = smoothstep(0.1, 0.6, morphEased);
              vGlow = proximity * morphFactor;
            }

            float opacityWave = 0.0;
            if (morphEased > 0.1 && aHasTarget > 0.5) {
              float angle = atan(aLogoPos.y, aLogoPos.x);
              float sweep = sin(angle * 3.0 - uTime * 2.5) * 0.5 + 0.5;
              float distFromCenter = length(aLogoPos.xy);
              float radialWave = sin(distFromCenter * 5.0 - uTime * 3.0) * 0.5 + 0.5;

              float borderWeight = mix(0.5, 1.25, aEdgeDist);
              opacityWave = (sweep * 0.6 + radialWave * 0.4) * borderWeight;
            }

            float logoAlpha = 0.45 + opacityWave * 0.55; 
            
            if (aHasTarget > 0.5) {
              // --- Calculate Trail Alpha & Size ---
              float trailFadeIn = smoothstep(0.0, 0.15, uTrailPhase + 0.1);
              float headPos = fract(trailTime);
              float distFromHead = fract(headPos - posOnCurve);
              float tailFade = smoothstep(0.85, 0.0, distFromHead);
              
              float trailAlpha = trailFadeIn * tailFade * 0.95;
              float trailGlow = tailFade * 0.6;
              float trailSz = (3.0 + tailFade * 3.5) * trailFadeIn;

              // --- Calculate Logo Alpha & Size ---
              float logoSparkleFreq = 2.5 + sin(aLogoPos.x * 35.0 + aLogoPos.y * 45.0) * 1.5;
              float logoSparklePhase = aLogoPos.x * 25.0 + aLogoPos.y * 35.0 + uTime * 0.4;
              float logoSparkle = sin(uTime * logoSparkleFreq + logoSparklePhase) * 0.5 + 0.5;
              float logoTwinkle = pow(logoSparkle, 3.0) * 1.6; 
              
              float targetGlow = logoTwinkle * 1.2;
              float targetAlpha = clamp(logoAlpha + logoTwinkle * 0.5, 0.0, 1.0);
              
              float sizeCurve = pow(normalizedDist, 2.5);
              float logoTargetSize = mix(1.2, 4.5, sizeCurve); 
              float targetSz = logoTargetSize + targetGlow * 2.0 + logoTwinkle * 1.2;

              // --- Seamlessly Mix Them ---
              float scrollFade = clamp(1.0 - uScroll * 1.5, 0.0, 1.0);
              
              vAlpha = mix(trailAlpha, targetAlpha, morphEased) * scrollFade;
              vGlow = mix(trailGlow, targetGlow, morphEased);
              float sz = mix(trailSz, targetSz, morphEased) * scrollFade;
              
              // Boost opacity midway through the morph so invisible trail particles fade in nicely
              float morphBoost = sin(morphEased * 3.14159) * 0.5;
              vAlpha = max(vAlpha, morphBoost * scrollFade);
              
              if (sz < 0.1 || vAlpha < 0.01) {
                gl_Position = vec4(9999.0);
                return;
              }
              
              vec4 mv = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = sz * (uResolution.y / 800.0) * uSizeScale;
              gl_Position  = projectionMatrix * mv;
            } else {
              if (uDetachPhase < 0.01) {
                float trailFadeIn = smoothstep(0.0, 0.15, uTrailPhase + 0.1);
                float headPos = fract(uTime * curveSpeed);
                float distFromHead = fract(headPos - posOnCurve);
                float tailFade = smoothstep(0.85, 0.0, distFromHead);
                
                vAlpha = trailFadeIn * tailFade * 0.8;
                vGlow = tailFade * 0.5;
                
                float sz = (2.5 + tailFade * 3.0) * trailFadeIn;
                
                if (sz < 0.1 || vAlpha < 0.01) {
                  gl_Position = vec4(9999.0);
                  return;
                }
                
                vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = sz * (uResolution.y / 800.0) * uSizeScale;
                gl_Position  = projectionMatrix * mv;
              } else {
                float convergeProgress = smoothstep(0.0, 1.0, uDetachPhase);
                
                float sparkleFreq = 6.0 + sin(aRandomDir.z * 100.0) * 4.0;
                float sparklePhase = aOrbit.y * 12.0 + aRandomDir.x * 50.0;
                float sparkle = sin(uTime * sparkleFreq + sparklePhase) * 0.5 + 0.5;
                float twinkle = pow(sparkle, 4.0) * 1.5;
                
                float flyAlpha = sin(convergeProgress * 3.14159) * 0.8 + 0.1;
                vAlpha = flyAlpha * mix(0.7, 1.0, sparkle * 0.3);
                vGlow = twinkle * 0.6;
                
                float sz = (2.0 + twinkle * 1.5) * (1.0 - convergeProgress * 0.5);
                
                float scrollFade = clamp(1.0 - uScroll * 1.5, 0.0, 1.0);
                vAlpha *= scrollFade;
                sz *= scrollFade;
                
                if (sz < 0.1 || vAlpha < 0.01) {
                  gl_Position = vec4(9999.0);
                  return;
                }
                
                vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = sz * (uResolution.y / 800.0) * uSizeScale;
                gl_Position  = projectionMatrix * mv;
              }
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

  const TRAIL_SWEEP_DURATION = 0.5;
  const DETACH_DURATION = 1.0;

  useFrame((state) => {
    if (!pointsRef.current) return;
    const vp = state.viewport;

    const isHovering = mouseWorld.current.x !== 9999;
    hoverStrength.current += ((isHovering ? 1.0 : 0.0) - hoverStrength.current) * 0.12;
    pointsRef.current.material.uniforms.uHover.value = hoverStrength.current;

    if (isHovering) {
      const mx = (mouseWorld.current.x * vp.width) / 2;
      const my = (mouseWorld.current.y * vp.height) / 2;

      if (pointsRef.current.material.uniforms.uMouse.value.x === 9999) {
        pointsRef.current.material.uniforms.uMouse.value.set(mx, my, 0);
      } else {
        pointsRef.current.material.uniforms.uMouse.value.lerp(
          new THREE.Vector3(mx, my, 0),
          0.2
        );
      }
    }

    const elapsed = state.clock.elapsedTime;
    let currentTrailTime = elapsed;

    if (inCenter.current && trailStartTime.current < 0) {
      trailStartTime.current = elapsed;
    }

    if (trailStartTime.current >= 0) {
      const timeSinceStart = elapsed - trailStartTime.current;

      trailPhase.current = Math.min(timeSinceStart / TRAIL_SWEEP_DURATION, 1.0);

      if (timeSinceStart > TRAIL_SWEEP_DURATION) {
        const detachTime = timeSinceStart - TRAIL_SWEEP_DURATION;
        const detachPhaseRaw = Math.min(detachTime / DETACH_DURATION, 1.0);
        detachPhase.current = detachPhaseRaw;
        
        // Smoothly decelerate trail movement to 0 instead of freezing instantly
        const addedTime = DETACH_DURATION * (detachPhaseRaw - 0.5 * detachPhaseRaw * detachPhaseRaw);
        currentTrailTime = trailStartTime.current + TRAIL_SWEEP_DURATION + addedTime;
      }
    }

    pointsRef.current.material.uniforms.uTrailPhase.value = trailPhase.current;
    pointsRef.current.material.uniforms.uDetachPhase.value = detachPhase.current;

    const target = detachPhase.current > 0 ? 1.0 : 0.0;
    morphProgress.current += (target - morphProgress.current) * 0.035;
    pointsRef.current.material.uniforms.uMorph.value = morphProgress.current;

    pointsRef.current.material.uniforms.uScroll.value +=
      (scrollProgress.current - pointsRef.current.material.uniforms.uScroll.value) * 0.1;

    pointsRef.current.material.uniforms.uTime.value = elapsed;
    pointsRef.current.material.uniforms.uTrailTime.value = currentTrailTime;

    pointsRef.current.material.uniforms.uResolution.value.set(
      state.size.width,
      state.size.height,
    );

    const isMobileSize = state.size.width < 768;
    pointsRef.current.material.uniforms.uSizeScale.value = isMobileSize ? 0.65 : 1.0;
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(gridPositions, 3));
    g.setAttribute('aLogoPos', new THREE.BufferAttribute(logoPositions, 3));
    g.setAttribute('aRandomDir', new THREE.BufferAttribute(randomDirs, 3));
    g.setAttribute('aOrbit', new THREE.BufferAttribute(orbitData, 3));
    g.setAttribute('aEdgeDist', new THREE.BufferAttribute(edgeDists, 1));
    g.setAttribute('aHasTarget', new THREE.BufferAttribute(hasTarget, 1));
    g.setAttribute('aTrailCurve', new THREE.BufferAttribute(trailData.trailCurve, 4));
    g.setAttribute('aTrailParams', new THREE.BufferAttribute(trailData.trailParams, 3));
    g.setAttribute('aTrailCenter', new THREE.BufferAttribute(trailData.trailCenter, 3));
    return g;
  }, [gridPositions, logoPositions, randomDirs, orbitData, edgeDists, hasTarget, trailData]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};


export default function LogoParticles() {
  const [data, setData] = useState(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoom(60);
      } else {
        setZoom(100);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/logo.svg';
    img.onload = () => {
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const sw = 500;
      const aspect = img.height / img.width;
      const sh = Math.round(sw * aspect);
      canvas.width = sw;
      canvas.height = sh;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, sw, sh);
      ctx.drawImage(img, 0, 0, sw, sh);
      const imgData = ctx.getImageData(0, 0, sw, sh).data;

      const isMobile = window.innerWidth < 768;
      const logoW = 5;
      const logoH = logoW * aspect;
      const logoPoints = [];
      const boundaryPoints = [];
      const logoStep = isMobile ? 9 : 5;

      const colsCount = Math.ceil(sw / logoStep);
      const rowsCount = Math.ceil(sh / logoStep);

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
                let w = weight > 128 ? weight : 0;
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

      for (let r = 0; r < rowsCount; r++) {
        for (let c = 0; c < colsCount; c++) {
          const b = blocks[r][c];
          if (b) {
            let isBoundary = false;
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

      logoPoints.forEach(p => {
        p.normalizedEdge = maxDist > 0 ? 1.0 - (p.edgeDist / maxDist) : 1.0;
      });

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      logoPoints.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      logoPoints.forEach(p => {
        p.x -= cx;
        p.y -= cy;
      });

      logoPoints.sort(
        (a, b) => a.x * a.x + a.y * a.y - (b.x * b.x + b.y * b.y),
      );

      
      const ambientCount = 0; // Removed ambient particles to stop the circular globe animation
      const total = logoPoints.length + ambientCount;
      const spreadX = 30;
      const spreadY = 18;
      const grid = [];
      for (let i = 0; i < total; i++) {
        grid.push({
          x: (Math.random() - 0.5) * spreadX,
          y: (Math.random() - 0.5) * spreadY,
        });
      }

      
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

      
      const NUM_CURVES = 35; // increased to 35 trails

      const curves = [];
      for (let ci = 0; ci < NUM_CURVES; ci++) {
        const curveType = ci % 3;
        // Large radius to spread across the entire screen
        const radius = 8.0 + Math.random() * 10.0;
        // Slightly slower, more majestic movement
        const speed = 0.12 + Math.random() * 0.15;
        const phaseOffset = Math.random() * Math.PI * 2;
        const aspectRatio = 0.6 + Math.random() * 0.8;
        
        // Random center spread broadly across the viewport
        const centerX = (Math.random() - 0.5) * 25.0;
        const centerY = (Math.random() - 0.5) * 15.0;

        curves.push({ curveType, radius, speed, phaseOffset, aspectRatio, centerX, centerY });
      }

      const trailCurveArray = new Float32Array(total * 4);
      const trailParamsArray = new Float32Array(total * 3);
      const trailCenterArray = new Float32Array(total * 3);

      const particlesPerCurve = Math.ceil(total / NUM_CURVES);

      for (let i = 0; i < total; i++) {
        const curveIdx = Math.floor(i / particlesPerCurve) % NUM_CURVES;
        const positionInCurve = (i % particlesPerCurve) / particlesPerCurve;

        const curve = curves[curveIdx];

        trailCurveArray[i * 4] = curveIdx;
        trailCurveArray[i * 4 + 1] = positionInCurve;
        trailCurveArray[i * 4 + 2] = curve.curveType;
        trailCurveArray[i * 4 + 3] = curve.radius;

        trailParamsArray[i * 3] = curve.speed;
        trailParamsArray[i * 3 + 1] = curve.phaseOffset;
        trailParamsArray[i * 3 + 2] = curve.aspectRatio;

        trailCenterArray[i * 3] = curve.centerX;
        trailCenterArray[i * 3 + 1] = curve.centerY;
        trailCenterArray[i * 3 + 2] = 0;
      }

      
      const positions = new Float32Array(total * 3);
      const logoPositions = new Float32Array(total * 3);
      const randomDirsArray = new Float32Array(total * 3);
      const orbitArray = new Float32Array(total * 3);
      const edgeDists = new Float32Array(total);
      const hasTarget = new Float32Array(total);

      for (let i = 0; i < total; i++) {
        positions[i * 3] = grid[i].x;
        positions[i * 3 + 1] = grid[i].y;
        positions[i * 3 + 2] = 0;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const rx = Math.sin(phi) * Math.cos(theta);
        const ry = Math.sin(phi) * Math.sin(theta);
        const rz = Math.cos(phi);

        randomDirsArray[i * 3] = rx;
        randomDirsArray[i * 3 + 1] = ry;
        randomDirsArray[i * 3 + 2] = rz;

        const burstSpeed = 0.9 + Math.random() * 0.8;
        const burstDelay = Math.random() * 0.4;
        const startRadius = 6 + Math.random() * 12;
        orbitArray[i * 3] = burstSpeed;
        orbitArray[i * 3 + 1] = burstDelay;
        orbitArray[i * 3 + 2] = startRadius;

        if (assignment[i] >= 0) {
          const lp = logoPoints[assignment[i]];
          logoPositions[i * 3] = lp.x;
          logoPositions[i * 3 + 1] = lp.y;
          logoPositions[i * 3 + 2] = 0;
          edgeDists[i] = lp.normalizedEdge;
          hasTarget[i] = 1;
        } else {
          const a = Math.atan2(grid[i].y, grid[i].x);
          logoPositions[i * 3] = Math.cos(a) * 20;
          logoPositions[i * 3 + 1] = Math.sin(a) * 20;
          logoPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
          edgeDists[i] = 0.0;
          hasTarget[i] = 0;
        }
      }

      setData({
        gridPositions: positions,
        logoPositions,
        randomDirs: randomDirsArray,
        orbitData: orbitArray,
        edgeDists,
        hasTarget,
        trailData: {
          trailCurve: trailCurveArray,
          trailParams: trailParamsArray,
          trailCenter: trailCenterArray,
        }
      });
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
      <div className="w-full h-full pointer-events-auto">
        {data && (
          <Canvas
            orthographic
            camera={{
              zoom: zoom,
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
              trailData={data.trailData}
            />
          </Canvas>
        )}
      </div>
    </div>
  );
}
