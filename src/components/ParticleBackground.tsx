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
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS: { color: string; weight: number }[] = [
  { color: '#E62D28', weight: 0.20 }, // red
  { color: '#2DA44E', weight: 0.40 }, // green
  { color: '#1E84E0', weight: 0.60 }, // blue
  { color: '#F5A516', weight: 0.80 }, // amber
  { color: '#A02BB8', weight: 1.00 }, // purple
];

const OPACITY_MIN = 0.18;
const OPACITY_MAX = 0.32;

function pickColor(): string {
  const r = Math.random();
  for (const c of COLORS) {
    if (r < c.weight) return c.color;
  }
  return COLORS[COLORS.length - 1].color;
}

const SHAPES: Shape[] = ['circle', 'rect', 'square'];

// --- Tuning ---
const SPAWN_DESKTOP = 80;
const SPAWN_MOBILE = 35;
const INTERACT_DIST = 50;       // distance for collision check
const TOUCH_BONUS = 6;          // pixels added to effective touch radius
const BOND_BREAK_DIST = 110;    // bond snaps beyond this (safety valve)
const SPRING_K = 0.0003;
const BOND_LINE_ALPHA = 0.22;
const MAX_BONDS = 200;          // hard cap — skip new bonds beyond this
const MAX_SIZE = 24;            // merge size cap
const BOND_COOLDOWN = 120;      // ~2s no bonds at start
const CLUSTER_STABLE_SIZE = 4;  // clusters up to this size never spontaneously split
const CLUSTER_BREAK_K = 0.0008; // per-bond break prob = (size - stable) * K each frame
const RIPPLE_MAX_RADIUS = 22;
const RIPPLE_LIFE = 36;
const RIPPLE_ALPHA = 0.45;
const MAX_RIPPLES = 40;
// Collision outcomes (must sum to 1.0)
const CHANCE_BOND = 0.45;
const CHANCE_MERGE = 0.15;
// remaining = bounce (0.40)

function createParticle(w: number, h: number, x?: number, y?: number): Particle {
  return {
    x: x ?? Math.random() * w,
    y: y ?? Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6 + 0.05,
    vy: (Math.random() - 0.5) * 0.4,
    size: 3 + Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: 0.002 + Math.random() * 0.008,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    opacity: OPACITY_MIN + Math.random() * (OPACITY_MAX - OPACITY_MIN),
    phase: Math.random() * Math.PI * 2,
    color: pickColor(),
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
    const ripples: Ripple[] = [];

    function spawnRipple(x: number, y: number, color: string, scale = 1) {
      if (ripples.length >= MAX_RIPPLES) return;
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: RIPPLE_MAX_RADIUS * scale,
        life: RIPPLE_LIFE,
        maxLife: RIPPLE_LIFE,
        color,
      });
    }
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
          const touchR = (pa.size + pb.size) / 2 + TOUCH_BONUS;
          const touching = d2 < touchR * touchR;
          if (!touching) continue; // interactions only on collision

          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          const roll = Math.random();

          if (roll < CHANCE_BOND) {
            // --- Bond ---
            if (bonds.length < MAX_BONDS && (bondCount.get(i) ?? 0) < 4 && (bondCount.get(j) ?? 0) < 4) {
              bonds.push({ a: i, b: j });
              bondSet.add(key);
              bondCount.set(i, (bondCount.get(i) ?? 0) + 1);
              bondCount.set(j, (bondCount.get(j) ?? 0) + 1);
              spawnRipple(mx, my, pa.color);
            }
          } else if (roll < CHANCE_BOND + CHANCE_MERGE) {
            // --- Merge: smaller absorbed into larger ---
            const [big, small, removeIdx] = pa.size >= pb.size ? [pa, pb, j] : [pb, pa, i];
            const totalMass = big.size * big.size + small.size * small.size;
            big.vx = (big.vx * big.size * big.size + small.vx * small.size * small.size) / totalMass;
            big.vy = (big.vy * big.size * big.size + small.vy * small.size * small.size) / totalMass;
            big.size = Math.min(Math.sqrt(totalMass), MAX_SIZE);
            mergeRemove.add(removeIdx);
            spawnRipple(mx, my, big.color, 1.6);
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

      // --- Compute cluster sizes (union-find) ---
      const ufParent = new Array(particles.length);
      for (let i = 0; i < particles.length; i++) ufParent[i] = i;
      const ufFind = (x: number) => {
        while (ufParent[x] !== x) {
          ufParent[x] = ufParent[ufParent[x]];
          x = ufParent[x];
        }
        return x;
      };
      for (const b of bonds) {
        if (!particles[b.a] || !particles[b.b]) continue;
        const ra = ufFind(b.a);
        const rb = ufFind(b.b);
        if (ra !== rb) ufParent[ra] = rb;
      }
      const rootSize = new Map<number, number>();
      for (let i = 0; i < particles.length; i++) {
        const r = ufFind(i);
        rootSize.set(r, (rootSize.get(r) ?? 0) + 1);
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

        // Distance safety valve
        if (d > BOND_BREAK_DIST) {
          bondRemove.push(bi);
          continue;
        }

        // Cluster-size based spontaneous break: bigger clusters fragment faster
        const size = rootSize.get(ufFind(bond.a)) ?? 1;
        if (size > CLUSTER_STABLE_SIZE) {
          const breakProb = (size - CLUSTER_STABLE_SIZE) * CLUSTER_BREAK_K;
          if (Math.random() < breakProb) {
            spawnRipple((pa.x + pb.x) / 2, (pa.y + pb.y) / 2, pa.color, 0.8);
            bondRemove.push(bi);
            continue;
          }
        }

        // Spring
        const force = (d - INTERACT_DIST * 0.5) * SPRING_K;
        const fx = (dx / d) * force;
        const fy = (dy / d) * force;
        pa.vx += fx; pa.vy += fy;
        pb.vx -= fx; pb.vy -= fy;

        // Draw line — fade only with stretch distance
        const alpha = BOND_LINE_ALPHA * (1 - d / BOND_BREAK_DIST);
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

      // --- Update + draw ripples ---
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const t = 1 - r.life / r.maxLife; // 0 → 1
        r.radius = 2 + (r.maxRadius - 2) * t;
        r.life--;
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        const alpha = RIPPLE_ALPHA * (1 - t) * (1 - t);
        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.strokeStyle = r.color;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.restore();
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
