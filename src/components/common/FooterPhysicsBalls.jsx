"use client";
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FooterPhysicsBalls = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const { Engine, Runner, World, Bodies, Mouse, MouseConstraint, Composite } = Matter;

    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const container = canvas.parentElement;
    let width = container.clientWidth;
    let height = container.clientHeight;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Enable sleeping to stop continuous shaking when settled
    engine.enableSleeping = true;

    // Start with gravity OFF — balls won't move until section is in view
    engine.gravity.y = 0;

    // Add boundaries
    const wallOptions = { isStatic: true, friction: 0 };
    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);

    // Create obstacle bodies for the text and button
    // Find text elements and button in parent container
    const parentContainer = container.parentElement;
    const textElements = parentContainer ? parentContainer.querySelectorAll('p, h2, button') : [];
    const obstacles = [];
    const obstacleBodiesMap = new Map();

    const updateObstacles = () => {
      // Remove old obstacles from world
      obstacleBodiesMap.forEach((body) => {
        Composite.remove(engine.world, body);
      });
      obstacleBodiesMap.clear();

      const containerRect = container.getBoundingClientRect();

      textElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        // Calculate relative coordinates to container
        const relX = rect.left - containerRect.left + rect.width / 2;
        const relY = rect.top - containerRect.top + rect.height / 2;

        if (rect.width > 0 && rect.height > 0) {
          // Create static body for this text/button
          // We add a small padding so balls bounce cleanly on edges
          const body = Bodies.rectangle(relX, relY, rect.width + 4, rect.height + 4, {
            isStatic: true,
            friction: 0.1,
            restitution: 0.6, // bounce strength
            label: `obstacle-${index}`
          });
          obstacleBodiesMap.set(index, body);
          Composite.add(engine.world, body);
        }
      });
    };

    Composite.add(engine.world, [ground, leftWall, rightWall]);
    updateObstacles();

    // Create balls positioned ABOVE the canvas (off-screen top)
    const balls = [];
    const physicsRadius = 10;
    const renderRadius = 6;
    const numBalls = 1000;

    for (let i = 0; i < numBalls; i++) {
      const x = Math.random() * width;
      // All balls start at the same height just above the canvas
      const y = -50;
      
      const ball = Bodies.circle(x, y, physicsRadius, {
        restitution: 0.5,
        friction: 0.005,
        density: 0.04,
        sleepThreshold: 15,
      });
      // Make them static initially so they don't drift
      Matter.Body.setStatic(ball, true);
      balls.push(ball);
    }
    
    Composite.add(engine.world, balls);

    // ── GSAP ScrollTrigger: trigger drop when section enters viewport ──
    let hasDropped = false;

    const dropBalls = () => {
      if (hasDropped) return;
      hasDropped = true;

      // Turn on gravity
      engine.gravity.y = 1;

      // Release all balls with 0.05ms stagger each
      balls.forEach((ball, i) => {
        setTimeout(() => {
          // Double check if we haven't reset in the meantime
          if (hasDropped) {
            Matter.Body.setStatic(ball, false);
            Matter.Sleeping.set(ball, false);
          }
        }, i * 0.05);
      });
    };

    const resetBalls = () => {
      hasDropped = false;
      engine.gravity.y = 0;
      balls.forEach((ball) => {
        Matter.Body.setStatic(ball, true);
        const randomX = Math.random() * width;
        Matter.Body.setPosition(ball, { x: randomX, y: -50 });
        Matter.Body.setVelocity(ball, { x: 0, y: 0 });
      });
    };

    // Delay to let Lenis initialize, then check visibility
    const stDelay = setTimeout(() => {
      // Create ScrollTrigger to wait for scroll
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top center',
        onEnter: dropBalls,
        onLeaveBack: resetBalls,
        onLeave: resetBalls,
        onEnterBack: dropBalls,
        onRefresh: (self) => {
          if (self.isActive) {
            dropBalls();
          } else {
            resetBalls();
          }
        }
      });
      triggerRef.current = trigger;

      // Also do a manual immediate check in case it's already in viewport
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        dropBalls();
      }
    }, 600);

    // Mouse move interaction
    let lastMouseX = null;
    let lastMouseY = null;
    let lastMouseTime = null;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const currentTime = performance.now();

      let mouseVelocity = 0.1;
      if (lastMouseX !== null && lastMouseTime !== null) {
        const dt = currentTime - lastMouseTime;
        if (dt > 0) {
          const dx = mouseX - lastMouseX;
          const dy = mouseY - lastMouseY;
          mouseVelocity = Math.sqrt(dx * dx + dy * dy) / dt;
        }
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
      lastMouseTime = currentTime;
      
      const speedMultiplier = Math.min(Math.max(mouseVelocity * 3, 1), 5);
      const interactionRadius = 40 + (speedMultiplier * 10); 
      
      balls.forEach(ball => {
        const dx = ball.position.x - mouseX;
        const dy = ball.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < interactionRadius) {
          Matter.Sleeping.set(ball, false);
          
          const baseForce = 0.0015;
          const forceMagnitude = (interactionRadius - distance) * baseForce * speedMultiplier;
          
          Matter.Body.applyForce(ball, ball.position, {
            x: (dx / distance) * forceMagnitude,
            y: (dy / distance) * forceMagnitude
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Run physics
    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    // Custom Render Loop
    let animationFrameId;
    const renderLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw balls (only if within or near the canvas bounds for performance)
      ctx.fillStyle = '#A87462';
      balls.forEach(ball => {
        if (ball.position.y > -renderRadius * 2) {
          ctx.beginPath();
          ctx.arc(ball.position.x, ball.position.y, renderRadius, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Handle resize
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      
      Matter.Body.setPosition(ground, { x: width / 2, y: height + 25 });
      Matter.Body.setVertices(ground, Matter.Vertices.fromPath(`0 0 ${width} 0 ${width} 50 0 50`));
      
      Matter.Body.setPosition(rightWall, { x: width + 25, y: height / 2 });
      Matter.Body.setVertices(rightWall, Matter.Vertices.fromPath(`0 0 50 0 50 ${height} 0 ${height}`));

      updateObstacles();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(stDelay);
      if (triggerRef.current) triggerRef.current.kill();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 opacity-100 pointer-events-auto overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default FooterPhysicsBalls;
