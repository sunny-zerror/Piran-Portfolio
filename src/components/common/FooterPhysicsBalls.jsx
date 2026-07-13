"use client";
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const FooterPhysicsBalls = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);

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

    // Add boundaries
    const wallOptions = { isStatic: true, friction: 0 };
    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);
    
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Add balls
    const balls = [];
    const physicsRadius = 15; // The physical collision radius
    const renderRadius = 10; // The rendered radius (creates a gap!)
    const numBalls = 500;

    for (let i = 0; i < numBalls; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      const ball = Bodies.circle(x, y, physicsRadius, {
        restitution: 0.5, // Reduced bounciness to stop jittering
        friction: 0.005,
        density: 0.04,
        sleepThreshold: 15, // Let them sleep quicker
      });
      balls.push(ball);
    }
    
    Composite.add(engine.world, balls);

    // Mouse move interaction
    let lastMouseX = null;
    let lastMouseY = null;
    let lastMouseTime = null;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const currentTime = performance.now();

      let mouseVelocity = 0.1; // base small velocity
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
      
      // Calculate dynamic radius and force based on how fast the mouse is moving
      // mouseVelocity is usually around 0.5 to 5 for fast movements
      // Increase minimum multiplier so slow mouse movements still guarantee movement
      const speedMultiplier = Math.min(Math.max(mouseVelocity * 3, 1), 5);
      
      // If moving very slowly, smaller radius (e.g., 120), if fast, larger radius
      const interactionRadius = 100 + (speedMultiplier * 10); 
      
      balls.forEach(ball => {
        const dx = ball.position.x - mouseX;
        const dy = ball.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < interactionRadius) {
          // Wake up the ball if it was sleeping
          Matter.Sleeping.set(ball, false);
          
          // Apply a force away from the mouse, scaled by speed
          const baseForce = 0.0015; // Increased base force constant so slow movements definitely work
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

      // Draw balls
      ctx.fillStyle = '#A87462';
      balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, renderRadius, 0, 2 * Math.PI);
        ctx.fill();
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
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
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
