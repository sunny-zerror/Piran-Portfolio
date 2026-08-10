"use client";
import React, { useState, useEffect } from 'react';

export const LiveTime = ({ className }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const istTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      });
      setTime(`${istTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={className}>
      Bombay · {time}
    </span>
  );
};
