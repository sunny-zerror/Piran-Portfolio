"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Exact dimensions from the image
const ROWS = 16;
const COLS = 33;
const PAD_X = 2; // 2 columns padding on left/right
const PAD_Y = 2; // 2 rows padding on top/bottom

const BAR_WIDTH = 2;
const GAP = 1;
const DOT_SIZE = 1;
const DOT_SPACING = 1.2;

const Dots = () => {
    const borderMeshRef = useRef();
    const bgMeshRef = useRef();
    const fgMeshRef = useRef();
    const { viewport } = useThree();

    const [hoveredCol, setHoveredCol] = useState(null);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const fgDummy = useMemo(() => new THREE.Object3D(), []);

    const numBars = 10; // Exactly 10 bars in the image
    const maxBarHeight = ROWS - (PAD_Y * 2); // 14

    const bars = useMemo(() => {
        return Array.from({ length: numBars }, () => ({
            phase: Math.random() * Math.PI * 2,
            speed: 0.8 + Math.random() * 0.4,
            baseHeight: maxBarHeight * 0.4,
            amplitude: maxBarHeight * 0.3
        }));
    }, [maxBarHeight]);

    // Store smoothed height for each bar to create the sequential ripple effect
    const barHeights = useRef(new Float32Array(numBars));

    // Store scales and velocities for individual dots (spring animation)
    const targetScales = useRef(new Float32Array(ROWS * COLS));
    const currentScales = useRef(new Float32Array(ROWS * COLS));
    const scaleVelocities = useRef(new Float32Array(ROWS * COLS));

    useEffect(() => {
        let i = 0;
        const totalWidth = COLS * DOT_SPACING;
        const totalHeight = ROWS * DOT_SPACING;
        const startX = -totalWidth / 2 + DOT_SPACING / 2;
        const startY = -totalHeight / 2 + DOT_SPACING / 2;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                dummy.position.set(startX + c * DOT_SPACING, startY + r * DOT_SPACING, 0);
                dummy.updateMatrix();
                
                if (borderMeshRef.current) borderMeshRef.current.setMatrixAt(i, dummy.matrix);
                if (bgMeshRef.current) bgMeshRef.current.setMatrixAt(i, dummy.matrix);
                
                if (fgMeshRef.current) {
                    fgDummy.position.copy(dummy.position);
                    fgDummy.position.z = 0; // Exactly 0
                    fgDummy.scale.setScalar(0);
                    fgDummy.updateMatrix();
                    fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);
                }
                i++;
            }
        }
        if (borderMeshRef.current) borderMeshRef.current.instanceMatrix.needsUpdate = true;
        if (bgMeshRef.current) bgMeshRef.current.instanceMatrix.needsUpdate = true;
        if (fgMeshRef.current) fgMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [dummy, fgDummy]);

    useFrame((state) => {
        if (!fgMeshRef.current) return;
        const time = state.clock.getElapsedTime();
        let i = 0;

        const totalWidth = COLS * DOT_SPACING;
        const totalHeight = ROWS * DOT_SPACING;
        const startX = -totalWidth / 2 + DOT_SPACING / 2;
        const startY = -totalHeight / 2 + DOT_SPACING / 2;

        for (let barIndex = 0; barIndex < numBars; barIndex++) {
            const bar = bars[barIndex];
            // Continuous idle animation
            const animatedHeight = bar.baseHeight + Math.sin(time * bar.speed + bar.phase) * bar.amplitude;
            // Target full height if hovered
            const targetHeight = hoveredCol === barIndex ? maxBarHeight : animatedHeight;

            // Smoothly interpolate the bar's virtual height
            barHeights.current[barIndex] += (targetHeight - barHeights.current[barIndex]) * 0.15;
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                let isActive = false;

                // Only active if inside the padded area
                if (r >= PAD_Y && r < ROWS - PAD_Y && c >= PAD_X && c < COLS - PAD_X) {
                    const localC = c - PAD_X;
                    const isGap = localC % (BAR_WIDTH + GAP) >= BAR_WIDTH;
                    const barIndex = Math.floor(localC / (BAR_WIDTH + GAP));

                    if (!isGap && barIndex < numBars) {
                        const localR = r - PAD_Y;
                        if (localR < barHeights.current[barIndex]) {
                            isActive = true;
                        }
                    }
                }

                targetScales.current[i] = isActive ? 1 : 0;

                // Spring wobble physics
                const tension = 0.2;
                const friction = 0.7;
                scaleVelocities.current[i] += (targetScales.current[i] - currentScales.current[i]) * tension;
                scaleVelocities.current[i] *= friction;
                currentScales.current[i] += scaleVelocities.current[i];

                // Prevent negative scale
                const scale = Math.max(0, currentScales.current[i]);

                // Set Z to 0 so there is zero perspective parallax. 
                // Z-fighting is handled purely by depthTest={false} on the material!
                fgDummy.position.set(startX + c * DOT_SPACING, startY + r * DOT_SPACING, 0);
                fgDummy.scale.setScalar(scale);
                fgDummy.updateMatrix();
                fgMeshRef.current.setMatrixAt(i, fgDummy.matrix);

                i++;
            }
        }
        fgMeshRef.current.instanceMatrix.needsUpdate = true;
    });

    const handlePointerMove = (e) => {
        // The most robust way to get mouse position is converting the world point to local space
        if (bgMeshRef.current) {
            const localPoint = bgMeshRef.current.worldToLocal(e.point.clone());
            const totalWidth = COLS * DOT_SPACING;
            const startX = -totalWidth / 2;
            const xPos = localPoint.x - startX;

            if (xPos >= 0 && xPos <= totalWidth) {
                const c = Math.floor(xPos / DOT_SPACING);
                if (c >= PAD_X && c < COLS - PAD_X) {
                    const localC = c - PAD_X;
                    const barIndex = Math.floor(localC / (BAR_WIDTH + GAP));
                    // Highlight the bar!
                    setHoveredCol(Math.min(barIndex, numBars - 1));
                } else {
                    setHoveredCol(null);
                }
            } else {
                setHoveredCol(null);
            }
        }
    };

    const handlePointerOut = () => {
        setHoveredCol(null);
    };

    const gridWidth = COLS * DOT_SPACING;
    const gridHeight = ROWS * DOT_SPACING;

    // Calculate scale to fit perfectly in the container while keeping aspect ratio
    const scale = Math.min(viewport.width / gridWidth, viewport.height / gridHeight);

    return (
        <group scale={scale}>
            <mesh position={[0, 0, 2]} onPointerMove={handlePointerMove} onPointerOut={handlePointerOut}>
                <planeGeometry args={[gridWidth, gridHeight]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <instancedMesh ref={borderMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[(DOT_SIZE / 2) + 0.08, 32]} />
                <meshBasicMaterial color="#d1d5db" />
            </instancedMesh>

            <instancedMesh ref={bgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE / 2, 32]} />
                <meshBasicMaterial color="#883F27" depthTest={false} />
            </instancedMesh>

            <instancedMesh ref={fgMeshRef} args={[null, null, ROWS * COLS]}>
                <circleGeometry args={[DOT_SIZE / 2, 32]} />
                <meshBasicMaterial color="#ffffff" depthTest={false} />
            </instancedMesh>
        </group>
    );
};

export default function CapitalAccess() {
    return (
        <div className="w-full h-full relative cursor-crosshair">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <Dots />
            </Canvas>
        </div>
    );
}
