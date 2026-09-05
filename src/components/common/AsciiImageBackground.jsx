"use client";
import React, { useEffect, useRef, useState } from 'react';

const AsciiImageBackground = ({ 
    src, 
    chars = " .:-=+*#%@", 
    cols = 150, 
    invert = false,
    className = "",
    ref
}) => {
    const canvasRef = useRef(null);
    const preRef = useRef(null);

    useEffect(() => {
        let animationFrameId;
        const image = new Image();
        image.src = src;
        image.crossOrigin = "Anonymous";
        image.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            // Adjust height based on font aspect ratio (roughly 0.5)
            const ratio = image.width / image.height;
            const rows = Math.floor((cols / ratio) * 0.5);
            
            canvas.width = cols;
            canvas.height = rows;
            
            ctx.drawImage(image, 0, 0, cols, rows);
            const imageData = ctx.getImageData(0, 0, cols, rows);
            const data = imageData.data;
            
            const charsLength = chars.length;
            const luminanceMap = new Float32Array(cols * rows);
            
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const offset = (y * cols + x) * 4;
                    const a = data[offset + 3];
                    if (a < 128) {
                        luminanceMap[y * cols + x] = -1;
                    } else {
                        const r = data[offset];
                        const g = data[offset + 1];
                        const b = data[offset + 2];
                        let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        if (invert) luminance = 1 - luminance;
                        luminanceMap[y * cols + x] = luminance;
                    }
                }
            }

            const renderFrame = (time) => {
                const t = time * 0.005; 

                const rowsArr = new Array(rows);
                for (let y = 0; y < rows; y++) {
                    let rowStr = "";
                    const yOffset = y * cols;
                    for (let x = 0; x < cols; x++) {
                        const lum = luminanceMap[yOffset + x];
                        if (lum === -1) {
                             rowStr += " ";
                        } else {
                             // Combine multiple sine waves for random-looking gaps (1-10 cols)
                             let wave = (
                                 Math.sin(x * 0.2 + y * 0.05 - t) + 
                                 Math.sin(x * 0.15 - y * 0.06 - t * 0.8) + 
                                 Math.sin(x * 0.5 - y * 0.1 - t * 1.5) + 
                                 3
                             ) / 6;
                             
                             // Bias the wave upwards to reduce the amount of empty space (transparency)
                             wave = Math.pow(wave, 0.5);
                             
                             const combined = lum * wave;
                             let charIndex = Math.floor(combined * charsLength);
                             if (charIndex >= charsLength) charIndex = charsLength - 1;
                             rowStr += chars[charIndex];
                        }
                    }
                    rowsArr[y] = rowStr;
                }
                
                if (preRef.current) {
                    preRef.current.textContent = rowsArr.join('\n');
                }
                
                animationFrameId = requestAnimationFrame(renderFrame);
            };
            
            animationFrameId = requestAnimationFrame(renderFrame);
        };

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [src, chars, cols, invert]);

    return (
        <div ref={ref} className={`absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none select-none ${className}`}>
            <canvas ref={canvasRef} className="hidden" />
            <pre ref={preRef} className="font-mono text-[0.5rem] leading-none  text-center whitespace-pre text-inherit">
            </pre>
        </div>
    );
};

export default AsciiImageBackground;
