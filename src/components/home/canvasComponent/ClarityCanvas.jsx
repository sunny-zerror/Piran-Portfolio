"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROWS = 20;
const COLS = 42;
const DOT_SIZE = 1;
const DOT_SPACING = 1.2;

const Dots = () => {
    const borderMeshRef = useRef();
    const bgMeshRef = useRef();
    const fgMeshRef = useRef();
    const groupRef = useRef();
    const { viewport } = useThree();

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colorObj = useMemo(() => new THREE.Color(), []);
    const bgColor = useMemo(() => new THREE.Color("#883F27"), []);
    const fgColor = useMemo(() => new THREE.Color("#ffffff"), []);

    const dotData = useMemo(() => {
        const data = [];
        const totalWidth = COLS * DOT_SPACING;
        const totalHeight = ROWS * DOT_SPACING;
        const startX = -totalWidth / 2 + DOT_SPACING / 2;
        const startY = totalHeight / 2 - DOT_SPACING / 2;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                data.push({
                    x: startX + c * DOT_SPACING,
                    y: startY - r * DOT_SPACING,
                });
            }
        }
        return data;
    }, []);

    const snakeBody = useRef([
        { r: Math.floor(ROWS / 2), c: 6 },
        { r: Math.floor(ROWS / 2), c: 5 },
        { r: Math.floor(ROWS / 2), c: 4 },
        { r: Math.floor(ROWS / 2), c: 3 },
        { r: Math.floor(ROWS / 2), c: 2 },
        { r: Math.floor(ROWS / 2), c: 1 },
        { r: Math.floor(ROWS / 2), c: 0 },
    ]);
    const checkpoints = useRef([]);
    const lastMoveTime = useRef(0);
    const initializedCheckpoints = useRef(false);

    const mouseActive = useRef(false);
    const mouseGridCoords = useRef({ r: -1, c: -1 });

    const handlePointerMove = (e) => {
        mouseActive.current = true;
        if (groupRef.current) {
            const localPoint = groupRef.current.worldToLocal(e.point.clone());
            const totalWidth = COLS * DOT_SPACING;
            const totalHeight = ROWS * DOT_SPACING;
            const startX = -totalWidth / 2 + DOT_SPACING / 2;
            const startY = totalHeight / 2 - DOT_SPACING / 2;

            const c = Math.round((localPoint.x - startX) / DOT_SPACING);
            const r = Math.round((startY - localPoint.y) / DOT_SPACING);

            const nr = Math.max(0, Math.min(ROWS - 1, r));
            const nc = Math.max(0, Math.min(COLS - 1, c));

            mouseGridCoords.current = { r: nr, c: nc };
        }
    };

    const handlePointerOut = () => {
        mouseActive.current = false;
    };

    const generateCheckpoint = (currentCheckpoints, headPosition) => {
        let valid = false;
        let r, c;
        let attempts = 0;
        while (!valid && attempts < 200) {
            attempts++;
            r = Math.floor(Math.random() * ROWS);
            c = Math.floor(Math.random() * COLS);
            valid = true;
            
            // Check not on snake body
            if (snakeBody.current.some(part => part.r === r && part.c === c)) {
                valid = false;
                continue;
            }
            // Check not on other checkpoints, and distance from them
            if (currentCheckpoints.some(cp => {
                const dist = Math.abs(cp.r - r) + Math.abs(cp.c - c);
                return dist < 8; // Not too close to each other
            })) {
                valid = false;
                continue;
            }
            // Check not too close to head (distance > 5)
            if (headPosition) {
                const dist = Math.abs(headPosition.r - r) + Math.abs(headPosition.c - c);
                if (dist < 5) {
                    valid = false;
                    continue;
                }
            }
        }
        return { r, c };
    };

    useEffect(() => {
        let i = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const data = dotData[i];

                // Border at z = 0
                dummy.position.set(data.x, data.y, 0);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                if (borderMeshRef.current) borderMeshRef.current.setMatrixAt(i, dummy.matrix);

                // Brown dot at z = 0.01
                dummy.position.set(data.x, data.y, 0.01);
                dummy.updateMatrix();
                if (bgMeshRef.current) bgMeshRef.current.setMatrixAt(i, dummy.matrix);

                // White dot at z = 0.02
                dummy.position.set(data.x, data.y, 0.02);
                dummy.scale.setScalar(0);
                dummy.updateMatrix();
                if (fgMeshRef.current) fgMeshRef.current.setMatrixAt(i, dummy.matrix);

                i++;
            }
        }
        if (borderMeshRef.current) borderMeshRef.current.instanceMatrix.needsUpdate = true;
        if (bgMeshRef.current) bgMeshRef.current.instanceMatrix.needsUpdate = true;
        if (fgMeshRef.current) fgMeshRef.current.instanceMatrix.needsUpdate = true;

        if (!initializedCheckpoints.current) {
            const initialCheckpoints = [];
            for (let j = 0; j < 10; j++) {
                initialCheckpoints.push(generateCheckpoint(initialCheckpoints, snakeBody.current[0]));
            }
            checkpoints.current = initialCheckpoints;
            initializedCheckpoints.current = true;
        }
    }, [dummy, dotData]);

    useFrame((state) => {
        if (!fgMeshRef.current || checkpoints.current.length === 0) return;

        const time = state.clock.getElapsedTime();

        const moveInterval = 0.08; // Snake speed

        if (time - lastMoveTime.current > moveInterval) {
            lastMoveTime.current = time;

            const head = snakeBody.current[0];
            let target = null;
            let eatTarget = false;

            if (mouseActive.current) {
                target = mouseGridCoords.current;
                eatTarget = false;
            } else {
                let nearest = null;
                let minDist = Infinity;
                
                checkpoints.current.forEach(cp => {
                    const dist = Math.abs(cp.r - head.r) + Math.abs(cp.c - head.c);
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = cp;
                    }
                });
                target = nearest;
                eatTarget = true;
            }

            if (target) {
                const dr = target.r - head.r;
                const dc = target.c - head.c;

                let nextR = head.r;
                let nextC = head.c;

                if (Math.abs(dr) > Math.abs(dc)) {
                    nextR += Math.sign(dr);
                } else if (dc !== 0) {
                    nextC += Math.sign(dc);
                } else if (dr !== 0) {
                    nextR += Math.sign(dr);
                }

                if (dr !== 0 || dc !== 0) {
                    const newHead = { r: nextR, c: nextC };
                    
                    snakeBody.current.unshift(newHead);

                    if (eatTarget && newHead.r === target.r && newHead.c === target.c) {
                        checkpoints.current = checkpoints.current.filter(cp => cp !== target);
                        checkpoints.current.push(generateCheckpoint(checkpoints.current, newHead));
                        snakeBody.current.pop();
                    } else {
                        snakeBody.current.pop();
                    }
                }
            }
        }

        // Render logic for snake and checkpoints
        let needsColorUpdate = false;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const idx = r * COLS + c;
                let scale = 0;
                let isCheckpoint = false;
                let alpha = 1;
                
                if (snakeBody.current.some(part => part.r === r && part.c === c)) {
                    scale = 1;
                } else if (!mouseActive.current && checkpoints.current.some(cp => cp.r === r && cp.c === c)) {
                    scale = 1;
                    isCheckpoint = true;
                    // Opacity blink
                    alpha = 0.2 + 0.8 * Math.abs(Math.sin(time * 5 + (r * 0.5) + (c * 0.5))); 
                }

                const data = dotData[idx];
                dummy.position.set(data.x, data.y, 0.02);
                dummy.scale.setScalar(scale);
                dummy.updateMatrix();
                fgMeshRef.current.setMatrixAt(idx, dummy.matrix);

                if (scale > 0) {
                    if (isCheckpoint) {
                        colorObj.lerpColors(bgColor, fgColor, alpha);
                    } else {
                        colorObj.copy(fgColor);
                    }
                    fgMeshRef.current.setColorAt(idx, colorObj);
                    needsColorUpdate = true;
                }
            }
        }
        fgMeshRef.current.instanceMatrix.needsUpdate = true;
        if (needsColorUpdate) {
            fgMeshRef.current.instanceColor.needsUpdate = true;
        }
    });

    const gridWidth = COLS * DOT_SPACING;
    const gridHeight = ROWS * DOT_SPACING;

    const scale = Math.min(viewport.width / gridWidth, viewport.height / gridHeight) * 0.95;

    return (
        <group scale={scale} ref={groupRef}>
            <mesh
                position={[0, 0, 0.05]}
                onPointerMove={handlePointerMove}
                onPointerOut={handlePointerOut}
            >
                <planeGeometry args={[gridWidth, gridHeight]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <instancedMesh ref={borderMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[(DOT_SIZE / 2) + 0.08, 32]} />
                <meshBasicMaterial color="#d1d5db" />
            </instancedMesh>
            <instancedMesh ref={bgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE / 2, 32]} />
                <meshBasicMaterial color="#883F27" />
            </instancedMesh>
            <instancedMesh ref={fgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE / 2, 32]} />
                <meshBasicMaterial color="#ffffff" />
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