"use client";
import React, { useState, useEffect } from 'react';
import { RiCloseLine } from '@remixicon/react';
import CustomButton from '../common/CustomButton';

import { useThesisStore } from '@/store/useThesisStore';

const ThesisOverlay = () => {
    const { isOpen, closeThesis } = useThesisStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setTimeout(() => {
                setIsMounted(false);
            }, 300);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isVisible) {
                closeThesis();
            }
        };

        if (isVisible) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, closeThesis]);

    if (!isMounted) return null;

    return (
        <div data-lenis-prevent className={`fixed inset-0 z-[999999] bg-[#0B1A2C] text-white overflow-y-auto w-full h-full transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Close Button */}
            <button
                onClick={closeThesis}
                className="fixed top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white/10 hover:bg-white hover:text-[#182934] rounded-full flex items-center justify-center transition-all duration-300 z-50"
                aria-label="Close Thesis Overlay"
            >
                <RiCloseLine size={24} />
            </button>

            <div className="w-full max-w-[68ch] mx-auto py-24 md:py-32 px-6 md:px-0">
                <div className="space-y-16">
                    
                    <section>
                        <h3 className=" mb-3">The Thesis</h3>
                        <div className="space-y-6 text-lg md:text-xl opacity-90 ">
                            <p>Most early-stage founders don't fail because the product was wrong or the money ran out. They fail because clarity was missing in the year it mattered most. The pre-institutional phase is where decisions compound fastest: positioning, narrative, market understanding, direction. Everything downstream inherits that clarity or its absence.</p>
                            <p>The support around founders is fragmented by design. Consultants optimise for the recommendation, agencies for the asset, capital for the board seat. Each exits before the hardest part: the pivots, the repositioning, the translation of strategy into something real. No one holds the full picture, and no one stays. That gap is the practice.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3">Where I Work</h3>
                        <div className="space-y-6 text-lg md:text-xl opacity-90 ">
                            <p>Home ground: wellness, healthcare, and financial services. That is where the conviction has clustered, in equity earned through the work and in positions taken early. What I bring into these markets is the brand lens: the early bottleneck is rarely the science or the licence, it is positioning, narrative, and direction. That is the bottleneck I unlock.</p>
                            <p>I come in early: pre-revenue or early revenue, before institutional capital, while the strategic decisions still compound. Selectively, the work reaches beyond the home ground, into consumer and craft-led businesses where positioning carries the same weight. If positioning isn't the problem, I'm not the answer.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3">The Ask</h3>
                        <div className="space-y-6 text-lg md:text-xl opacity-90 ">
                            <p>Strategic equity is the default and the anchor. I earn it by creating value, not by deploying capital. Structures are agreed upfront and tied to clear dependencies: milestones delivered, scope fulfilled, value unlocked. Shares vest when the agreed condition is met.</p>
                            <p>Capital itself is rare. It follows conviction built through an engagement that's already proving itself, and when it happens it's structured simply and accompanies a relationship that's been tested. My upside is the founder's upside. I don't extract. I earn.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3">How I Work</h3>
                        <div className="space-y-6 text-lg md:text-xl opacity-90 ">
                            <p>It starts with a conversation that isn't a pitch but a read, on both sides. If there's mutual interest, a structured questionnaire follows, and after that the deeper conversations: scope, involvement, equity, milestones, cadence. Nothing is implied, everything is agreed, and a signed agreement comes before any work and any doors open. Typically seven or more meetings before commitment is discussed seriously.</p>
                            <p>The engagement then moves through three phases. Intensive: close rhythm, the foundational decisions, the phase where value concentrates. Building: partners step in, Point Of and vetted specialists, while I hold the strategic layer. Steady: reports and open availability, a sounding board and a door-opener as the company grows. Partners are introduced transparently, and the founder always chooses. Through every phase, I'm a message away.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3">What I Don't Do</h3>
                        <div className="space-y-6 text-lg md:text-xl opacity-90 ">
                            <p>No passive involvement: if I'm in, I'm embedded. No template-first work: playbooks are starting points, never the deliverable. No operational takeover: the founder leads the business. No engagements where clarity isn't the bottleneck. And no capital without conviction that's been earned in the room. The boundaries protect every engagement and the model itself. Restraint is structural, not posturing.</p>
                        </div>
                    </section>

                    <section className="pt-12 border-t border-white/20">
                        <p className="text-lg md:text-xl opacity-90  mb-8">
                            If you're building something that deserves this kind of attention, the door is one form away.
                        </p>
                        <div >
                            <CustomButton onClick={closeThesis} href="/contact" className="w-fit">
                                Begin
                            </CustomButton>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default ThesisOverlay;
