"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 33x18 pixel matrix forming a human brain with grooves
const brainMask = [
  ".................................",
  ".................................",
  ".................................",
  ".............OOOOO...............",
  "..........OOOOOOOOOOO............",
  ".........OOOOOOOOOOOOO...........",
  "........OOOO.OOO.OOOOOO..........",
  ".......OOOOO.OOO.OOOOOOO.........",
  ".......OOOO.OOOOO.OOOOOO.........",
  ".......OOOOO.OO.OOOOOOOO.........",
  "........OOOO.OOOO.OOOOO..........",
  "........OOOOO.OOO.OOOOO..........",
  ".........OOOO.OOO.OOOO...........",
  "...........OOOOOOOOOO............",
  ".............OOOOOO..............",
  "...............OO................",
  ".................................",
  ".................................",
];

const ROWS = 18;
const COLS = 33;
const DOT_SIZE = 1;
const DOT_SPACING = 1.4;

const Dots = () => {
    const bgMeshRef = useRef();
    const fgMeshRef = useRef();
    const { viewport } = useThree();

    const bgDummy = useMemo(() => new THREE.Object3D(), []);
    const fgDummy = useMemo(() => new THREE.Object3D(), []);

    // Create random phases for neuron firing effect
    const randomPhases = useMemo(() => {
        const arr = new Float32Array(ROWS * COLS);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.random() * Math.PI * 2;
        }
        return arr;
    }, []);
    
    // Create random speeds for each dot
    const randomSpeeds = useMemo(() => {
        const arr = new Float32Array(ROWS * COLS);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = 2 + Math.random() * 3; // Speeds between 2 and 5
        }
        return arr;
    }, []);

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

                // Setup solid brown background dots for entire grid
                if (bgMeshRef.current) {
                    bgDummy.position.set(posX, posY, 0);
                    bgDummy.updateMatrix();
                    bgMeshRef.current.setMatrixAt(i, bgDummy.matrix);
                }
                
                // Setup white brain dots (initially scale 0)
                if (fgMeshRef.current) {
                    fgDummy.position.set(posX, posY, 0);
                    fgDummy.scale.setScalar(0);
                    fgDummy.updateMatrix();
                    fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);
                }
                i++;
            }
        }
        if (bgMeshRef.current) bgMeshRef.current.instanceMatrix.needsUpdate = true;
        if (fgMeshRef.current) fgMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [bgDummy, fgDummy]);

    useFrame((state) => {
        if (!fgMeshRef.current) return;
        const time = state.clock.getElapsedTime();
        let i = 0;

        const totalWidth = COLS * DOT_SPACING;
        const totalHeight = ROWS * DOT_SPACING;
        const startX = -totalWidth / 2 + DOT_SPACING / 2;
        const startY = totalHeight / 2 - DOT_SPACING / 2;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const isBrain = brainMask[r][c] === 'O';
                
                if (isBrain) {
                    // Create an organic neuron firing animation (scaling 0 to 1 randomly)
                    const speed = randomSpeeds[i];
                    const phase = randomPhases[i];
                    
                    // Math.sin goes from -1 to 1. We map it to 0 to 1
                    let scale = (Math.sin(time * speed + phase) + 1) / 2;
                    
                    // Sharpen the pulsing effect by raising to a power so they spend more time small
                    scale = Math.pow(scale, 2);

                    fgDummy.position.set(startX + c * DOT_SPACING, startY - r * DOT_SPACING, 0);
                    fgDummy.scale.setScalar(scale);
                    fgDummy.updateMatrix();
                    fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);
                } else {
                    fgDummy.scale.setScalar(0);
                    fgDummy.updateMatrix();
                    fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);
                }
                i++;
            }
        }
        fgMeshRef.current.instanceMatrix.needsUpdate = true;
    });

    const gridWidth = COLS * DOT_SPACING;
    const gridHeight = ROWS * DOT_SPACING;
    
    // Scale to fit perfectly in the container
    const scale = Math.min(viewport.width / gridWidth, viewport.height / gridHeight) * 0.95;

    return (
        <group scale={scale}>
            {/* Base grid of brown dots */}
            <instancedMesh ref={bgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE / 2, 32]} />
                <meshBasicMaterial color="#883F27" />
            </instancedMesh>
            
            {/* Animating white brain dots on top */}
            <instancedMesh ref={fgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE / 2, 32]} />
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
