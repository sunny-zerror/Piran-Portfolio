"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 33x16 pixel matrix forming a human brain with grooves
const brainMask = [
  ".................................", // 0
  ".................................", // 1
  "............OOOO.OOOO............", // 2
  "..........OOOOOO.OOOOOO..........", // 3
  "..........OO.OOO.OOO.OO..........", // 4
  ".........OOOOOOO.OOOOOOO.........", // 5
  ".........OO.OOOO.OOOO.OO.........", // 6
  "........O.OO.OOO.OOO.OO.O........", // 7
  "........O.OOOO.O.O.OOOO.O........", // 8
  "........O.OOOO.O.O.OOOO.O........", // 9
  ".........OO.OOOO.OOOO.OO.........", // 10
  ".........OOOOOOO.OOOOOOO.........", // 11
  "..........OOOOOO.OOOOOO..........", // 12
  "............OOOO.OOOO............", // 13
  ".................................", // 14
  ".................................", // 15
];

const ROWS = 16;
const COLS = 33;
const DOT_SIZE = 1;
const DOT_SPACING = 1.2;

const Dots = () => {
    const borderMeshRef = useRef();
    const bgMeshRef = useRef();
    const fgMeshRef = useRef();
    const { viewport } = useThree();

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const [isHovered, setIsHovered] = useState(false);
    
    // Store stable random states so they don't change on every render
    const dotData = useMemo(() => {
        const data = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const isBrain = brainMask[r][c] === 'O';
                // Some dots on left will pulse, right is mostly solid
                let isPulsing = false;
                let baseScale = 0;
                
                if (isBrain) {
                    // Both hemispheres will have randomly solid and missing dots
                    baseScale = Math.random() > 0.4 ? 1 : 0;
                    // For the missing dots, 70% of them will pulse rapidly
                    if (baseScale === 0) {
                        isPulsing = Math.random() > 0.3;
                    }
                }
                
                const distToCenter = Math.sqrt(Math.pow(c - 16, 2) + Math.pow(r - 7.5, 2));
                data.push({
                    isBrain,
                    baseScale,
                    isPulsing,
                    phase: Math.random() * Math.PI * 2,
                    distToCenter,
                    r, c, // Added grid coordinates for corner distance calculations
                    // Precompute positions
                    x: (-COLS * DOT_SPACING) / 2 + DOT_SPACING / 2 + c * DOT_SPACING,
                    y: (ROWS * DOT_SPACING) / 2 - DOT_SPACING / 2 - r * DOT_SPACING
                });
            }
        }
        return data;
    }, []);

    // Set up the static backgrounds once
    useEffect(() => {
        let i = 0;
        const totalWidth = COLS * DOT_SPACING;
        const totalHeight = ROWS * DOT_SPACING;
        const startX = -totalWidth / 2 + DOT_SPACING / 2;
        const startY = totalHeight / 2 - DOT_SPACING / 2;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const posX = startX + c * DOT_SPACING;
                const posY = startY - r * DOT_SPACING;

                // We only need to setup border and bg meshes once
                if (borderMeshRef.current) {
                    dummy.position.set(posX, posY, 0); 
                    dummy.scale.setScalar(1);
                    dummy.updateMatrix();
                    borderMeshRef.current.setMatrixAt(i, dummy.matrix);
                }

                if (bgMeshRef.current) {
                    dummy.position.set(posX, posY, 0);
                    dummy.scale.setScalar(1);
                    dummy.updateMatrix();
                    bgMeshRef.current.setMatrixAt(i, dummy.matrix);
                }
                i++;
            }
        }
        if (borderMeshRef.current) borderMeshRef.current.instanceMatrix.needsUpdate = true;
        if (bgMeshRef.current) bgMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [dummy, dotData]);

    const waveTime = useRef(0);
    
    useFrame((state, delta) => {
        if (!fgMeshRef.current) return;
        
        let isWaveActive = false;
        
        // Handle wave timing: run continuously while hovered, or finish current cycle if unhovered
        if (isHovered) {
            waveTime.current += delta;
            isWaveActive = true;
        } else if (waveTime.current > 0) {
            const currentCycle = Math.floor(waveTime.current / 4.0);
            waveTime.current += delta;
            isWaveActive = true;
            
            // If the wave crossed the 4-second boundary, stop it cleanly
            if (Math.floor(waveTime.current / 4.0) > currentCycle) {
                waveTime.current = 0;
                isWaveActive = false;
            }
        }

        const time = state.clock.getElapsedTime();
        
        for (let i = 0; i < dotData.length; i++) {
            const data = dotData[i];
            
            let currentScale = data.baseScale;
            
            // Pulsing logic for missing/random dots (only if they are part of the brain)
            if (data.isBrain && data.isPulsing) {
                // Sine wave from 0 to 1, fast speed
                const pulse = (Math.sin(time * 4.5 + data.phase) + 1) / 2;
                currentScale = pulse;
            }
            
            // Hover wave logic (flows from the 4 corners to center, repeats every 2s)
            if (isWaveActive) {
                // Calculate distance to the nearest of the 4 corners
                const distC1 = Math.sqrt(Math.pow(data.c - 0, 2) + Math.pow(data.r - 0, 2));
                const distC2 = Math.sqrt(Math.pow(data.c - (COLS - 1), 2) + Math.pow(data.r - 0, 2));
                const distC3 = Math.sqrt(Math.pow(data.c - 0, 2) + Math.pow(data.r - (ROWS - 1), 2));
                const distC4 = Math.sqrt(Math.pow(data.c - (COLS - 1), 2) + Math.pow(data.r - (ROWS - 1), 2));
                
                const minDistToCorner = Math.min(distC1, distC2, distC3, distC4);
                
                // Repeats every 4 seconds
                const waveCycleTime = waveTime.current % 4.0; 
                
                // Speed: travels across in ~1.5s, then rests for ~2.5s
                const wavePos = waveCycleTime * 12.0; 
                
                const distFromWave = Math.abs(minDistToCorner - wavePos);
                
                // Creates a ripple effect
                if (distFromWave < 4) {
                    const waveBoost = Math.max(0, 1 - distFromWave / 4);
                    // Boost scale to 1.2 during wave
                    currentScale = Math.max(currentScale, waveBoost * 1.2);
                }
            }
            
            // If it's not a brain dot and no wave is touching it, it stays 0
            if (!data.isBrain && !isWaveActive) {
                currentScale = 0;
            }
            
            // Clamp scale to not look too crazy
            currentScale = Math.min(Math.max(currentScale, 0), 1.2);
            
            dummy.position.set(data.x, data.y, 0);
            dummy.scale.setScalar(currentScale);
            dummy.updateMatrix();
            fgMeshRef.current.setMatrixAt(i, dummy.matrix);
        }
        
        fgMeshRef.current.instanceMatrix.needsUpdate = true;
    });

    const gridWidth = COLS * DOT_SPACING;
    const gridHeight = ROWS * DOT_SPACING;
    
    // Scale to fit dynamically without cropping
    const scale = Math.min(viewport.width / gridWidth, viewport.height / gridHeight) * 0.95;

    return (
        <group 
            scale={scale}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
        >
            <instancedMesh ref={borderMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[(DOT_SIZE * 0.5) + 0.08, 32]} />
                <meshBasicMaterial color="#d1d5db" />
            </instancedMesh>

            <instancedMesh ref={bgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.5, 32]} />
                <meshBasicMaterial color="#883F27" depthTest={false} />
            </instancedMesh>
            
            <instancedMesh ref={fgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.5, 32]} />
                <meshBasicMaterial color="#ffffff" depthTest={false} />
            </instancedMesh>
        </group>
    );
};

export default function ClarityCanvas() {
    return (
        <div className="w-full h-full relative cursor-default">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <Dots />
            </Canvas>
        </div>
    );
}