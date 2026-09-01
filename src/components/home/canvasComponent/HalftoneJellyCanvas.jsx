"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fragmentShader = `
uniform float uTime;
uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uResolution;

varying vec2 vUv;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Simplex 3D Noise for smooth jelly movement
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}


void main() {
    vec2 st = vUv;
    st.x *= uResolution.x / uResolution.y;

    float gridScale = 50.0;
    
    vec2 cellUv = fract(st * gridScale);
    vec2 cellId = floor(st * gridScale);
    
    // Sample position at center of cell
    vec2 samplePos = (cellId + vec2(0.5)) / gridScale;
    
    // Layered 3D noise for organic jelly movement
    float n1 = snoise(vec3(samplePos * 2.0, uTime * 0.6));
    float n2 = snoise(vec3(samplePos * 4.0, uTime * 0.6));
    
    // Normalize noise to 0..1 roughly
    float combinedNoise = (n1 * 0.7 + n2 * 0.3) * 0.5 + 0.5;
    
    // Smooth threshold to create distinct blobs
    float blob = smoothstep(0.4, 0.7, combinedNoise);
    
    // Mix colors based on scroll progress
    // When uProgress is 0: dots are small, bg is uColor1.
    // When uProgress is 1: dots expand (radius > 0.5) and cover everything, effectively making bg uColor2.
    
    // Calculate radius for this cell (grows from max 0.48 to >1.0 based on progress)
    // We add uProgress * 1.5 so dots grow and merge completely
    float radius = (blob * 0.48) + (uProgress * 1.5); 
    
    // Distance from cell center
    float dist = length(cellUv - vec2(0.5));
    
    // Anti-aliased dot
    float alpha = smoothstep(radius + 0.03, radius - 0.03, dist);
    
    // Base bg is color1, dots are color2
    vec3 finalColor = mix(uColor1, uColor2, alpha);
    
    // The alpha here is for the material transparency if needed, 
    // but the user wants the mesh bg to be color1 initially, so we output solid 1.0 alpha.
    gl_FragColor = vec4(finalColor, 1.0);
    #include <colorspace_fragment>
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const HalftoneMesh = ({ color1, color2, progressRef }) => {
  const meshRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
    uResolution: { value: new THREE.Vector2(typeof window !== 'undefined' ? window.innerWidth : 1000, typeof window !== 'undefined' ? window.innerHeight : 1000) }
  }), [color1, color2]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      if (progressRef && progressRef.current !== undefined) {
        meshRef.current.material.uniforms.uProgress.value = progressRef.current;
      }
      
      const width = state.gl.domElement.clientWidth;
      const height = state.gl.domElement.clientHeight;
      meshRef.current.material.uniforms.uResolution.value.set(width, height);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

const HalftoneJellyCanvas = ({ color1 = "#3b82f6", color2 = "#f5f5dc" }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      onEnter: () => {
        gsap.to(progressRef, { current: 1, duration: 1, ease: "power3.inOut" });
      },
      onLeaveBack: () => {
        gsap.to(progressRef, { current: 0, duration: 1, ease: "power3.inOut" });
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 }}
        orthographic
        gl={{ alpha: true, antialias: false }}
      >
        <HalftoneMesh color1={color1} color2={color2} progressRef={progressRef} />
      </Canvas>
    </div>
  );
};

export default HalftoneJellyCanvas;
