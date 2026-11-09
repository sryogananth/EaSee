import confetti from 'canvas-confetti';

export function fireStarBurst() {
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f472b6', '#38bdf8', '#4ade80', '#c084fc'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });
  } catch {
    // Canvas confetti fallback
  }
}

export function fireGrandCelebration() {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#ec4899', '#0ea5e9', '#22c55e']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#ec4899', '#0ea5e9', '#22c55e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Fallback
  }
}
