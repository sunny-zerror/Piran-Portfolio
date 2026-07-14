"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ExecutionCanvas from './canvasComponent/ExecutionCanvas';
import CapitalAccess from './canvasComponent/CapitalAccess';
import ClarityCanvas from './canvasComponent/ClarityCanvas';

const WorkResult = () => {

  return (
    <>
      <div className="container pt-24 space-y-16 bg-[#E3E2DC]">
        <div className="w-full grid grid-cols-6 items-end">
          <h2 data-para-effect className=' col-span-4 leading-none'>The Work Behind <br /> the Results</h2>
          <p data-para-effect className='opacity-70 leading-tight col-span-2 text-lg'>Behind every result is a process built on clarity, creativity, and execution—transforming ideas into experiences that create lasting impact.</p>
        </div>
        <div className="w-full border border-black/20">


          <div className=" h-100 grid grid-cols-8 p-8">
            <div className="  col-span-3 flex flex-col justify-between">
              <div className="">
                <img src="/images/homepage/workResult/clarity.svg" alt="" />
              </div>
              <div className="space-y-2">
                <h4 data-para-effect>Clarity</h4>
                <p className='opacity-70 leading-tight'>I help founders define positioning, sharpen strategic direction, clarify market relevance, and establish a narrative that aligns teams, investors, customers, and partners around the same future.</p>
              </div>
            </div>
            <div className=""></div>
            <div className="  col-span-4 ">
              <ClarityCanvas />
            </div>
          </div>


          <div className=" h-100 grid grid-cols-8 p-8 text-white bg-[#0B1A2C]">
            <div className="  col-span-4 ">
              <ExecutionCanvas />
            </div>
            <div className=""></div>
            <div className="  col-span-3 flex flex-col justify-between">
              <div className="">
                <img src="/images/homepage/workResult/execution.svg" alt="" />
              </div>
              <div className="space-y-2">
                <h4 data-para-effect>Execution</h4>
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
                <h4 data-para-effect>Capital Access</h4>
                <p className="opacity-70 leading-tight">
                  I help companies become investment-ready by strengthening the narrative,
                  strategic positioning, and credibility required to engage investors.
                </p>
              </div>
            </div>

            <div />

            <div className="col-span-4">
              <CapitalAccess />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkResult