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
        { r: 10, c: 25 },
        { r: 10, c: 24 },
        { r: 10, c: 23 },
        { r: 10, c: 22 },
        { r: 10, c: 21 },
        { r: 10, c: 20 },
        { r: 10, c: 19 },
        { r: 10, c: 18 },
        { r: 10, c: 17 },
        { r: 10, c: 16 },
        { r: 10, c: 15 },
        { r: 10, c: 14 },
        { r: 10, c: 13 },
        { r: 10, c: 12 },
        { r: 10, c: 11 },
    ]);
    const checkpoints = useRef([]);
    const lastMoveTime = useRef(0);
    const initializedCheckpoints = useRef(false);
    const lastDirection = useRef({ r: 0, c: 1 });

    const mouseActive = useRef(false);
    const mouseMoving = useRef(false);
    const mouseTimer = useRef(null);
    const mouseGridCoords = useRef({ r: -1, c: -1 });

    const handlePointerMove = (e) => {
        mouseActive.current = true;
        mouseMoving.current = true;

        if (mouseTimer.current) clearTimeout(mouseTimer.current);
        mouseTimer.current = setTimeout(() => {
            mouseMoving.current = false;
        }, 250);

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
        mouseMoving.current = false;
        if (mouseTimer.current) clearTimeout(mouseTimer.current);
    };

    const generateCheckpoint = (currentCheckpoints, headPosition) => {
        let valid = false;
        let r, c;
        let attempts = 0;
        while (!valid && attempts < 200) {
            attempts++;
            r = Math.floor(Math.random() * (ROWS - 1));
            c = Math.floor(Math.random() * (COLS - 1));
            valid = true;

            const cpDots = [{ r, c }, { r: r + 1, c }, { r, c: c + 1 }, { r: r + 1, c: c + 1 }];

            // Check not on snake body
            if (cpDots.some(cpDot => snakeBody.current.some(part => Math.abs(part.r - cpDot.r) <= 1 && Math.abs(part.c - cpDot.c) <= 1))) {
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
            for (let j = 0; j < 1; j++) {
                initialCheckpoints.push(generateCheckpoint(initialCheckpoints, snakeBody.current[0]));
            }
            checkpoints.current = initialCheckpoints;
            initializedCheckpoints.current = true;
        }
    }, [dummy, dotData]);

    useFrame((state) => {
        if (!fgMeshRef.current || checkpoints.current.length === 0) return;

        const time = state.clock.getElapsedTime();

        const moveInterval = mouseActive.current ? 0.02 : 0.08; // Double speed (2x fast) during mouse move

        if (time - lastMoveTime.current > moveInterval) {
            lastMoveTime.current = time;

            const head = snakeBody.current[0];
            let target = null;
            let eatTarget = false;

            if (mouseActive.current) {
                target = mouseGridCoords.current;
                eatTarget = false;

                // Stop snake when head reaches exact cursor grid point
                const reachedCursor = head.r === target.r && head.c === target.c;
                if (reachedCursor) {
                    target = null;
                }
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

                const lastDir = lastDirection.current;

                // Candidates for next direction: straight ahead, perpendicular turns (NO U-TURNS / Reverses allowed)
                const candidates = [];

                // Primary candidate: keep going straight in current direction if aligned/moving towards target along that axis
                if (lastDir.r !== 0) {
                    if ((lastDir.r > 0 && dr > 0) || (lastDir.r < 0 && dr < 0)) {
                        candidates.push({ r: lastDir.r, c: 0 }); // keep going straight
                    }
                } else if (lastDir.c !== 0) {
                    if ((lastDir.c > 0 && dc > 0) || (lastDir.c < 0 && dc < 0)) {
                        candidates.push({ r: 0, c: lastDir.c }); // keep going straight
                    }
                }

                // If going straight doesn't bring us closer along that axis (e.g. reached target row/col), try orthogonal turns
                if (dc !== 0 && lastDir.c === 0) {
                    candidates.push({ r: 0, c: Math.sign(dc) });
                }
                if (dr !== 0 && lastDir.r === 0) {
                    candidates.push({ r: Math.sign(dr), c: 0 });
                }

                // Fallback 1: if no progress toward target without U-turn, keep going straight until wall/boundary
                if (candidates.length === 0 && (lastDir.r !== 0 || lastDir.c !== 0)) {
                    candidates.push({ r: lastDir.r, c: lastDir.c });
                }

                // Pick the first valid non-reversing candidate
                const chosenDir = candidates[0] || { r: 0, c: 0 };
                nextR += chosenDir.r;
                nextC += chosenDir.c;

                if (nextR !== head.r || nextC !== head.c) {
                    lastDirection.current = {
                        r: nextR - head.r,
                        c: nextC - head.c
                    };
                    const newHead = { r: nextR, c: nextC };

                    snakeBody.current.unshift(newHead);

                    const isEating = eatTarget &&
                        (newHead.r === target.r || newHead.r === target.r + 1) &&
                        (newHead.c === target.c || newHead.c === target.c + 1);

                    if (isEating) {
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

                let isSnake = false;
                const len = snakeBody.current.length;

                if (len > 0) {
                    // Head logic
                    const H = snakeBody.current[0];
                    let dirR = 0, dirC = 1;
                    if (len >= 2) {
                        dirR = Math.sign(H.r - snakeBody.current[1].r);
                        dirC = Math.sign(H.c - snakeBody.current[1].c);
                    }
                    if (dirR === 0 && dirC === 0) dirC = 1;

                    const perpR = Math.abs(dirC);
                    const perpC = Math.abs(dirR);

                    const dr = r - H.r;
                    const dc = c - H.c;

                    const forward = dr * dirR + dc * dirC;
                    const side = dr * perpR + dc * perpC;

                    if ((forward === 0 && Math.abs(side) <= 2) ||
                        (forward === 1 && Math.abs(side) <= 1)) {
                        isSnake = true;
                    }

                    // Tail logic
                    if (len >= 2) {
                        const T = snakeBody.current[len - 1];
                        const T2 = snakeBody.current[len - 2];
                        let tDirR = Math.sign(T.r - T2.r);
                        let tDirC = Math.sign(T.c - T2.c);
                        if (tDirR === 0 && tDirC === 0) tDirC = -1;

                        const tPerpR = Math.abs(tDirC);
                        const tPerpC = Math.abs(tDirR);

                        const tdr = r - T.r;
                        const tdc = c - T.c;

                        const tForward = tdr * tDirR + tdc * tDirC;
                        const tSide = tdr * tPerpR + tdc * tPerpC;

                        if ((tForward === 0 && Math.abs(tSide) <= 1) ||
                            (tForward === 1 && Math.abs(tSide) === 0)) {
                            isSnake = true;
                        }
                    }
                }

                if (!isSnake) {
                    const endIdx = len >= 2 ? len - 1 : len;
                    for (let i = 0; i < endIdx; i++) {
                        const part = snakeBody.current[i];
                        if (Math.abs(part.r - r) <= 1 && Math.abs(part.c - c) <= 1) {
                            isSnake = true;
                            break;
                        }
                    }
                }

                if (isSnake) {
                    scale = 1;
                } else if (!mouseActive.current) {
                    const matchedCP = checkpoints.current.find(cp =>
                        (r === cp.r || r === cp.r + 1) && (c === cp.c || c === cp.c + 1)
                    );
                    if (matchedCP) {
                        scale = 1;
                        isCheckpoint = true;
                        // Synchronized opacity blink using checkpoint base position
                        alpha = 0.2 + 0.8 * Math.abs(Math.sin(time * 5 + (matchedCP.r * 0.5) + (matchedCP.c * 0.5)));
                    }
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