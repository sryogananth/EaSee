import React, { useRef, useState, useEffect } from 'react';
import { ConfusionPair } from '../../types';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { Volume2, RotateCcw, CheckCircle2, Wand2 } from 'lucide-react';

interface TraceCanvasGameProps {
  pair: ConfusionPair;
  targetChar: string;
  onComplete: () => void;
}

interface Checkpoint {
  id: number;
  x: number;
  y: number;
  hit: boolean;
}

const STROKE_POINTS: Record<string, { points: { x: number; y: number }[]; hint: string }> = {
  b: {
    points: [
      { x: 35, y: 15 },
      { x: 35, y: 50 },
      { x: 35, y: 85 },
      { x: 65, y: 55 },
      { x: 38, y: 80 },
    ],
    hint: 'Bat straight DOWN ⬇️, then swing round to the RIGHT for the Belly ➡️!',
  },
  d: {
    points: [
      { x: 65, y: 50 },
      { x: 35, y: 65 },
      { x: 65, y: 85 },
      { x: 65, y: 15 },
      { x: 65, y: 85 },
    ],
    hint: 'Drum curve LEFT ⬅️ first, then tall stick straight DOWN ⬇️!',
  },
  '5': {
    points: [
      { x: 70, y: 20 },
      { x: 35, y: 20 },
      { x: 35, y: 45 },
      { x: 70, y: 60 },
      { x: 35, y: 85 },
    ],
    hint: 'Flat roof across, neck down, then big round tummy!',
  },
  S: {
    points: [
      { x: 65, y: 22 },
      { x: 35, y: 35 },
      { x: 50, y: 52 },
      { x: 65, y: 70 },
      { x: 35, y: 82 },
    ],
    hint: 'Slither like a snake! Smooth curves all the way!',
  },
  p: {
    points: [
      { x: 35, y: 35 },
      { x: 35, y: 95 },
      { x: 65, y: 48 },
      { x: 38, y: 62 },
    ],
    hint: 'Drop down into the basement ⬇️, then round head looking RIGHT ➡️!',
  },
  q: {
    points: [
      { x: 65, y: 45 },
      { x: 35, y: 55 },
      { x: 65, y: 62 },
      { x: 65, y: 95 },
      { x: 75, y: 85 },
    ],
    hint: 'Round queen face LEFT ⬅️, tail straight down with a curl!',
  },
  '2': {
    points: [
      { x: 35, y: 32 },
      { x: 65, y: 22 },
      { x: 35, y: 80 },
      { x: 68, y: 80 },
    ],
    hint: 'Swan neck curve 🦢, slide down slope, flat base across!',
  },
  Z: {
    points: [
      { x: 35, y: 25 },
      { x: 68, y: 25 },
      { x: 35, y: 80 },
      { x: 68, y: 80 },
    ],
    hint: 'Zip across, Zap sharp diagonal, Zoom across bottom!',
  },
  m: {
    points: [
      { x: 25, y: 80 },
      { x: 25, y: 40 },
      { x: 45, y: 40 },
      { x: 45, y: 80 },
      { x: 75, y: 40 },
      { x: 75, y: 80 },
    ],
    hint: 'Two mountain peaks reaching UP to the sunshine!',
  },
  w: {
    points: [
      { x: 25, y: 35 },
      { x: 38, y: 85 },
      { x: 50, y: 45 },
      { x: 62, y: 85 },
      { x: 75, y: 35 },
    ],
    hint: 'Ocean waves splashing DOWN into the cool blue sea!',
  },
  u: {
    points: [
      { x: 35, y: 30 },
      { x: 35, y: 75 },
      { x: 50, y: 85 },
      { x: 65, y: 75 },
      { x: 65, y: 30 },
    ],
    hint: 'Open cup catching fresh rain! Do not let it spill!',
  },
  n: {
    points: [
      { x: 35, y: 80 },
      { x: 35, y: 40 },
      { x: 50, y: 30 },
      { x: 65, y: 40 },
      { x: 65, y: 80 },
    ],
    hint: 'Arch tunnel! Walk through the safe shady cave!',
  },
};

export const TraceCanvasGame: React.FC<TraceCanvasGameProps> = ({
  pair,
  targetChar,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [activeCheckIndex, setActiveCheckIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [chalkColor, setChalkColor] = useState('#f59e0b');
  const [canvasDim, setCanvasDim] = useState({ width: 500, height: 350 });

  const strokeData = STROKE_POINTS[targetChar] || {
    points: [
      { x: 35, y: 25 },
      { x: 35, y: 80 },
      { x: 65, y: 55 },
    ],
    hint: `Trace ${targetChar} carefully from top to bottom!`,
  };

  const isA = targetChar === pair.charA;
  const mnemonic = isA ? pair.mnemonicA : pair.mnemonicB;
  const animal = isA ? pair.animalA : pair.animalB;

  // Responsive Canvas Size handling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasDim({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize checkpoints
  useEffect(() => {
    const cps: Checkpoint[] = strokeData.points.map((pt, i) => ({
      id: i,
      x: pt.x,
      y: pt.y,
      hit: false,
    }));
    setCheckpoints(cps);
    setActiveCheckIndex(0);
    setIsComplete(false);
    clearCanvas();
    sound.speak(`${animal.name} says: ${strokeData.hint}`, true);
  }, [targetChar]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const checkCollision = (cx: number, cy: number) => {
    if (activeCheckIndex >= checkpoints.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetPoint = checkpoints[activeCheckIndex];
    const targetPxX = (targetPoint.x / 100) * canvas.width;
    const targetPxY = (targetPoint.y / 100) * canvas.height;

    const dist = Math.hypot(cx - targetPxX, cy - targetPxY);
    if (dist < 45) {
      sound.playPop(440 + activeCheckIndex * 80);
      setCheckpoints((prev) =>
        prev.map((c, i) => (i === activeCheckIndex ? { ...c, hit: true } : c))
      );

      const nextIdx = activeCheckIndex + 1;
      setActiveCheckIndex(nextIdx);

      if (nextIdx >= checkpoints.length) {
        setIsComplete(true);
        sound.playFanfare();
        fireStarBurst();
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);

    checkCollision(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = chalkColor;
    ctx.shadowBlur = 8;
    ctx.shadowColor = chalkColor;

    ctx.lineTo(x, y);
    ctx.stroke();

    checkCollision(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div className="relative w-full rounded-3xl glass-card p-3 sm:p-5 md:p-6 shadow-sm border border-white/90">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="text-2xl sm:text-3xl">{animal.emoji}</div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                Trace <span className="text-amber-600 font-dyslexic text-xl sm:text-2xl font-black">{targetChar}</span>
              </h4>
              <button
                onClick={() => sound.speak(strokeData.hint, true)}
                className="p-1 hover:bg-amber-100/80 rounded-full text-amber-700 transition-colors"
                title="Speak hint"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 hidden sm:block">
              {strokeData.hint}
            </p>
          </div>
        </div>

        {/* Chalk Palette & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center glass-pill p-1 rounded-2xl gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setChalkColor(c)}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform ${
                  chalkColor === c ? 'scale-125 ring-2 ring-amber-400' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              clearCanvas();
              setCheckpoints(strokeData.points.map((pt, i) => ({ id: i, x: pt.x, y: pt.y, hit: false })));
              setActiveCheckIndex(0);
              setIsComplete(false);
              sound.playPop(380);
            }}
            className="p-2 glass-pill text-slate-600 hover:text-slate-800 shadow-xs"
            title="Reset Tracing"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tracing Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[360px] md:h-[400px] bg-white/70 backdrop-blur-md rounded-3xl border-2 border-dashed border-amber-300 overflow-hidden shadow-inner flex items-center justify-center touch-none"
      >
        {/* Faint Background Guide Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[160px] sm:text-[220px] font-black text-amber-100/80 font-dyslexic opacity-80">
            {targetChar}
          </span>
        </div>

        {/* Checkpoint Rings */}
        {checkpoints.map((cp, idx) => {
          const isNext = idx === activeCheckIndex;
          return (
            <div
              key={cp.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-none ${
                cp.hit
                  ? 'w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 text-white font-bold scale-110 shadow-md'
                  : isNext
                  ? 'w-10 h-10 sm:w-12 sm:h-12 bg-amber-400 text-amber-950 font-black shadow-lg ring-4 ring-amber-200'
                  : 'w-7 h-7 sm:w-8 sm:h-8 bg-slate-200 text-slate-500 font-bold opacity-70'
              }`}
              style={{
                left: `${cp.x}%`,
                top: `${cp.y}%`,
              }}
            >
              {cp.hit ? '✓' : idx + 1}
            </div>
          );
        })}

        {/* Responsive Canvas Element */}
        <canvas
          ref={canvasRef}
          width={canvasDim.width}
          height={canvasDim.height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Success Overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center pointer-events-none animate-fade-in">
            <div className="glass-card bg-white/95 p-5 border border-emerald-400 shadow-2xl text-center animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-1.5" />
              <h3 className="text-xl font-black text-slate-800">Perfect Stroke!</h3>
              <p className="text-xs text-slate-600 font-medium">
                You traced {targetChar} with perfect direction!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mnemonic Hint footer */}
      <div className="mt-3 glass-card-amber p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-amber-950">
        <span className="flex items-center gap-1.5 truncate">
          <Wand2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">{mnemonic}</span>
        </span>
        <span className="hidden sm:inline bg-amber-200/90 px-2 py-0.5 rounded-lg text-amber-900 text-[10px] shrink-0">
          Touch 1 ➡️ 2 ➡️ 3
        </span>
      </div>
    </div>
  );
};
