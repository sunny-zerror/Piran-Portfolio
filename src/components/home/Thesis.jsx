"use client";
import React from 'react';
import CustomButton from '../common/CustomButton';
import ThesisOverlay from './ThesisOverlay';
import { useThesisStore } from '@/store/useThesisStore';

const Thesis = () => {
    const { openThesis } = useThesisStore();


    return (
        <>
            {/* Main Section on Page */}
            <section className="container py-12 border-b border-dashed border-[#0B1A2C20] md:py-24 relative space-y-8 md:space-y-16   ">
                <div className="w-full max-sm:space-y-2 md:grid grid-cols-6">
                    <h2 data-para-effect className=' col-span-4 leading-none'>The Thesis</h2>
                    <p data-para-effect className='opacity-70 leading-tight col-span-2 text-lg'>Consultants leave after the recommendation. Agencies leave after the deliverable. Investors show up for board meetings.</p>
                </div>
                <div className="max-w-4xl md:mx-auto md:text-center space-y-3 md:space-y-5 w-full flex flex-col md:items-center">

                    <h2 data-para-effect className="">
                        Nobody stays. I stay.
                    </h2>

                    <p data-para-effect className="opacity-70 leading-tight col-span-2 text-xl">
                        Consultants leave after the recommendation. Agencies leave after the deliverable. Investors show up for board meetings. Nobody stays. I stay. I come in before the institutions do, usually pre-seed to seed, where positioning is the bottleneck rather than the product. Home ground: wellness, healthcare, and financial services. The ask is simple and documented: strategic equity, agreed before the work begins.
                    </p>

                    <CustomButton onClick={openThesis} className='w-fit'>
                        Read the full thesis
                    </CustomButton>
                </div>
            </section>
            <ThesisOverlay />
        </>
    );
};

export default Thesis;
