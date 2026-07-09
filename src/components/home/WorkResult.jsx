"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
const DOT_SIZE = 12;
const GAP = 6;

const WorkResult = () => {
  const ref = useRef(null);

  const [grid, setGrid] = useState({
    rows: 0,
    cols: 0,
  });

  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;

      const { width, height } = ref.current.getBoundingClientRect();

      const step = DOT_SIZE + GAP;

      setGrid({
        cols: Math.floor(width / step),
        rows: Math.floor(height / step),
      });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(ref.current);

    return () => ro.disconnect();
  }, []);

  const barWidth = 3;

  const barCount = Math.floor(grid.cols / barWidth);

  const heights = useMemo(() => {
    return Array.from({ length: barCount }, () =>
      Math.floor(Math.random() * (grid.rows * 0.65)) +
      Math.floor(grid.rows * 0.2)
    );
  }, [barCount, grid.rows]);
 
    return (
        <>
            <div className="container pt-24 space-y-16 bg-[#E3E2DC]">
                <div className="w-full grid grid-cols-6 items-end">
                    <h2 className=' col-span-4 leading-none'>The Work Behind <br /> the Results</h2>
                    <p className='opacity-70 leading-tight col-span-2 text-lg'>Behind every result is a process built on clarity, creativity, and execution—transforming ideas into experiences that create lasting impact.</p>
                </div>
                <div className="w-full border border-black/20">
                    <div className=" h-100 grid grid-cols-8 p-8">
                        <div className="  col-span-3 flex flex-col justify-between">
                            <div className="">
                                <img src="/images/homepage/workResult/clarity.svg" alt="" />
                            </div>
                            <div className="space-y-2">
                                <h4>Clarity</h4>
                                <p className='opacity-70 leading-tight'>I help founders define positioning, sharpen strategic direction, clarify market relevance, and establish a narrative that aligns teams, investors, customers, and partners around the same future.</p>
                            </div>
                        </div>
                        <div className=""></div>
                        <div className="  col-span-4 "></div>
                    </div>
                    <div className=" h-100 grid grid-cols-8 p-8 text-white bg-[#182532]">
                        <div className="  col-span-4 "></div>
                        <div className=""></div>
                        <div className="  col-span-3 flex flex-col justify-between">
                            <div className="">
                                <img src="/images/homepage/workResult/execution.svg" alt="" />
                            </div>
                            <div className="space-y-2">
                                <h4>Execution</h4>
                                <p className='opacity-70 leading-tight'>Together, we translate ideas into operating realities—aligning leadership, decision-making, priorities, partnerships, and growth initiatives around a coherent strategic framework.</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-100 grid grid-cols-8 p-8">
                        <div className="col-span-3 flex flex-col justify-between">
                            <div>
                                <img src="/images/homepage/workResult/CA.svg" alt="" />
                            </div>

                            <div className="space-y-2">
                                <h4>Capital Access</h4>
                                <p className="opacity-70 leading-tight">
                                    I help companies become investment-ready by strengthening the narrative,
                                    strategic positioning, and credibility required to engage investors.
                                </p>
                            </div>
                        </div>

                        <div />

                        <div className="col-span-4">
                  <div
      ref={ref}
      className="w-full h-full grid"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, ${DOT_SIZE}px)`,
        gridAutoRows: `${DOT_SIZE}px`,
        gap: `${GAP}px`,
      }}
    >
      {Array.from({ length: grid.rows }).map((_, row) =>
        Array.from({ length: grid.cols }).map((_, col) => {
          const bar = Math.floor(col / barWidth);
          const inside = col % barWidth;

          let active = false;

          if (inside < 2 && bar < heights.length) {
            const current =
              hovered === bar ? grid.rows : heights[bar];

            active = row >= grid.rows - current;
          }

          return (
           <div
  key={`${row}-${col}`}
  onMouseEnter={() => inside < 2 && setHovered(bar)}
  onMouseLeave={() => setHovered(null)}
  className="flex items-center justify-center rounded-full bg-[#B7C19A]"
  style={{
    width: DOT_SIZE,
    height: DOT_SIZE,
  }}
>
  <div
    className="rounded-full bg-white transition-transform duration-300 ease-out"
    style={{
      width: DOT_SIZE,
      height: DOT_SIZE,
      transform: `scale(${active ? 1 : 0})`,
      transitionDelay: active
        ? `${(grid.rows - row) * 18}ms` // bottom -> top
        : "0ms",
    }}
  />
</div>
          );
        })
      )}
    </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkResult