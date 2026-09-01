"use client";
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomButton from './CustomButton';

gsap.registerPlugin(ScrollTrigger);

const text = "The relationship begins with the project and ends when the brand stops growing. If that's how you're building, let's begin.";
const words = text.split(" ");

const PhysicsTextCta = () => {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const { Engine, Runner, World, Bodies, Mouse, MouseConstraint, Composite } = Matter;

    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    engine.enableSleeping = true;
    engine.gravity.y = 0; // start with no gravity

    // Create boundaries
    const wallOptions = { isStatic: true, friction: 0.3, restitution: 0.4 };
    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    const wordBodies = [];
    const wordElements = wordsRef.current;

    // Calculate initial positions
    const containerRect = container.getBoundingClientRect();
    
    wordElements.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      // Store initial center position for transform calculation
      el.dataset.initialX = x;
      el.dataset.initialY = y;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.5,
        friction: 0,
        density: 0.05,
        sleepThreshold: 15,
        render: { visible: false } // we render via DOM
      });

      Matter.Body.setStatic(body, true);
      wordBodies.push(body);
    });

    Composite.add(engine.world, wordBodies);

    // Mouse constraint for dragging
    // We need to pass the container element for mouse interaction
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // Sync DOM elements with Matter.js bodies
    let animationFrameId;
    const renderLoop = () => {
      wordElements.forEach((el, index) => {
        if (!el) return;
        const body = wordBodies[index];
        if (!body) return;

        const initialX = parseFloat(el.dataset.initialX);
        const initialY = parseFloat(el.dataset.initialY);

        const dx = body.position.x - initialX;
        const dy = body.position.y - initialY;
        const angle = body.angle;

        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}rad)`;
      });
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // GSAP ScrollTrigger
    let hasDropped = false;
    const dropWords = () => {
      if (hasDropped) return;
      hasDropped = true;
      engine.gravity.y = 1;

      wordBodies.forEach((body, i) => {
        if (body.resetTween) {
          body.resetTween.kill();
        }
        setTimeout(() => {
          if (hasDropped) {
            Matter.Body.setStatic(body, false);
            Matter.Sleeping.set(body, false);
          }
        }, i * 30); // stagger fall
      });
    };

    const resetWords = () => {
      hasDropped = false;
      engine.gravity.y = 0;
      wordBodies.forEach((body, i) => {
        Matter.Body.setStatic(body, true);
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);

        const el = wordElements[i];
        if (el) {
          const initialX = parseFloat(el.dataset.initialX);
          const initialY = parseFloat(el.dataset.initialY);
          
          if (body.resetTween) body.resetTween.kill();
          
          const proxy = { x: body.position.x, y: body.position.y, angle: body.angle };
          
          body.resetTween = gsap.to(proxy, {
            x: initialX,
            y: initialY,
            angle: 0,
            duration: 1,
            ease: "power3.out",
            onUpdate: () => {
              Matter.Body.setPosition(body, { x: proxy.x, y: proxy.y });
              Matter.Body.setAngle(body, proxy.angle);
            }
          });
        }
      });
    };

    const stDelay = setTimeout(() => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top 5%',
        onEnter: dropWords,
        onLeaveBack: resetWords,
        onLeave: resetWords,
        onEnterBack: dropWords,
      });
      triggerRef.current = trigger;
    }, 600);

    // Run physics
    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    // Handle resize (simplified, resets everything)
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 25 });
      Matter.Body.setVertices(ground, Matter.Vertices.fromPath(`0 0 ${newWidth} 0 ${newWidth} 50 0 50`));
      Matter.Body.setPosition(rightWall, { x: newWidth + 25, y: newHeight / 2 });
      Matter.Body.setVertices(rightWall, Matter.Vertices.fromPath(`0 0 50 0 50 ${newHeight} 0 ${newHeight}`));
      
      // Recalculate initial positions
      resetWords();
      const newContainerRect = container.getBoundingClientRect();
      wordElements.forEach((el, index) => {
        if (!el) return;
        el.style.transform = 'none'; // Temporarily clear transform to get correct client rect
        const rect = el.getBoundingClientRect();
        const x = rect.left - newContainerRect.left + rect.width / 2;
        const y = rect.top - newContainerRect.top + rect.height / 2;
        el.dataset.initialX = x;
        el.dataset.initialY = y;
        const body = wordBodies[index];
        if (body) {
          Matter.Body.setPosition(body, { x, y });
        }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(stDelay);
      if (triggerRef.current) triggerRef.current.kill();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full relative flex-1 border-b flex flex-col items-center justify-center py-12 md:py-24 text-center overflow-hidden">
      {/* Background container for full hit area of mouse constraint */}
      <div className="absolute inset-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-y-8 md:gap-y-12 w-full h-full max-w-4xl px-4 pointer-events-none">
        
        <h2 className="leading-none flex flex-wrap justify-center gap-x-2 gap-y-2 select-none pointer-events-auto">
          {words.map((word, i) => (
            <span 
              key={i} 
              ref={el => wordsRef.current[i] = el}
              className="inline-block cursor-grab active:cursor-grabbing"
              style={{ willChange: 'transform' }}
            >
              {word}
            </span>
          ))}
        </h2>

        <div className="pointer-events-auto mt-4">
          <CustomButton href="/contact">
            Begin
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default PhysicsTextCta;
