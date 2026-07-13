"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 42x21 pixel matrix forming exactly the image pattern
const horseMask = [
    "..........................................",
    ".........................s................",
    "........................s.O...............",
    "......................O.O.................",
    "......................O.x.................",
    ".......................x.x..x.x.x.s.O.....",
    "........................x.x.x.x.x.x.x.x...",
    ".......................s.x.x.x.O.s.O.O.O..",
    "....O.O.O.O.s.s.s.O.O.O.O.O.s.x.x.s.O.s.s.",
    "....O.O.s.O..x.O.s.O.O.x.s.O.O.x.x.x.s.s..",
    "........s.x.O.O.O.O.O.s.O.O.s.O.x.x.......",
    ".........x.x.O.O.O.O.O.O.O.x.O.O.s........",
    ".........x.O.x.O.O.O.O.O.x.O.x.O.s........",
    "..........O.x.O.s.O.O.O.s.x.x.O.s.........",
    "..........x.x.O.x...O.x.s...x.s...........",
    "...........O.O.s....O.s......x.s..........",
    ".........s..s.......O.........s...........",
    "...O.O..................O.................",
    "..................................O.......",
    "...................................s......",
    "..........................................",
];

const ROWS = horseMask.length;
const COLS = horseMask[0].length;
const DOT_SIZE = 1;
const DOT_SPACING = 1.3;

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
                const char = horseMask[r][c];

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
                const isHorse = horseMask[r][c] === 'O';

                if (isHorse) {
                    // Create a dynamic, flowing wave animation passing horizontally
                    const wave = Math.sin(c * 0.4 + r * 0.2 - time * 5 + randomPhases[i] * 0.8);

                    // Scale oscillates organically between 0.3 and 1.2
                    const scale = 0.75 + wave * 0.45;
                    fgDummy.position.set(startX + c * DOT_SPACING, startY - r * DOT_SPACING, 0);
                    fgDummy.scale.setScalar(scale);
                    fgDummy.updateMatrix();
                    fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);
                } else {
                    // Make sure animated layer is hidden for non-horse dots
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
            <instancedMesh ref={bgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.5, 32]} />
                <meshBasicMaterial color="#1E2A3A" />
            </instancedMesh>

            <instancedMesh ref={smallMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.15, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} depthTest={false} />
            </instancedMesh>

            <instancedMesh ref={dummyMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE * 0.45, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.4} depthTest={false} />
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
