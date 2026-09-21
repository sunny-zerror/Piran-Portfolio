"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── GLSL Vertex Shader ─────────────────────────────────────────────────────
const VERT_SRC = `
  attribute vec2 aTargetPos;
  attribute float aHand;
  attribute float aBaseAlpha;
  attribute float aDepth;
  attribute vec2 aNormPos;
  attribute float aLogoTargetSize;

  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uViewport;
  uniform vec2 uMouse;
  uniform float uHoverStrength;
  uniform float uSizeScale;
  uniform float uDpr;

  varying float vAlpha;
  varying float vDepth;

  void main() {
    float progress = clamp(uScrollProgress, 0.0, 1.0);

    // 3D depth-based parallax scroll offset
    float depthMul = 0.68 + aDepth * 0.64;
    float leftOff  = (1.0 - progress) * (-uViewport.x * 0.55);
    float rightOff = (1.0 - progress) * ( uViewport.x * 0.55);
    float scrollX  = mix(leftOff, rightOff, aHand) * depthMul;

    // Micro organic displacement based on depth to avoid flat grid perception
    vec2 organicNoise = vec2(
      sin(aNormPos.x * 38.0 + aNormPos.y * 24.0 + aHand * 9.0),
      cos(aNormPos.y * 38.0 + aNormPos.x * 24.0 + aHand * 11.0)
    ) * (1.0 - aDepth * 0.5) * 1.8;

    vec2 pos = aTargetPos + organicNoise + vec2(scrollX, 0.0);

    // Hover bulge displacement
    float bulgeR = uViewport.y * 0.15;
    float pushDist = uViewport.y * 0.07;

    float extraGlow = 0.0;

    if (uHoverStrength > 0.001 && uMouse.x < 9000.0) {
      vec2 diff = pos - uMouse;
      float d = length(diff);

      float falloff = exp(-(d * d) / (bulgeR * bulgeR));
      if (falloff > 0.001) {
        vec2 dir = diff / (d + 0.0001);
        pos += dir * falloff * pushDist * uHoverStrength;
      }

      float glowR = uViewport.y * 0.18;
      if (d < glowR) {
        extraGlow = (1.0 - d / glowR) * uHoverStrength;
      }
    }

    // Sparkle / twinkle animation
    float px = aNormPos.x * 6.0 + aHand * 12.0;
    float py = aNormPos.y * 6.0;
    float freq  = 2.2 + sin(px * 25.0 + py * 35.0) * 1.3;
    float phase = px * 18.0 + py * 28.0 + uTime * 0.4;
    float sparkle = sin(uTime * freq + phase) * 0.5 + 0.5;
    float twinkle = pow(sparkle, 3.0) * 1.1;

    float glow = twinkle * 0.7 + extraGlow * 1.2;

    // Depth-based alpha
    float depthAlpha = 0.28 + aDepth * 0.72;
    vAlpha = clamp(aBaseAlpha * depthAlpha + twinkle * 0.28 + extraGlow * 0.28, 0.06, 1.0);
    vDepth = aDepth;

    // Depth-based point size
    float depthSize = 0.65 + aDepth * 0.70;
    float sz = (aLogoTargetSize + glow * 0.7 + twinkle * 0.5) * depthSize;
    gl_PointSize = max(2.0, sz * uSizeScale * uDpr);

    // Convert pixel coords → clip space
    vec2 clip = (pos / uViewport) * 2.0 - 1.0;
    clip.y = -clip.y;
    gl_Position = vec4(clip, 0.0, 1.0);
  }
`;

// ─── GLSL Fragment Shader ────────────────────────────────────────────────────
const FRAG_SRC = `
  precision highp float;

  varying float vAlpha;
  varying float vDepth;

  uniform vec3 uDotColor;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float dist = length(c);

    // Smooth anti-aliased circle edge
    float circle = 1.0 - smoothstep(0.35, 0.50, dist);
    if (circle <= 0.001) discard;

    // Depth-driven surface lighting for realistic 3D volume
    float brightness = 0.72 + vDepth * 0.38;
    vec3 col = uDotColor * brightness;

    float a = circle * vAlpha;
    gl_FragColor = vec4(col * a, a);
  }
`;

// ─── WebGL helpers ───────────────────────────────────────────────────────────
function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(gl, vSrc, fSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fSrc);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function parseRGB(str) {
  const parts = str.split(",").map((s) => parseFloat(s.trim()) / 255);
  return [parts[0] ?? 1, parts[1] ?? 1, parts[2] ?? 1];
}

// Pseudo-random hash helper for organic jitter
function pseudoHash(x, y) {
  const sinVal = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return sinVal - Math.floor(sinVal);
}

// ─── Component ───────────────────────────────────────────────────────────────
const HandParticlesCanvas = ({
  leftHandSrc = "/images/leftFinger.png",
  rightHandSrc = "/images/rightFinger.png",
  colorBg = "#0B1A2C",
  colorDots = "255, 255, 255",
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mousePos = useRef({ x: 9999, y: 9999 });
  const currentMousePos = useRef({ x: 9999, y: 9999 });
  const hoverStrength = useRef(0.0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // ── WebGL context ──────────────────────────────────────────────────────
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Premultiplied alpha blending for correct canvas compositing
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // ── Shader program ─────────────────────────────────────────────────────
    const program = createProgram(gl, VERT_SRC, FRAG_SRC);
    if (!program) return;
    gl.useProgram(program);

    // Attribute locations
    const aTargetPos      = gl.getAttribLocation(program, "aTargetPos");
    const aHand           = gl.getAttribLocation(program, "aHand");
    const aBaseAlpha      = gl.getAttribLocation(program, "aBaseAlpha");
    const aDepth          = gl.getAttribLocation(program, "aDepth");
    const aNormPos        = gl.getAttribLocation(program, "aNormPos");
    const aLogoTargetSize = gl.getAttribLocation(program, "aLogoTargetSize");

    // Uniform locations
    const uTime           = gl.getUniformLocation(program, "uTime");
    const uScrollProgress = gl.getUniformLocation(program, "uScrollProgress");
    const uViewport       = gl.getUniformLocation(program, "uViewport");
    const uMouse          = gl.getUniformLocation(program, "uMouse");
    const uHoverStrength  = gl.getUniformLocation(program, "uHoverStrength");
    const uSizeScale      = gl.getUniformLocation(program, "uSizeScale");
    const uDpr            = gl.getUniformLocation(program, "uDpr");
    const uDotColor       = gl.getUniformLocation(program, "uDotColor");

    // ── Mouse tracking ─────────────────────────────────────────────────────
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mousePos.current.x = e.clientX - rect.left;
        mousePos.current.y = e.clientY - rect.top;
      } else {
        mousePos.current.x = 9999;
        mousePos.current.y = 9999;
      }
    };
    const onLeave = () => {
      mousePos.current.x = 9999;
      mousePos.current.y = 9999;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // ── State ──────────────────────────────────────────────────────────────
    let isDestroyed = false;
    let particleCount = 0;
    let leftHandPoints = [];
    let rightHandPoints = [];
    let leftAspect = 1;
    let rightAspect = 1;

    // Interleaved vertex buffer: [targetX, targetY, hand, baseAlpha, depth, normX, normY, logoTargetSize]
    const FLOATS_PER_VERT = 8;
    const STRIDE = FLOATS_PER_VERT * 4; // bytes
    const vbo = gl.createBuffer();

    // ── Image sampling with Staggered Hexagonal + Organic Jitter Sampling ──
    const sampleHandImage = (imageSrc) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
          const aspect = img.naturalWidth / img.naturalHeight;
          const sampleW = 500;
          const sampleH = Math.round(sampleW / aspect);

          const sampleCanvas = document.createElement("canvas");
          const sampleCtx = sampleCanvas.getContext("2d");
          sampleCanvas.width = sampleW;
          sampleCanvas.height = sampleH;

          sampleCtx.clearRect(0, 0, sampleW, sampleH);
          sampleCtx.drawImage(img, 0, 0, sampleW, sampleH);

          const imgData = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;

          const step = 1;
          const rowStep = step; // Hexagonal packing ratio
          const colsCount = Math.ceil(sampleW / step) + 1;
          const rowsCount = Math.ceil(sampleH / rowStep) + 1;
          const blocks = [];

          for (let r = 0; r < rowsCount; r++) {
            blocks[r] = [];
            const isOddRow = r % 2 === 1;
            const rowOffsetX = isOddRow ? step * 0.5 : 0;

            for (let c = 0; c < colsCount; c++) {
              const baseX = c * step + rowOffsetX;
              const baseY = r * rowStep;

              // Organic jitter to break grid lines completely
              const jx = (pseudoHash(baseX, baseY) - 0.5) * step * 0.42;
              const jy = (pseudoHash(baseY, baseX) - 0.5) * rowStep * 0.42;

              const finalX = Math.min(sampleW - 1, Math.max(0, Math.round(baseX + jx)));
              const finalY = Math.min(sampleH - 1, Math.max(0, Math.round(baseY + jy)));

              const idx = (finalY * sampleW + finalX) * 4;
              const alpha = imgData[idx + 3];
              const red = imgData[idx];
              const green = imgData[idx + 1];
              const blue = imgData[idx + 2];
              const brightness = (red + green + blue) / 3;

              if (alpha > 30 && brightness > 20) {
                const normBrightness = brightness / 255;
                const depth = Math.pow(normBrightness, 1.25);
                const baseAlpha = Math.min(
                  1.0,
                  Math.max(0.15, Math.pow(normBrightness, 1.3) * 0.85 + 0.15)
                );
                blocks[r][c] = {
                  x: finalX,
                  y: finalY,
                  normX: finalX / sampleW,
                  normY: finalY / sampleH,
                  baseAlpha,
                  depth,
                };
              } else {
                blocks[r][c] = null;
              }
            }
          }

          const points = [];
          const boundaryPoints = [];

          for (let r = 0; r < rowsCount; r++) {
            for (let c = 0; c < colsCount; c++) {
              const pt = blocks[r][c];
              if (pt) {
                let isBoundary = false;
                for (let dr = -1; dr <= 1; dr++) {
                  for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr < 0 || nr >= rowsCount || nc < 0 || nc >= colsCount || !blocks[nr][nc]) {
                      isBoundary = true;
                    }
                  }
                }
                pt.isBoundary = isBoundary;
                points.push(pt);
                if (isBoundary) boundaryPoints.push(pt);
              }
            }
          }

          let maxDist = 0;
          points.forEach((p) => {
            if (p.isBoundary) {
              p.edgeDist = 0;
            } else {
              let minDist = Infinity;
              boundaryPoints.forEach((bp) => {
                const dx = p.x - bp.x;
                const dy = p.y - bp.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < minDist) minDist = d;
              });
              p.edgeDist = minDist;
              if (minDist > maxDist) maxDist = minDist;
            }
          });

          points.forEach((p) => {
            p.normalizedEdge = maxDist > 0
              ? (p.isBoundary ? 1.0 : 1.0 - p.edgeDist / maxDist)
              : 1.0;
          });

          resolve({ points, aspect });
        };
        img.onerror = () => resolve({ points: [], aspect: 1 });
      });
    };

    // ── Bind Attributes Helper ─────────────────────────────────────────────
    const bindAttributes = () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

      gl.enableVertexAttribArray(aTargetPos);
      gl.vertexAttribPointer(aTargetPos, 2, gl.FLOAT, false, STRIDE, 0);

      gl.enableVertexAttribArray(aHand);
      gl.vertexAttribPointer(aHand, 1, gl.FLOAT, false, STRIDE, 8);

      gl.enableVertexAttribArray(aBaseAlpha);
      gl.vertexAttribPointer(aBaseAlpha, 1, gl.FLOAT, false, STRIDE, 12);

      gl.enableVertexAttribArray(aDepth);
      gl.vertexAttribPointer(aDepth, 1, gl.FLOAT, false, STRIDE, 16);

      gl.enableVertexAttribArray(aNormPos);
      gl.vertexAttribPointer(aNormPos, 2, gl.FLOAT, false, STRIDE, 20);

      gl.enableVertexAttribArray(aLogoTargetSize);
      gl.vertexAttribPointer(aLogoTargetSize, 1, gl.FLOAT, false, STRIDE, 28);
    };

    // ── Build particles & upload GPU buffer ────────────────────────────────
    const buildParticles = () => {
      if (!container || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      let maxHandH;
      if (isMobile) {
        maxHandH = Math.max(width * 0.55, height * 0.32);
      } else if (isTablet) {
        maxHandH = Math.max(width * 0.50, height * 0.45);
      } else {
        maxHandH = Math.max(height * 0.80, width * 0.60);
      }

      const leftH = maxHandH;
      const leftW = leftH * leftAspect;
      const rightH = maxHandH;
      const rightW = rightH * rightAspect;

      const touchX = width * 0.5;
      const touchY = height * 0.5;

      let leftTipNormX = 0;
      leftHandPoints.forEach((pt) => {
        if (pt.normX > leftTipNormX) leftTipNormX = pt.normX;
      });

      let rightTipNormX = 1.0;
      rightHandPoints.forEach((pt) => {
        if (pt.normX < rightTipNormX) rightTipNormX = pt.normX;
      });

      const touchGap = -2;
      const leftCenterX  = (touchX - touchGap * 0.5) - (leftTipNormX - 0.5) * leftW;
      const leftCenterY  = touchY;
      const rightCenterX = (touchX + touchGap * 0.5) - (rightTipNormX - 0.5) * rightW;
      const rightCenterY = touchY;

      // Build interleaved Float32Array
      const totalParticles = leftHandPoints.length + rightHandPoints.length;
      if (totalParticles === 0) return;

      const data = new Float32Array(totalParticles * FLOATS_PER_VERT);
      let offset = 0;

      const writeParticle = (pt, centerX, centerY, handW, handH, handVal) => {
        const tx = centerX + (pt.normX - 0.5) * handW;
        const ty = centerY + (pt.normY - 0.5) * handH;
        const sizeCurve = Math.pow(pt.normalizedEdge, 2.5);
        const logoSize = 1.6 + (4.8 - 1.6) * sizeCurve;

        data[offset++] = tx;            // aTargetPos.x
        data[offset++] = ty;            // aTargetPos.y
        data[offset++] = handVal;       // aHand (0=left, 1=right)
        data[offset++] = pt.baseAlpha;  // aBaseAlpha
        data[offset++] = pt.depth;      // aDepth
        data[offset++] = pt.normX;      // aNormPos.x
        data[offset++] = pt.normY;      // aNormPos.y
        data[offset++] = logoSize;      // aLogoTargetSize
      };

      leftHandPoints.forEach((pt) => writeParticle(pt, leftCenterX, leftCenterY, leftW, leftH, 0.0));
      rightHandPoints.forEach((pt) => writeParticle(pt, rightCenterX, rightCenterY, rightW, rightH, 1.0));

      particleCount = totalParticles;

      // Upload data to GPU and bind attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      bindAttributes();
    };

    // ── Load images → build → animate ──────────────────────────────────────
    Promise.all([
      sampleHandImage(leftHandSrc),
      sampleHandImage(rightHandSrc),
    ]).then(([leftData, rightData]) => {
      if (isDestroyed) return;

      leftHandPoints  = leftData.points;
      leftAspect      = leftData.aspect;
      rightHandPoints = rightData.points;
      rightAspect     = rightData.aspect;

      buildParticles();
      startAnimation();
    });

    // ── Scroll ─────────────────────────────────────────────────────────────
    let time = 0;
    let scrollProgress = 0;

    const trigger = ScrollTrigger.create({
      trigger: ".contact_hero",
      start: "top top",
      end: "bottom bottom",
      endTrigger: containerRef.current,
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    if (trigger) {
      scrollProgress = trigger.progress || 0;
    }

    // ── Render loop ────────────────────────────────────────────────────────
    const dotRGB = parseRGB(colorDots);

    const startAnimation = () => {
      const render = () => {
        if (isDestroyed) return;
        time += 0.018;

        const width = container.clientWidth;
        const height = container.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const isMobileSize = width < 768;
        const screenScale = height / 1000.0;
        const sizeScale = (isMobileSize ? 0.75 : 0.65) * screenScale;

        // Smooth hover interpolation
        const isHovering = mousePos.current.x !== 9999;
        hoverStrength.current += ((isHovering ? 1.0 : 0.0) - hoverStrength.current) * 0.10;

        if (isHovering) {
          if (currentMousePos.current.x === 9999) {
            currentMousePos.current.x = mousePos.current.x;
            currentMousePos.current.y = mousePos.current.y;
          } else {
            currentMousePos.current.x += (mousePos.current.x - currentMousePos.current.x) * 0.15;
            currentMousePos.current.y += (mousePos.current.y - currentMousePos.current.y) * 0.15;
          }
        }

        gl.viewport(0, 0, canvas.width, canvas.height);

        // Clear transparent
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (particleCount > 0) {
          gl.useProgram(program);
          bindAttributes();

          // Update uniforms
          gl.uniform1f(uTime, time);
          gl.uniform1f(uScrollProgress, scrollProgress);
          gl.uniform2f(uViewport, width, height);
          gl.uniform2f(uMouse, currentMousePos.current.x, currentMousePos.current.y);
          gl.uniform1f(uHoverStrength, hoverStrength.current);
          gl.uniform1f(uSizeScale, sizeScale);
          gl.uniform1f(uDpr, dpr);
          gl.uniform3f(uDotColor, dotRGB[0], dotRGB[1], dotRGB[2]);

          // Draw points
          gl.drawArrays(gl.POINTS, 0, particleCount);
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(render);
    };

    // ── Resize ─────────────────────────────────────────────────────────────
    const handleResize = () => {
      buildParticles();
    };
    window.addEventListener("resize", handleResize);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      isDestroyed = true;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (trigger) trigger.kill();
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
    };
  }, [leftHandSrc, rightHandSrc, colorBg, colorDots]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#0B1A2C] overflow-hidden flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};

export default HandParticlesCanvas;

