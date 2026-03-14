import { useEffect, useRef } from 'react';

type Shape = 'circle' | 'rect' | 'square';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: Shape;
  opacity: number;
  phase: number;
  color: string;
}

interface Bond {
  a: number;
  b: number;
  life: number;
}

const COLORS: { color: string; weight: number; opacityMin: number; opacityMax: number }[] = [
  { color: '#8B5CF6', weight: 0.20, opacityMin: 0.15, opacityMax: 0.35 },
  { color: '#FF7074', weight: 0.40, opacityMin: 0.15, opacityMax: 0.35 },
  { color: '#42B4E6', weight: 0.60, opacityMin: 0.15, opacityMax: 0.35 },
  { color: '#5BBD5B', weight: 0.80, opacityMin: 0.15, opacityMax: 0.35 },
  { color: '#F5C542', weight: 1.00, opacityMin: 0.15, opacityMax: 0.35 },
];

function pickColor(): { color: string; opacity: number } {
  const r = Math.random();
  for (const c of COLORS) {
    if (r < c.weight) {
      return { color: c.color, opacity: c.opacityMin + Math.random() * (c.opacityMax - c.opacityMin) };
    }
  }
  const last = COLORS[COLORS.length - 1];
  return { color: last.color, opacity: last.opacityMin + Math.random() * (last.opacityMax - last.opacityMin) };
}

const SHAPES: Shape[] = ['circle', 'rect', 'square'];

// --- Tuning ---
const SPAWN_DESKTOP = 80;
const SPAWN_MOBILE = 35;
const INTERACT_DIST = 50;       // distance for collision check
const BOND_BREAK_DIST = 80;     // bond snaps beyond this
const BOND_MAX_LIFE = 300;
const SPRING_K = 0.0003;
const BOND_LINE_ALPHA = 0.12;
const MAX_BONDS = 200;          // hard cap — skip new bonds beyond this
const MAX_SIZE = 24;            // merge size cap
const BOND_COOLDOWN = 120;      // ~2s no bonds at start
// Collision outcomes (must sum to 1.0)
const CHANCE_BOND = 0.45;
const CHANCE_MERGE = 0.15;
// remaining = bounce (0.40)

function createParticle(w: number, h: number, x?: number, y?: number): Particle {
  const { color, opacity } = pickColor();
  return {
    x: x ?? Math.random() * w,
    y: y ?? Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6 + 0.05,
    vy: (Math.random() - 0.5) * 0.4,
    size: 3 + Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: 0.002 + Math.random() * 0.008,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    opacity,
    phase: Math.random() * Math.PI * 2,
    color,
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;

  if (p.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.shape === 'rect') {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else {
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
  }

  ctx.restore();
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId: number;
    let particles: Particle[] = [];
    let bonds: Bond[] = [];
    let targetCount = SPAWN_DESKTOP;
    let cW = 0;
    let cH = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      cW = parent.clientWidth;
      cH = parent.clientHeight;
      canvas!.width = cW * dpr;
      canvas!.height = cH * dpr;
      canvas!.style.width = `${cW}px`;
      canvas!.style.height = `${cH}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      targetCount = cW < 640 ? SPAWN_MOBILE : SPAWN_DESKTOP;
      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, () => createParticle(cW, cH));
      }
    }

    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); };
    window.addEventListener('resize', onResize);

    // --- Spatial grid for efficient neighbor lookup ---
    const CELL = INTERACT_DIST;
    function getNeighborPairs(): [number, number, number][] {
      const cols = Math.ceil(cW / CELL) + 1;
      const grid = new Map<number, number[]>();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.floor(p.x / CELL);
        const cy = Math.floor(p.y / CELL);
        const key = cy * cols + cx;
        let list = grid.get(key);
        if (!list) { list = []; grid.set(key, list); }
        list.push(i);
      }

      const pairs: [number, number, number][] = []; // [i, j, distSq]
      const offsets = [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 1]];

      for (const [key, cell] of grid) {
        const cx = key % cols;
        const cy = (key - cx) / cols;

        for (const [ox, oy] of offsets) {
          const nk = (cy + oy) * cols + (cx + ox);
          const neighbor = ox === 0 && oy === 0 ? cell : grid.get(nk);
          if (!neighbor) continue;

          const isSelf = ox === 0 && oy === 0;
          for (let ai = 0; ai < cell.length; ai++) {
            const startJ = isSelf ? ai + 1 : 0;
            for (let bi = startJ; bi < neighbor.length; bi++) {
              const idxA = cell[ai];
              const idxB = neighbor[bi];
              const pa = particles[idxA];
              const pb = particles[idxB];
              const dx = pa.x - pb.x;
              const dy = pa.y - pb.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < INTERACT_DIST * INTERACT_DIST) {
                pairs.push([idxA, idxB, d2]);
              }
            }
          }
        }
      }
      return pairs;
    }

    // Bond lookup
    function bondKey(i: number, j: number) { return i < j ? `${i}:${j}` : `${j}:${i}`; }
    const bondSet = new Set<string>();
    // Track per-particle bond count for capping
    const bondCount = new Map<number, number>();

    let time = 0;
    let spawnAccum = 0;

    function animate() {
      ctx!.clearRect(0, 0, cW, cH);
      time++;

      // --- Move ---
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy + Math.sin(time * 0.001 + p.phase) * 0.15;
        p.rotation += p.rotationSpeed;
        if (p.x > cW + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = cW + p.size;
        if (p.y > cH + p.size) p.y = -p.size;
        if (p.y < -p.size) p.y = cH + p.size;
      }

      // --- Neighbor interactions (bond / merge / bounce) ---
      const canInteract = time > BOND_COOLDOWN;

      if (canInteract) {
        const pairs = getNeighborPairs();
        const mergeRemove = new Set<number>();

        for (const [i, j, d2] of pairs) {
          if (mergeRemove.has(i) || mergeRemove.has(j)) continue;

          const key = bondKey(i, j);
          if (bondSet.has(key)) continue; // already bonded

          const pa = particles[i];
          const pb = particles[j];
          const touching = d2 < ((pa.size + pb.size) / 2) ** 2;
          if (!touching) continue; // interactions only on collision

          const roll = Math.random();

          if (roll < CHANCE_BOND) {
            // --- Bond ---
            if (bonds.length < MAX_BONDS && (bondCount.get(i) ?? 0) < 4 && (bondCount.get(j) ?? 0) < 4) {
              bonds.push({ a: i, b: j, life: BOND_MAX_LIFE });
              bondSet.add(key);
              bondCount.set(i, (bondCount.get(i) ?? 0) + 1);
              bondCount.set(j, (bondCount.get(j) ?? 0) + 1);
            }
          } else if (roll < CHANCE_BOND + CHANCE_MERGE) {
            // --- Merge: smaller absorbed into larger ---
            const [big, small, removeIdx] = pa.size >= pb.size ? [pa, pb, j] : [pb, pa, i];
            const totalMass = big.size * big.size + small.size * small.size;
            big.vx = (big.vx * big.size * big.size + small.vx * small.size * small.size) / totalMass;
            big.vy = (big.vy * big.size * big.size + small.vy * small.size * small.size) / totalMass;
            big.size = Math.min(Math.sqrt(totalMass), MAX_SIZE);
            mergeRemove.add(removeIdx);
          } else if (touching) {
            // --- Bounce: elastic reflection ---
            const d = Math.sqrt(d2) || 1;
            const nx = (pb.x - pa.x) / d;
            const ny = (pb.y - pa.y) / d;
            const relVx = pa.vx - pb.vx;
            const relVy = pa.vy - pb.vy;
            const dot = relVx * nx + relVy * ny;
            if (dot > 0) {
              pa.vx -= dot * nx;
              pa.vy -= dot * ny;
              pb.vx += dot * nx;
              pb.vy += dot * ny;
              // Separate overlap
              const overlap = (pa.size + pb.size) / 2 - d;
              if (overlap > 0) {
                pa.x -= nx * overlap * 0.5;
                pa.y -= ny * overlap * 0.5;
                pb.x += nx * overlap * 0.5;
                pb.y += ny * overlap * 0.5;
              }
            }
          }
        }

        // Remove merged particles (reverse order)
        if (mergeRemove.size > 0) {
          // Clean up bonds referencing removed particles
          const removed = Array.from(mergeRemove).sort((a, b) => b - a);
          for (const idx of removed) {
            // Remove bonds touching this particle
            for (let bi = bonds.length - 1; bi >= 0; bi--) {
              const b = bonds[bi];
              if (b.a === idx || b.b === idx) {
                bondSet.delete(bondKey(b.a, b.b));
                bondCount.set(b.a, (bondCount.get(b.a) ?? 1) - 1);
                bondCount.set(b.b, (bondCount.get(b.b) ?? 1) - 1);
                bonds.splice(bi, 1);
              }
            }
            particles.splice(idx, 1);
            // Reindex bonds: shift indices above removed
            for (const b of bonds) {
              if (b.a > idx) b.a--;
              if (b.b > idx) b.b--;
            }
            // Rebuild bondSet after reindex
            bondSet.clear();
            bondCount.clear();
            for (const b of bonds) {
              bondSet.add(bondKey(b.a, b.b));
              bondCount.set(b.a, (bondCount.get(b.a) ?? 0) + 1);
              bondCount.set(b.b, (bondCount.get(b.b) ?? 0) + 1);
            }
          }
        }
      }

      // --- Spring forces on bonds & draw bond lines ---
      const bondRemove: number[] = [];
      for (let bi = 0; bi < bonds.length; bi++) {
        const bond = bonds[bi];
        const pa = particles[bond.a];
        const pb = particles[bond.b];
        if (!pa || !pb) { bondRemove.push(bi); continue; }

        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        bond.life--;

        if (d > BOND_BREAK_DIST || bond.life <= 0) {
          bondRemove.push(bi);
          continue;
        }

        // Spring
        const force = (d - INTERACT_DIST * 0.5) * SPRING_K;
        const fx = (dx / d) * force;
        const fy = (dy / d) * force;
        pa.vx += fx; pa.vy += fy;
        pb.vx -= fx; pb.vy -= fy;

        // Draw line
        const alpha = BOND_LINE_ALPHA * (bond.life / BOND_MAX_LIFE) * (1 - d / BOND_BREAK_DIST);
        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.strokeStyle = pa.color;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.stroke();
        ctx!.restore();
      }

      // Remove expired bonds
      for (let i = bondRemove.length - 1; i >= 0; i--) {
        const bi = bondRemove[i];
        const b = bonds[bi];
        if (b) {
          bondSet.delete(bondKey(b.a, b.b));
          bondCount.set(b.a, (bondCount.get(b.a) ?? 1) - 1);
          bondCount.set(b.b, (bondCount.get(b.b) ?? 1) - 1);
        }
        bonds.splice(bi, 1);
      }

      // --- Damping ---
      for (const p of particles) {
        p.vx *= 0.999;
        p.vy *= 0.999;
      }

      // --- Slowly shrink large particles back ---
      for (const p of particles) {
        if (p.size > 8) p.size *= 0.9998;
      }

      // --- Respawn to maintain count ---
      if (particles.length < targetCount) {
        spawnAccum += 0.5;
        while (spawnAccum >= 1 && particles.length < targetCount) {
          const edge = Math.floor(Math.random() * 4);
          let sx: number, sy: number;
          if (edge === 0) { sx = -4; sy = Math.random() * cH; }
          else if (edge === 1) { sx = cW + 4; sy = Math.random() * cH; }
          else if (edge === 2) { sx = Math.random() * cW; sy = -4; }
          else { sx = Math.random() * cW; sy = cH + 4; }
          particles.push(createParticle(cW, cH, sx, sy));
          spawnAccum--;
        }
      }

      // --- Draw particles ---
      for (const p of particles) {
        drawParticle(ctx!, p);
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
