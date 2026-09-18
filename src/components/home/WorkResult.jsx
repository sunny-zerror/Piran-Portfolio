"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image';
import ExecutionCanvas from './canvasComponent/ExecutionCanvas';
import CapitalAccess from './canvasComponent/CapitalAccess';
import ClarityCanvas from './canvasComponent/ClarityCanvas';
import LogoDotSpreadCanvas from './canvasComponent/LogoDotSpreadCanvas';

const WorkResult = () => {

  return (
    <>
      <div className="relative w-full border-t border-dashed border-[#0B1A2C20] overflow-hidden">
        <div className="container  pt-12 md:pt-24 space-y-8 md:space-y-16 relative z-10">
          <div className="w-full max-sm:space-y-2 md:grid grid-cols-6">
            <h2 data-para-effect className=' col-span-4 leading-none'>Where I <br />Come In</h2>
            <p data-para-effect className='opacity-70 leading-tight col-span-2 text-lg'>Founders rarely call about strategy. They call because something feels misaligned drift, friction, growth that costs more than it returns. The problem is rarely effort. It's position. The brand never had one to organise around. Finding it is where I come in.</p>
          </div>
          <div className="w-full border border-black/20 divide-y divide-black/20">

            {/* Card 1: Clarity */}
            <div className="flex flex-col md:grid grid-cols-2 md:h-100 p-6 md:p-8 gap-6 md:gap-8">
              <div className="flex flex-col justify-between gap-6 md:gap-0">
                <div className="size-12 md:size-20">
                  <Image width={80} height={80} src="/images/homepage/workResult/clarity.svg" alt="Clarity" />
                </div>
                <div className="space-y-2">
                  <h4 data-para-effect>Clarity</h4>
                  <p className="opacity-70 leading-tight md:w-[70%]">We start by finding where you actually stand, then map the route to where you're headed.</p>
                </div>
              </div>
              <div className="h-48 md:h-full w-full">
                <ClarityCanvas />
              </div>
            </div>

            {/* Card 2: Execution */}
            <div className="flex flex-col md:grid grid-cols-2 md:h-100 p-6 md:p-8 text-white bg-[#883F27] gap-6 md:gap-8">
              <div className="order-2 md:order-1 h-48 md:h-full w-full">
                <ExecutionCanvas />
              </div>
              <div className="order-1 md:order-2 flex flex-col justify-between gap-6 md:gap-0">
                <div className="size-12 md:size-20">
                  <Image width={80} height={80} src="/images/homepage/workResult/execution.svg" alt="Execution" />
                </div>
                <div className="space-y-2">
                  <h4 data-para-effect>Execution</h4>
                  <p className="opacity-70 leading-tight md:w-[70%]">Then we walk it: identity, materials, and systems, built with Point Of and its vetted brand partners.</p>
                </div>
              </div>
            </div>

            {/* Card 3: Backing */}
            <div className="flex flex-col md:grid grid-cols-2 md:h-100 p-6 md:p-8 gap-6 md:gap-8">
              <div className="flex flex-col justify-between gap-6 md:gap-0">
                <div className="size-12 md:size-20">
                  <Image width={80} height={80} src="/images/homepage/workResult/CA.svg" alt="Capital Access" />
                </div>
                <div className="space-y-2">
                  <h4 data-para-effect>Backing</h4>
                  <p className="opacity-70 leading-tight md:w-[70%]">
                    And for the right founders, I go further: equity, introductions, and a network that travels with you.
                  </p>
                </div>
              </div>
              <div className="h-48 md:h-full w-full">
                <CapitalAccess />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default WorkResult