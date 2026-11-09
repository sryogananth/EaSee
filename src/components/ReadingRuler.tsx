import React, { useEffect, useState } from 'react';

interface ReadingRulerProps {
  enabled: boolean;
  color?: string;
}

export const ReadingRuler: React.FC<ReadingRulerProps> = ({ enabled, color = '#fef08a' }) => {
  const [mouseY, setMouseY] = useState(250);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setMouseY(e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed left-0 right-0 pointer-events-none z-40 transition-transform duration-75 ease-out flex items-center justify-between px-6"
      style={{
        top: `${mouseY - 45}px`,
        height: '90px',
        backgroundColor: `${color}38`, // 22% opacity tint
        borderTop: `3px dashed ${color}`,
        borderBottom: `3px dashed ${color}`,
        boxShadow: '0 0 20px rgba(0,0,0,0.06)',
      }}
    >
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 opacity-60">
        👀 Reading Guide
      </span>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 opacity-60">
        Keep Looking Here ➡️
      </span>
    </div>
  );
};
