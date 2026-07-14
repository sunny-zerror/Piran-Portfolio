"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { horseFrames } from './horseFrames';
const ROWS = horseFrames[0].length;
const COLS = horseFrames[0][0].length;
const DOT_SIZE = 1;
const DOT_SPACING = 1.2;

const Dots = () => {
    const bgMeshRef = useRef();
    const fgMeshRef = useRef();
    const dummyMeshRef = useRef();
    const smallMeshRef = useRef();
    const { viewport } = useThree();

    const bgDummy = useMemo(() => new THREE.Object3D(), []);
    const fgDummy = useMemo(() => new THREE.Object3D(), []);
    const dmDummy = useMemo(() => new THREE.Object3D(), []);
    const smDummy = useMemo(() => new THREE.Object3D(), []);

    const [isHovered, setIsHovered] = useState(false);
    const timeAcc = useRef(0);

    // Create a stable random array for initial phases to make the wave organic
    const randomPhases = useMemo(() => {
        const arr = new Float32Array(ROWS * COLS);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.random() * Math.PI * 2;
        }
        return arr;
    }, []);

    useEffect(() => {
        let i = 0;
        const totalWidth = COLS * DOT_SPACING;
        const totalHeight = ROWS * DOT_SPACING;
        const startX = -totalWidth / 2 + DOT_SPACING / 2;
        const startY = totalHeight / 2 - DOT_SPACING / 2; // Y goes down for the mask string

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const posX = startX + c * DOT_SPACING;
                const posY = startY - r * DOT_SPACING;
                const char = horseFrames[0][r][c];

                // Setup background static dots
                if (bgMeshRef.current) {
                    bgDummy.position.set(posX, posY, 0);
                    bgDummy.updateMatrix();
                    bgMeshRef.current.setMatrixAt(i, bgDummy.matrix);
                }

                // Setup foreground horse dots (initially scale 0)
                if (fgMeshRef.current) {
                    fgDummy.position.set(posX, posY, 0);
                    fgDummy.scale.setScalar(0);
                    fgDummy.updateMatrix();
                    fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);
                }

                // Setup dummy dots (static full size)
                if (dummyMeshRef.current) {
                    const isDummy = char === 'x';
                    dmDummy.position.set(posX, posY, 0);
                    dmDummy.scale.setScalar(isDummy ? 1 : 0);
                    dmDummy.updateMatrix();
                    dummyMeshRef.current.setMatrixAt(i, dmDummy.matrix);
                }

                // Setup small dummy dots
                if (smallMeshRef.current) {
                    const isSmall = char === 's';
                    smDummy.position.set(posX, posY, 0);
                    smDummy.scale.setScalar(isSmall ? 1 : 0);
                    smDummy.updateMatrix();
                    smallMeshRef.current.setMatrixAt(i, smDummy.matrix);
                }

                i++;
            }
        }
        if (bgMeshRef.current) bgMeshRef.current.instanceMatrix.needsUpdate = true;
        if (fgMeshRef.current) fgMeshRef.current.instanceMatrix.needsUpdate = true;
        if (dummyMeshRef.current) dummyMeshRef.current.instanceMatrix.needsUpdate = true;
        if (smallMeshRef.current) smallMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [bgDummy, fgDummy, dmDummy, smDummy]);

    useFrame((state, delta) => {
        if (!fgMeshRef.current) return;
        
        // Normal speed = 0.48 (1.2x of previous 0.4), Hover speed = 0.576 (1.2x of normal)
        const speedMultiplier = isHovered ? 2.5 : 1;
        timeAcc.current += delta * speedMultiplier;
        
        let i = 0;

        const totalWidth = COLS * DOT_SPACING;
        const totalHeight = ROWS * DOT_SPACING;
        const startX = -totalWidth / 2 + DOT_SPACING / 2;
        const startY = totalHeight / 2 - DOT_SPACING / 2;

        const frameIndex = Math.floor(timeAcc.current * 12) % horseFrames.length;

        // Jump logic removed as requested

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const isHorse = horseFrames[frameIndex][r][c] === 'O';

                if (isHorse) {
                    fgDummy.position.set(
                        startX + c * DOT_SPACING, 
                        startY - r * DOT_SPACING, 
                        0 // flat, no wave effect
                    );
                    fgDummy.scale.setScalar(1.0); // equal size to dummy dots
                    fgDummy.updateMatrix();
                    fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);
                } else {
                    // Animated layer hidden for non-horse dots
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

    // Scale to fit dynamically on all devices without cropping (leaving a 5% margin)
    const scale = Math.min(viewport.width / gridWidth, viewport.height / gridHeight) * 0.95;

    return (
        <group scale={scale}>
            <mesh position={[0, 0, 2]} onPointerOver={() => setIsHovered(true)} onPointerOut={() => setIsHovered(false)}>
                <planeGeometry args={[gridWidth, gridHeight]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <instancedMesh ref={bgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.5, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
            </instancedMesh>

            <instancedMesh ref={smallMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.15, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} depthTest={false} />
            </instancedMesh>

            <instancedMesh ref={dummyMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.45, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} depthTest={false} />
            </instancedMesh>

            <instancedMesh ref={fgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.45, 32]} />
                <meshBasicMaterial color="#ffffff" depthTest={false} />
            </instancedMesh>
        </group>
    );
};

export default function ExecutionCanvas() {
    return (
        <div className="w-full h-full relative cursor-default">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <Dots />
            </Canvas>
        </div>
    );
}
