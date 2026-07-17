"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROWS = 20;
const COLS = 42;
const DOT_SIZE = 1;
const DOT_SPACING = 1.2;
const SCALE_IN_DURATION = 0.001;
const WAIT_DURATION = 1.0;
const SCALE_OUT_DURATION = 0.001;
const TOTAL_DURATION = SCALE_IN_DURATION + WAIT_DURATION + SCALE_OUT_DURATION;

const Dots = () => {
    const borderMeshRef = useRef();
    const bgMeshRef = useRef();
    const fgMeshRef = useRef();
    const groupRef = useRef();
    const { viewport } = useThree();

    const dummy = useMemo(() => new THREE.Object3D(), []);

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

    useEffect(() => {
        let i = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const data = dotData[i];

                // Border at z = 0
                dummy.position.set(data.x, data.y, 0);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                if (borderMeshRef.current) {
                    borderMeshRef.current.setMatrixAt(i, dummy.matrix);
                }

                // Brown dot at z = 0.01
                dummy.position.set(data.x, data.y, 0.01);
                dummy.updateMatrix();
                if (bgMeshRef.current) {
                    bgMeshRef.current.setMatrixAt(i, dummy.matrix);
                }

                // White dot at z = 0.02
                dummy.position.set(data.x, data.y, 0.02);
                dummy.scale.setScalar(0);
                dummy.updateMatrix();
                if (fgMeshRef.current) {
                    fgMeshRef.current.setMatrixAt(i, dummy.matrix);
                }
                i++;
            }
        }
        if (borderMeshRef.current) borderMeshRef.current.instanceMatrix.needsUpdate = true;
        if (bgMeshRef.current) bgMeshRef.current.instanceMatrix.needsUpdate = true;
        if (fgMeshRef.current) fgMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [dummy, dotData]);

    const activeDots = useRef([]);
    const headPositions = useRef([
        { r: Math.floor(ROWS / 3), c: Math.floor(COLS / 5) },
        { r: Math.floor(ROWS / 3), c: Math.floor(2 * COLS / 5) },
        { r: Math.floor(ROWS / 3), c: Math.floor(3 * COLS / 5) },
        { r: Math.floor(ROWS / 3), c: Math.floor(4 * COLS / 5) },
        { r: Math.floor(2 * ROWS / 3), c: Math.floor(COLS / 5) },
        { r: Math.floor(2 * ROWS / 3), c: Math.floor(2 * COLS / 5) },
        { r: Math.floor(2 * ROWS / 3), c: Math.floor(3 * COLS / 5) },
        { r: Math.floor(2 * ROWS / 3), c: Math.floor(4 * COLS / 5) }
    ]);
    const lastMoveTime = useRef(0);

    // Mouse state
    const mouseActive = useRef(false);
    const mouseGridCoords = useRef({ r: -1, c: -1 });
    const clockRef = useRef(0);

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

            // Instantly light up the dot under the mouse to show movement path
            const time = clockRef.current;
            const idx = nr * COLS + nc;
            const existing = activeDots.current.find(d => d.idx === idx);
            if (!existing) {
                activeDots.current.push({ idx, startTime: time - SCALE_IN_DURATION });
            } else {
                existing.startTime = time - SCALE_IN_DURATION;
            }
        }
    };

    const handlePointerOut = () => {
        mouseActive.current = false;
    };

    useFrame((state) => {
        if (!fgMeshRef.current) return;

        const time = state.clock.getElapsedTime();
        clockRef.current = time;

        const moveInterval = mouseActive.current ? 0.05 : 0.2;

        if (time - lastMoveTime.current > moveInterval) {
            lastMoveTime.current = time;

            if (mouseActive.current) {
                const targetR = mouseGridCoords.current.r;
                const targetC = mouseGridCoords.current.c;

                headPositions.current.forEach((head, index) => {
                    // Create an oval shape around target mouse position
                    // Heads distributed evenly: angle = index * 2pi / length
                    const angle = (index / headPositions.current.length) * Math.PI * 2;
                    // Oval radii: horizontal (columns) is 3.5, vertical (rows) is 2.2
                    const targetOffsetR = Math.round(Math.sin(angle) * 4);
                    const targetOffsetC = Math.round(Math.cos(angle) * 4);

                    const destR = Math.max(0, Math.min(ROWS - 1, targetR + targetOffsetR));
                    const destC = Math.max(0, Math.min(COLS - 1, targetC + targetOffsetC));

                    const dr = destR - head.r;
                    const dc = destC - head.c;

                    // Move closer to their target slots on the oval
                    if (dr !== 0 || dc !== 0) {
                        let stepR = 0;
                        let stepC = 0;
                        if (dr !== 0) stepR = Math.sign(dr);
                        if (dc !== 0) stepC = Math.sign(dc);

                        head.r = Math.max(0, Math.min(ROWS - 1, head.r + stepR));
                        head.c = Math.max(0, Math.min(COLS - 1, head.c + stepC));
                    }

                    const idx = head.r * COLS + head.c;
                    const existing = activeDots.current.find(d => d.idx === idx);
                    if (!existing) {
                        activeDots.current.push({ idx, startTime: time - SCALE_IN_DURATION });
                    } else {
                        existing.startTime = time - SCALE_IN_DURATION;
                    }
                });
            } else {
                // Autonomous mode: snakes moving 4 steps straight, then 2 steps turn, and repeat
                headPositions.current.forEach((head) => {
                    // Initialize state properties if not present
                    if (head.stepsLeft === undefined) {
                        head.stepsLeft = 4;
                        head.phase = 'forward'; // 'forward' (4 steps) or 'turn' (2 steps)

                        // Pick an initial random direction
                        const dirs = [
                            { r: 1, c: 0 }, { r: -1, c: 0 },
                            { r: 0, c: 1 }, { r: 0, c: -1 }
                        ];
                        const d = dirs[Math.floor(Math.random() * dirs.length)];
                        head.dirR = d.r;
                        head.dirC = d.c;
                    }

                    // Calculate next position
                    let nr = head.r + head.dirR;
                    let nc = head.c + head.dirC;

                    // Boundary handling: if next step is out of bounds, trigger a phase change/turn early
                    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) {
                        head.stepsLeft = 0;
                    } else {
                        head.r = nr;
                        head.c = nc;
                        head.stepsLeft--;
                    }

                    // If steps are completed (or hit border), change phase and direction
                    if (head.stepsLeft === 0) {
                        if (head.phase === 'forward') {
                            head.phase = 'turn';
                            head.stepsLeft = 2;
                            // Turn to a perpendicular direction
                            if (head.dirR !== 0) {
                                head.dirR = 0;
                                head.dirC = Math.random() > 0.5 ? 1 : -1;
                            } else {
                                head.dirR = Math.random() > 0.5 ? 1 : -1;
                                head.dirC = 0;
                            }
                        } else {
                            head.phase = 'forward';
                            head.stepsLeft = 4;
                            // Turn to a perpendicular direction
                            if (head.dirR !== 0) {
                                head.dirR = 0;
                                head.dirC = Math.random() > 0.5 ? 1 : -1;
                            } else {
                                head.dirR = Math.random() > 0.5 ? 1 : -1;
                                head.dirC = 0;
                            }
                        }
                    }

                    // Clip coordinates to ensure safety
                    head.r = Math.max(0, Math.min(ROWS - 1, head.r));
                    head.c = Math.max(0, Math.min(COLS - 1, head.c));

                    const idx = head.r * COLS + head.c;

                    const existing = activeDots.current.find(d => d.idx === idx);
                    if (!existing) {
                        activeDots.current.push({ idx, startTime: time - SCALE_IN_DURATION });
                    } else {
                        existing.startTime = time - SCALE_IN_DURATION;
                    }
                });
            }
        }

        // Keep dots at current head positions fully lit (scale 1) every frame if mouse is active
        if (mouseActive.current) {
            headPositions.current.forEach((head) => {
                const idx = head.r * COLS + head.c;
                const existing = activeDots.current.find(d => d.idx === idx);
                if (!existing) {
                    activeDots.current.push({ idx, startTime: time - SCALE_IN_DURATION });
                } else {
                    existing.startTime = time - SCALE_IN_DURATION;
                }
            });

            // Also keep the entire filled oval shape around the cursor point fully lit (scale 1)
            const targetR = mouseGridCoords.current.r;
            const targetC = mouseGridCoords.current.c;
            const radiusR = 3;
            const radiusC = 3;

            const startR = Math.max(0, Math.floor(targetR - radiusR - 1));
            const endR = Math.min(ROWS - 1, Math.ceil(targetR + radiusR + 1));
            const startC = Math.max(0, Math.floor(targetC - radiusC - 1));
            const endC = Math.min(COLS - 1, Math.ceil(targetC + radiusC + 1));

            for (let r = startR; r <= endR; r++) {
                for (let c = startC; c <= endC; c++) {
                    const angle = Math.atan2(r - targetR, c - targetC);
                    // Add undulating noise to make the edge dots dynamically appear and disappear
                    const noise = Math.sin(time * 6 + angle * 4) * 0.45;
                    const dynamicRadiusR = radiusR + noise;
                    const dynamicRadiusC = radiusC + noise * (radiusC / radiusR);

                    const dr = (r - targetR) / dynamicRadiusR;
                    const dc = (c - targetC) / dynamicRadiusC;
                    if (dr * dr + dc * dc <= 1.0) {
                        const idx = r * COLS + c;
                        const existing = activeDots.current.find(d => d.idx === idx);
                        if (!existing) {
                            activeDots.current.push({ idx, startTime: time - SCALE_IN_DURATION });
                        } else {
                            existing.startTime = time - SCALE_IN_DURATION;
                        }
                    }
                }
            }
        }

        let needsUpdate = false;

        const currentWaitDuration = mouseActive.current ? 0.25 : 1.0;
        const currentTotalDuration = SCALE_IN_DURATION + currentWaitDuration + SCALE_OUT_DURATION;

        for (let i = activeDots.current.length - 1; i >= 0; i--) {
            const dot = activeDots.current[i];
            const age = time - dot.startTime;

            let scale = 0;
            if (age < SCALE_IN_DURATION) {
                scale = age / SCALE_IN_DURATION;
            } else if (age < SCALE_IN_DURATION + currentWaitDuration) {
                scale = 1;
            } else if (age < currentTotalDuration) {
                const scaleOutAge = age - (SCALE_IN_DURATION + currentWaitDuration);
                scale = 1 - (scaleOutAge / SCALE_OUT_DURATION);
            } else {
                // Explicitly reset scale to 0 in the mesh before splicing
                const data = dotData[dot.idx];
                dummy.position.set(data.x, data.y, 0.02);
                dummy.scale.setScalar(0);
                dummy.updateMatrix();
                fgMeshRef.current.setMatrixAt(dot.idx, dummy.matrix);
                needsUpdate = true;

                activeDots.current.splice(i, 1);
                continue;
            }

            const data = dotData[dot.idx];
            dummy.position.set(data.x, data.y, 0.02);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            fgMeshRef.current.setMatrixAt(dot.idx, dummy.matrix);
            needsUpdate = true;
        }

        if (needsUpdate) {
            fgMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    const gridWidth = COLS * DOT_SPACING;
    const gridHeight = ROWS * DOT_SPACING;

    const scale = Math.min(viewport.width / gridWidth, viewport.height / gridHeight) * 0.95;

    return (
        <group scale={scale} ref={groupRef}>
            {/* Invisible plane to catch mouse interactions smoothly */}
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