"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image';
import ExecutionCanvas from './canvasComponent/ExecutionCanvas';
import CapitalAccess from './canvasComponent/CapitalAccess';
import ClarityCanvas from './canvasComponent/ClarityCanvas';

const WorkResult = () => {

  return (
    <>
      <div className="container pt-12 md:pt-24 space-y-8 md:space-y-16 bg-[#E3E2DC]">
        <div className="w-full max-sm:space-y-2 md:grid grid-cols-6 items-end">
          <h2 data-para-effect className=' col-span-4 leading-none'>Where I <br />Come In</h2>
          <p data-para-effect className='opacity-70 leading-tight col-span-2 text-lg'>Founders rarely call about strategy. They call because something feels misaligned drift, friction, growth that costs more than it returns. The problem is rarely effort. It's position. The brand never had one to organise around. Finding it is where I come in.</p>
        </div>
        <div className="w-full border border-black/20">


          <div className=" md:h-100 md:grid grid-cols-8 p-5 md:p-8">
            <div className="  col-span-3 md:flex flex-col justify-between">
              <div className=" size-12 md:size-20">
                <Image width={80} height={80} src="/images/homepage/workResult/clarity.svg" alt="Clarity icon" />
              </div>
              <div className=" max-sm:pt-10 space-y-2">
                <h4 data-para-effect>Clarity</h4>
                <p className='opacity-70 leading-tight'>We start by finding where you actually stand, then map the route to where you're headed.</p>
              </div>
            </div>
            <div />
            <div className="col-span-4 h-50  md:h-full w-full">
              <ClarityCanvas />
            </div>
          </div>


          <div className="flex flex-col-reverse md:grid md:h-100 grid-cols-8 p-5 md:p-8 text-white bg-[#0B1A2C]">
            <div className="col-span-4 h-50  md:h-full w-full">
              <ExecutionCanvas />
            </div>
            <div className=""></div>
            <div className="  col-span-3 md:flex flex-col justify-between">
              <div className=" size-12 md:size-20">
                <Image width={80} height={80} src="/images/homepage/workResult/execution.svg" alt="Execution icon" />
              </div>
              <div className=" max-sm:pt-10 space-y-2">
                <h4 data-para-effect>Execution</h4>
                <p className='opacity-70 leading-tight'>Then we walk it identity, materials, and systems, built with Point Of and its vetted brand partners.</p>
              </div>
            </div>
          </div>


          <div className=" md:h-100 md:grid grid-cols-8 p-5 md:p-8">
            <div className="  col-span-3 md:flex flex-col justify-between">
              <div className=' size-12 md:size-20'>
                <Image width={80} height={80} src="/images/homepage/workResult/CA.svg" alt="Capital Access icon" />
              </div>

              <div className=" max-sm:pt-10 space-y-2">
                <h4 data-para-effect>Backing</h4>
                <p className="opacity-70 leading-tight">
                   And for the right founders, I go further equity, introductions, and a network that travels with you.</p>
              </div>
            </div>

            <div />

            <div className="col-span-4 h-50 md:h-full w-full">
              <CapitalAccess />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkResult