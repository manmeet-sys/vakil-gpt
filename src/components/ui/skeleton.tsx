
import { cn } from "@/lib/utils"
import React, { useEffect, useState } from 'react';

function Skeleton({
  className,
  fadeDuration = 1000,
  waveSpeed = 1.8,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  fadeDuration?: number;
  waveSpeed?: number;
}) {
  // Add progressive fade-in to reduce perceived loading time
  const [opacity, setOpacity] = useState(0.7);
  
  useEffect(() => {
    // Start more transparent and become more opaque
    // This gives a sense of progress/activity
    setOpacity(0.9);
    
    return () => {
      setOpacity(0.7);
    };
  }, []);

  // Create a style object with the wave animation
  const waveStyle = {
    position: 'relative',
    overflow: 'hidden',
    '--wave-speed': `${waveSpeed}s`,
    opacity: opacity,
  } as React.CSSProperties;

  // Add a pseudo-element for the wave effect
  const beforeStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    animation: `wave var(--wave-speed) ease-in-out infinite`,
  } as React.CSSProperties;

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/70", className)}
      style={waveStyle}
      {...props}
    >
      <style>
        {`
          @keyframes wave {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
      <div style={beforeStyle}></div>
    </div>
  )
}

export { Skeleton }
