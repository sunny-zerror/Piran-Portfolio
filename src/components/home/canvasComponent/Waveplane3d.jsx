"use client";

import {
  shaderMaterial,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
} from "@react-three/fiber";
import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import { ShaderMaterial, Vector3 } from "three";

// ─── Inline shaders ─────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
uniform vec2  uMouseOffset;
varying vec2  vUv;
varying float vTerrainHeight;

// Simplex 3D Noise
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i =floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g =step(x0.yzx,x0.xyz);
  vec3 l =1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
   +i.y+vec4(0.,i1.y,i2.y,1.))
   +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vec3 newPosition = position;
  
  // Create an organic ocean surface using simplex noise
  // The noise moves over time and is influenced by mouse offsets
  vec3 noiseInput = vec3(
    position.x * 0.15 + uMouseOffset.x, 
    position.y * 0.15 + uMouseOffset.y + uTime * 0.05, 
    uTime * 0.05
  );
  
  float n = snoise(noiseInput) * 1.5;
  
  // Distance from center on X axis to keep the moon visible
  float xDist = abs(position.x);
  float bowl = smoothstep(0.0, 7.0, xDist) * 2.0;
  
  newPosition.z += bowl + n;
  
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  vTerrainHeight = newPosition.z;
  vUv = uv;
  gl_Position = projectedPosition;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
uniform vec2  uMouseOffset;
uniform bool  uShowGrid;
uniform float uGridSize;
varying vec2  vUv;
varying float vTerrainHeight;

void main(){
  // Line thickness
  float thick = 0.03;
  
  // Flow lines based on mouse offset and time to match ocean direction
  float linePosY = fract(vUv.y * uGridSize - uMouseOffset.y * 2.0 - uTime * 0.05);
  
  // Smooth anti-aliased horizontal lines
  float alphaY = smoothstep(thick, thick - 0.015, linePosY) + smoothstep(1.0 - thick, 1.0 - thick + 0.015, linePosY);
  
  // Warm gold / beige color from the image
  vec3 lineCol = vec3(0.82, 0.73, 0.58);
  
  // The background is completely transparent so the underlying dark blue shows through
  vec4 finalColour = vec4(lineCol, alphaY);
  
  // Soft radial fade-out (fog) at the edges of the plane
  float dist = distance(vUv, vec2(0.5, 0.5));
  float fog = smoothstep(0.5, 0.15, dist);
  
  finalColour.a *= fog;
  
  // Only show if grid is enabled, else transparent
  if (!uShowGrid) {
    finalColour.a = 0.0;
  }

  gl_FragColor = finalColour;
}
`;

// ─── Colour palette – 4 hex stops (navy → periwinkle → lavender → violet) ─────

const DEFAULT_COLOURS = ["#1b2550", "#5566c4", "#b9a7e6", "#8a63e8"];

function hexToVec3(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  // Accept 8-digit RGBA hex by ignoring the alpha channel.
  if (!/^[0-9a-fA-F]{6,8}$/.test(h)) return new Vector3(0, 0, 0);
  return new Vector3(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  );
}

const DEFAULT_PALETTE = DEFAULT_COLOURS.map(hexToVec3);

// ─── Shader material ─────────────────────────────────────────────────────────

const WavePlaneMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollProgress: 0,
    uMouseOffset: new THREE.Vector2(0, 0),
    uColourPalette: DEFAULT_PALETTE,
    uShowGrid: false,
    uGridSize: 24,
  },
  vertexShader,
  fragmentShader
);

extend({ WavePlaneMaterial });

// ─── WavePlane mesh ──────────────────────────────────────────────────────────

const WavePlane = ({
  showGrid,
  palette,
}) => {
  const viewport = useThree((s) => s.viewport);
  const matRef   = useRef(null);
  const scroll   = useRef(0);
  
  // Keep track of the continuous ocean movement direction
  const offsetRef = useRef(new THREE.Vector2(0, 0));

  // Keep scroll progress updated
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const size     = useMemo(() => Math.max(Math.round(viewport.width + 2), Math.round(viewport.height * 2)), [viewport]);
  const segments = useMemo(() => size * 8, [size]);

  useFrame(({ clock, pointer }) => {
    if (!matRef.current) return;
    matRef.current.uTime = clock.elapsedTime;
    matRef.current.uScrollProgress = scroll.current * 12;
    matRef.current.uColourPalette = palette;
    matRef.current.uShowGrid = showGrid;
    
    // Continuously add the pointer position to change the ocean's flow direction
    // Reduced speed for a calmer continuous movement
    offsetRef.current.x += pointer.x * 0.005;
    offsetRef.current.y += pointer.y * 0.005;
    
    matRef.current.uMouseOffset = offsetRef.current;
  });

  return (
    <mesh
      position={[0, -viewport.height / 2.5, -1]}
      rotation={[-0.5 * Math.PI, 0, 0]}
    >
      <planeGeometry args={[size, size, segments, segments]} />
      <wavePlaneMaterial
        ref={matRef}
        key={WavePlaneMaterial.key}
        uTime={0}
        uScrollProgress={0}
        uMouseOffset={new THREE.Vector2(0,0)}
        uColourPalette={palette}
        uShowGrid={showGrid}
        uGridSize={60}
        transparent
      />
    </mesh>
  );
};

// ─── Moon Globe Component ──────────────────────────────────────────────────

const MoonGlobe = () => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color('#ffffff') }, // Pure white
          uColor2: { value: new THREE.Color('#e0e0e0') }, // Light off-white
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
          
          float noise3D(vec3 p) {
              return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          }
          
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
            vec3 lightDir = normalize(vec3(0.5, 1.5, 2.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            
            // Subtle noise for moon texture
            float n1 = fbm(vPosition * 2.0); 
            float surface = smoothstep(0.3, 0.8, n1);
            vec3 baseColor = mix(uColor1, uColor2, surface);
            
            // Bright white diffuse lighting
            vec3 finalColor = baseColor * (diff * 0.8 + 0.5);
            
            // Inner glow / rim fade to make it soft
            float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
            
            // Smoothly fade the outer edges of the moon (make it a light fade moon)
            float alpha = 1.0 - smoothstep(0.6, 1.0, rim);
            
            // Add a bright glowing rim
            finalColor += vec3(1.0, 1.0, 1.0) * smoothstep(0.5, 0.9, rim) * 0.5;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
      }),
    []
  );

  const sphereRef = useRef();

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.02;
      // Fixed position, no mousemove parallax
    }
  });

  return (
    <mesh ref={sphereRef} position={[0, 0.5, -2]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// ─── Static camera – locked at the "mouse to top-center" incline ─────────────

const StaticCamera = () => {
  useFrame(({ camera, scene }) => {
    camera.lookAt(scene.position);
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0.5, 5]}
      fov={60}
      far={20}
      near={0.001}
    />
  );
};

// ─── Public canvas export ────────────────────────────────────────────────────

export const WavePlaneCanvas = ({
  className,
  colors = DEFAULT_COLOURS,
  showGrid = true,
}) => {
  const palette = useMemo(() => colors.map(hexToVec3), [colors]);
  const canvasKey = colors.join("-");

  return (
    <Canvas
      key={canvasKey}
      className={className}
      camera={{ position: [0, 0, 5], fov: 60, far: 20, near: 0.001 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <MoonGlobe />
      <WavePlane showGrid={showGrid} palette={palette} />
      <StaticCamera />
    </Canvas>
  );
};

// ─── Full-page demo (optional) ───────────────────────────────────────────────

export const WavePlanePage = () => (
  <main className="h-[1000vh] w-full">
    <WavePlaneCanvas className="!fixed inset-0" />
  </main>
);