import { useEffect, useRef } from 'react';

export default function Bg3d() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const STAR_COUNT = 190;
    const CONNECT_DIST = 120;
    const PERSPECTIVE = 800;
    const DRIFT_SPEED = 0.12;
    const STARS: { x: number; y: number; z: number; vx: number; vy: number; vz: number; phase: number }[] = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      STARS.push({
        x: (Math.random() - 0.5) * w * 1.5,
        y: (Math.random() - 0.5) * h * 1.5,
        z: Math.random() * PERSPECTIVE + 50,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED * 0.6,
        vz: (Math.random() - 0.5) * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isActive = true;

    const onResize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    const onMouseMove = (e: MouseEvent) => { mouseX = (e.clientX - w / 2) * 0.3; mouseY = (e.clientY - h / 2) * 0.3; };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      if (!isActive) return;
      frame++;
      ctx.clearRect(0, 0, w, h);

      const sorted = [...STARS].sort((a, b) => b.z - a.z);
      const projected = sorted.map((s) => {
        const scale = PERSPECTIVE / (PERSPECTIVE + s.z);
        return { sx: w / 2 + s.x * scale + mouseX * scale * 0.06, sy: h / 2 + s.y * scale + mouseY * scale * 0.06, sz: s.z, scale, phase: s.phase };
      });

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].sx - projected[j].sx;
          const dy = projected[i].sy - projected[j].sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.06 * projected[i].scale;
            ctx.strokeStyle = `rgba(212,168,83,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < sorted.length; i++) {
        const s = sorted[i];
        const p = projected[i];
        const twinkle = Math.sin(frame * 0.02 + p.phase) * 0.5 + 0.5;
        const size = (1.2 * p.scale + twinkle * 0.8) * (s.z < PERSPECTIVE * 0.3 ? 1.4 : 1);
        const alpha = (0.5 + twinkle * 0.5) * Math.min(p.scale * 1.2, 1);
        ctx.fillStyle = `rgba(212,168,83,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
        if (s.z < PERSPECTIVE * 0.25) {
          const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, size * 4);
          glow.addColorStop(0, `rgba(212,168,83,${alpha * 0.15})`);
          glow.addColorStop(1, 'rgba(212,168,83,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const s of STARS) {
        s.x += s.vx; s.y += s.vy; s.z += s.vz; s.phase += 0.008;
        if (s.z < 20) { s.z = 20; s.vz *= -1; }
        if (s.z > PERSPECTIVE) { s.z = PERSPECTIVE; s.vz *= -1; }
        if (Math.abs(s.x) > w * 0.8) s.vx *= -1;
        if (Math.abs(s.y) > h * 0.8) s.vy *= -1;
      }
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => { isActive = false; window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMouseMove); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />;
}
