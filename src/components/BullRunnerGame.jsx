/* ─── Dev Run — infinite side-scroller ─────────────────────
   Space / ↑ / W  = jump (double jump available)
   S / ↓          = duck (hold) / fast-fall in air
   Click / tap    = jump on mobile
   ─────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from "react";

/* ── Canvas layout ─────────────────────────────────────────── */
const CW = 960;
const CH = 260;
const GY = 200;           // ground Y — player feet
const PX = 130;           // player fixed X
const GRAV      = 0.62;
const JUMP_VY   = -14.2;
const FAST_FALL = 4.5;    // extra vy applied when ducking in air
const MAX_SPEED = 20;

/* ── Obstacle definitions ──────────────────────────────────── */
// Ground obstacles: player jumps over (h = height above ground)
// Beam obstacle: player ducks under (clearance = gap from ground to bar bottom)
const OBS_DEFS = [
  { type: "bug",    w: 38, h: 50,  body: "#7f1d1d", accent: "#f87171" },
  { type: "server", w: 48, h: 84,  body: "#1e3a5f", accent: "#60a5fa" },
  { type: "spike",  w: 26, h: 100, body: "#4c1d95", accent: "#a78bfa" },
  { type: "beam",   w: 92, h: 0,   body: "#065f46", accent: "#34d399",
    clearance: 28, barH: 14 },
];
const GROUND_OBS = OBS_DEFS.filter(d => d.type !== "beam");
const MILESTONES = [50, 100, 250, 500, 1000];

/* ── Background ─────────────────────────────────────────────── */
const CITY = [
  { x: 60,  w: 55,  h: 58  }, { x: 140, w: 38,  h: 88  },
  { x: 200, w: 75,  h: 48  }, { x: 300, w: 28,  h: 78  },
  { x: 345, w: 95,  h: 38  }, { x: 468, w: 48,  h: 96  },
  { x: 540, w: 68,  h: 58  }, { x: 632, w: 42,  h: 82  },
  { x: 698, w: 88,  h: 44  }, { x: 815, w: 52,  h: 72  },
  { x: 888, w: 38,  h: 52  },
];

function drawBg(ctx, scrollX) {
  const sky = ctx.createLinearGradient(0, 0, 0, GY);
  sky.addColorStop(0, "#05040d");
  sky.addColorStop(1, "#0c0b1a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CW, GY);

  const off = (scrollX * 0.15) % CW;
  ctx.fillStyle = "rgba(245,158,11,0.045)";
  for (const b of CITY) {
    const bx = ((b.x - off) % CW + CW) % CW;
    ctx.fillRect(bx, GY - b.h, b.w, b.h);
    if (bx + b.w > CW) ctx.fillRect(bx - CW, GY - b.h, b.w, b.h);
  }

  const hg = ctx.createLinearGradient(0, GY - 18, 0, GY + 4);
  hg.addColorStop(0, "rgba(245,158,11,0.1)");
  hg.addColorStop(1, "transparent");
  ctx.fillStyle = hg;
  ctx.fillRect(0, GY - 18, CW, 22);

  ctx.fillStyle = "rgba(245,158,11,0.055)";
  ctx.fillRect(0, GY, CW, CH - GY);

  ctx.strokeStyle = "rgba(245,158,11,0.065)";
  ctx.lineWidth = 1;
  const step = 44;
  const crack = scrollX % step;
  for (let x = -crack; x < CW; x += step) {
    ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x, CH); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, GY + 12); ctx.lineTo(CW, GY + 12); ctx.stroke();
}

/* ── Player ─────────────────────────────────────────────────── */
function drawPlayer(ctx, py, tick, grounded, ducking) {
  const x = PX;
  const y = py;
  const d = Math.PI / 180;

  ctx.save();
  ctx.translate(x, y);

  if (ducking) {
    // Shadow
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(2, 3, 16, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Legs tucked out behind
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(-14, -5, 10, 6);
    ctx.fillRect(-2,  -5, 10, 6);

    // Shoes
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(-16, -1, 13, 5);
    ctx.fillRect(-4,  -1, 13, 5);

    // Body — flat and wide
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-11, -13, 26, 10, 4); else ctx.rect(-11, -13, 26, 10);
    ctx.fill();

    // Head tucked forward
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.arc(12, -18, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath(); ctx.arc(16, -19, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(9,  -19, 1.8, 0, Math.PI * 2); ctx.fill();
  } else {
    // Running / airborne
    const legTick = grounded ? tick : 6;
    const ls = Math.sin(legTick * 0.52) * 14;
    const lean = grounded ? 0 : -9 * d;
    ctx.rotate(lean);

    // Shadow
    if (grounded) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(0, 4, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Legs
    ctx.fillStyle = "#1a1a2e";
    ctx.save(); ctx.translate(-5, 18); ctx.rotate(ls * d);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-3.5, 0, 7, 20, 2); else ctx.rect(-3.5, 0, 7, 20);
    ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(6, 18); ctx.rotate(-ls * d);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-3.5, 0, 7, 20, 2); else ctx.rect(-3.5, 0, 7, 20);
    ctx.fill(); ctx.restore();

    // Shoes
    ctx.fillStyle = "#f59e0b";
    ctx.save(); ctx.translate(-5, 18); ctx.rotate(ls * d);
    ctx.fillRect(-5, 15, 12, 5); ctx.restore();
    ctx.save(); ctx.translate(6, 18); ctx.rotate(-ls * d);
    ctx.fillRect(-5, 15, 12, 5); ctx.restore();

    // Body
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-11, 0, 22, 18, 4); else ctx.rect(-11, 0, 22, 18);
    ctx.fill();

    // Arms
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";
    ctx.save(); ctx.translate(-10, 5); ctx.rotate((ls + 28) * d);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(11, 5); ctx.rotate((-ls + 28) * d);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.stroke(); ctx.restore();

    // Head
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.arc(0, -12, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath(); ctx.arc(4,  -13, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-4, -13, 2.2, 0, Math.PI * 2); ctx.fill();

    if (!grounded) {
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(0, -9, 4.5, 0.15, Math.PI - 0.15); ctx.stroke();
    }
  }

  ctx.restore();
}

/* ── Obstacles ──────────────────────────────────────────────── */
function drawObstacle(ctx, obs) {
  const { x, def } = obs;

  if (def.type === "beam") {
    const barBottom = GY - def.clearance;
    const barTop    = barBottom - def.barH;

    // Pillars from top down to bar
    ctx.fillStyle = def.body;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(x + 10,          0, 8, barTop + 2);
    ctx.fillRect(x + def.w - 18,  0, 8, barTop + 2);
    ctx.globalAlpha = 1;

    // Bar
    ctx.fillStyle = def.accent;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, barTop, def.w, def.barH, 3);
    else ctx.rect(x, barTop, def.w, def.barH);
    ctx.fill();

    // Warning stripe overlay on bar
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < def.w; i += 18) {
      ctx.fillRect(x + i, barTop, 9, def.barH);
    }
    ctx.globalAlpha = 1;

    // Bottom glow
    const bg = ctx.createLinearGradient(0, barBottom, 0, barBottom + 18);
    bg.addColorStop(0, `${def.accent}55`);
    bg.addColorStop(1, "transparent");
    ctx.fillStyle = bg;
    ctx.fillRect(x, barBottom, def.w, 18);

    // "▼ DUCK" hint label above bar
    ctx.fillStyle = def.accent;
    ctx.globalAlpha = 0.75;
    ctx.font = "bold 8px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("▼ DUCK", x + def.w / 2, barTop - 5);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
    return;
  }

  const top = GY - def.h;

  // Shadow
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x + def.w / 2, GY + 3, def.w / 2 - 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  if (def.type === "bug") {
    ctx.fillStyle = def.body;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, top, def.w, def.h, [10, 10, 5, 5]);
    else ctx.rect(x, top, def.w, def.h);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x + 4, top + 4, def.w - 8, def.h / 2 - 4, [6, 6, 0, 0]);
    else ctx.rect(x + 4, top + 4, def.w - 8, def.h / 2 - 4);
    ctx.fill();

    ctx.fillStyle = def.accent;
    ctx.globalAlpha = 0.45;
    ctx.beginPath(); ctx.arc(x + 11, top + 16, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 24, top + 26, 4, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = def.accent;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x + 11, top + 1); ctx.lineTo(x + 5,  top - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 25, top + 1); ctx.lineTo(x + 32, top - 12); ctx.stroke();
    ctx.fillStyle = def.accent;
    ctx.beginPath(); ctx.arc(x + 5,  top - 13, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 32, top - 13, 2.8, 0, Math.PI * 2); ctx.fill();

  } else if (def.type === "server") {
    const unitH = Math.floor(def.h / 3);
    for (let i = 0; i < 3; i++) {
      const sy = top + i * unitH;
      ctx.fillStyle = i === 1 ? def.accent : def.body;
      ctx.globalAlpha = i === 1 ? 0.85 : 1;
      ctx.fillRect(x, sy + 1, def.w, unitH - 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fillRect(x + 4, sy + 4, 8, 4);
      ctx.fillRect(x + 4, sy + 10, 18, 2);
      ctx.fillStyle = i === 1 ? "#ef4444" : "#34d399";
      ctx.beginPath(); ctx.arc(x + def.w - 8, sy + 9, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.65;
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("404", x + def.w / 2, top + def.h / 2 + 4);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;

  } else {
    // spike / ERR
    ctx.fillStyle = def.body;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, top, def.w, def.h, [4, 4, 0, 0]);
    else ctx.rect(x, top, def.w, def.h);
    ctx.fill();

    ctx.fillStyle = def.accent;
    ctx.globalAlpha = 0.28;
    for (let i = 0; i < 5; i++) ctx.fillRect(x, top + 8 + i * 18, def.w, 8);
    ctx.globalAlpha = 1;

    const tg = ctx.createLinearGradient(0, top, 0, top + 24);
    tg.addColorStop(0, def.accent);
    tg.addColorStop(1, "transparent");
    ctx.fillStyle = tg;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(x, top, def.w, 24);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.6;
    ctx.font = "bold 7px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("ERR", x + def.w / 2, GY - 8);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }
}

/* ── Particles ──────────────────────────────────────────────── */
function emitLanding(particles) {
  for (let i = 0; i < 7; i++) {
    particles.push({
      x: PX + (Math.random() - 0.5) * 24,
      y: GY,
      vx: (Math.random() - 0.5) * 3.5,
      vy: -(Math.random() * 2 + 0.5),
      alpha: 0.6,
      r: 2 + Math.random() * 2.5,
    });
  }
}

function emitRun(particles, tick) {
  if (tick % 4 === 0) {
    particles.push({
      x: PX - 20 + (Math.random() - 0.5) * 8,
      y: GY + 2,
      vx: -(0.8 + Math.random() * 1),
      vy: -(Math.random() * 0.6),
      alpha: 0.32,
      r: 1.5 + Math.random() * 2,
    });
  }
}

function tickParticles(particles) {
  return particles
    .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, alpha: p.alpha - 0.024 }))
    .filter(p => p.alpha > 0);
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "#d97706";
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ── HUD ────────────────────────────────────────────────────── */
const TIERS = [
  { min: 14, label: "TURBO",  col: "#f87171" },
  { min: 10, label: "SPRINT", col: "#fbbf24" },
  { min:  6, label: "RUN",    col: "#34d399" },
  { min:  0, label: "JOG",    col: "#94a3b8" },
];

function drawHUD(ctx, dist, speed, jumpsLeft, ducking) {
  ctx.font = "bold 14px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "right";
  ctx.fillText(`${Math.floor(dist)}m`, CW - 14, 24);
  ctx.textAlign = "left";

  const tier = TIERS.find(t => speed >= t.min) ?? TIERS[TIERS.length - 1];
  ctx.fillStyle = tier.col;
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  ctx.fillText(tier.label, 14, 24);

  // Jump dots
  for (let i = 0; i < 2; i++) {
    ctx.fillStyle = i < jumpsLeft ? "#34d399" : "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.arc(14 + i * 14, 36, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Duck indicator
  if (ducking) {
    ctx.fillStyle = "#34d399";
    ctx.globalAlpha = 0.85;
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillText("▼ DUCK", 14, 50);
    ctx.globalAlpha = 1;
  }
}

/* ── Collision ──────────────────────────────────────────────── */
function collides(py, ducking, obs) {
  const playerH = ducking ? 16 : 36;
  const py1 = py - playerH;
  const py2 = py - 1;
  const px1 = PX - (ducking ? 14 : 9);
  const px2 = PX + (ducking ? 14 : 9);

  if (obs.def.type === "beam") {
    const barBottom = GY - obs.def.clearance;
    const barTop    = barBottom - obs.def.barH;
    const ox1 = obs.x + 4, ox2 = obs.x + obs.def.w - 4;
    // Collision only with the bar itself, not the pillars
    return px1 < ox2 && px2 > ox1 && py1 < barBottom && py2 >= barTop;
  }

  const ox1 = obs.x + 5,           ox2 = obs.x + obs.def.w - 5;
  const oy1 = GY - obs.def.h + 4,  oy2 = GY - 1;
  return px1 < ox2 && px2 > ox1 && py1 < oy2 && py2 > oy1;
}

/* ── Component ──────────────────────────────────────────────── */
function BullRunnerGame() {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const stateRef  = useRef(null);
  const rafRef    = useRef(null);

  const [scale, setScale]         = useState(1);
  const [phase, setPhase]         = useState("idle");
  const [score, setScore]         = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("devrun-hs") ?? 0)
  );
  const [toast, setToast]         = useState(null);
  const [newBest, setNewBest]     = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / CW));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const stopLoop = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  const showToast = useCallback((text, color) => {
    setToast({ text, color });
    setTimeout(() => setToast(null), 1400);
  }, []);

  const doJump = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.jumpsLeft <= 0) return;
    s.vy = JUMP_VY;
    s.jumpsLeft--;
    s.ducking = false; // jump always cancels duck
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = {
      py:          GY,
      vy:          0,
      jumpsLeft:   2,
      wasGrounded: true,
      ducking:     false,
      obstacles:   [],
      particles:   [],
      dist:        0,
      speed:       6.5,           // faster start
      scrollX:     0,
      tick:        0,
      nextObs:     75,
      comboQueued: null,          // { framesLeft, def }
      milestones:  new Set(),
    };
    setScore(0);
    setNewBest(false);
    setToast(null);
    setPhase("playing");
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    s.tick++;
    s.scrollX += s.speed;
    s.dist    += s.speed * 0.072;
    s.speed    = Math.min(MAX_SPEED, 6.5 + s.dist / 70);  // ramps faster

    // Milestone toasts
    for (const m of MILESTONES) {
      if (s.dist >= m && !s.milestones.has(m)) {
        s.milestones.add(m);
        showToast(`${m}m! 🔥`, "#fbbf24");
      }
    }

    // Physics
    if (!s.wasGrounded && s.ducking) s.vy += FAST_FALL; // fast-fall
    s.vy += GRAV;
    s.py += s.vy;

    const grounded = s.py >= GY;
    if (grounded) {
      if (!s.wasGrounded) {
        s.jumpsLeft = 2;
        emitLanding(s.particles);
      }
      s.py = GY;
      s.vy = 0;
    }
    s.wasGrounded = grounded;

    if (grounded) emitRun(s.particles, s.tick);
    s.particles = tickParticles(s.particles);

    // Spawn obstacles
    s.nextObs--;

    // Combo: a second obstacle follows shortly after the first
    if (s.comboQueued) {
      s.comboQueued.framesLeft--;
      if (s.comboQueued.framesLeft <= 0) {
        s.obstacles.push({ x: CW + 20, def: s.comboQueued.def });
        s.comboQueued = null;
      }
    }

    if (s.nextObs <= 0) {
      // Beams only after 60m and only on ground obstacles turn
      const pool = s.dist > 60
        ? OBS_DEFS
        : GROUND_OBS;
      const def = pool[Math.floor(Math.random() * pool.length)];
      s.obstacles.push({ x: CW + 20, def });

      // Gap tightens with speed; never below 48 frames
      const baseGap = Math.max(48, 100 - s.dist / 10);
      s.nextObs = Math.floor(baseGap + Math.random() * 45);

      // Combo: 35% chance at speed > 9, 55% at speed > 13
      const comboChance = s.speed > 13 ? 0.55 : s.speed > 9 ? 0.35 : 0;
      if (Math.random() < comboChance && !s.comboQueued) {
        // Combo is always a different type to the primary
        const comboPool = OBS_DEFS.filter(d => d.type !== def.type);
        const comboDef  = comboPool[Math.floor(Math.random() * comboPool.length)];
        // Appears 55–80 frames after the first (gives player time to react)
        s.comboQueued = { def: comboDef, framesLeft: 60 + Math.floor(Math.random() * 25) };
      }
    }

    // Move + cull
    s.obstacles = s.obstacles
      .map(o => ({ ...o, x: o.x - s.speed }))
      .filter(o => o.x > -Math.max(o.def.w ?? 0, 100) - 20);

    // Collision
    for (const obs of s.obstacles) {
      if (collides(s.py, s.ducking, obs)) {
        const final = Math.floor(s.dist);
        setScore(final);
        setNewBest(false);
        setHighScore(prev => {
          const next = Math.max(prev, final);
          localStorage.setItem("devrun-hs", String(next));
          if (final > prev) setNewBest(true);
          return next;
        });
        setPhase("dead");
        return;
      }
    }

    // Draw
    ctx.clearRect(0, 0, CW, CH);
    drawBg(ctx, s.scrollX);
    drawParticles(ctx, s.particles);
    s.obstacles.forEach(o => drawObstacle(ctx, o));
    drawPlayer(ctx, s.py, s.tick, grounded, s.ducking);
    drawHUD(ctx, s.dist, s.speed, s.jumpsLeft, s.ducking);

    rafRef.current = requestAnimationFrame(loop);
  }, [showToast]);

  useEffect(() => {
    if (phase === "playing") rafRef.current = requestAnimationFrame(loop);
    return stopLoop;
  }, [phase, loop]);

  // Idle preview
  useEffect(() => {
    if (phase !== "idle") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CW, CH);
    drawBg(ctx, 120);
    drawPlayer(ctx, GY, 20, true, false);
    drawObstacle(ctx, { x: CW - 300, def: OBS_DEFS[0] });
    drawObstacle(ctx, { x: CW - 155, def: OBS_DEFS[3] }); // show beam in preview
    drawObstacle(ctx, { x: CW - 60,  def: OBS_DEFS[1] });
  }, [phase]);

  // Keyboard controls
  useEffect(() => {
    if (phase !== "playing") return;
    const onKeyDown = e => {
      const s = stateRef.current;
      if (!s) return;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        doJump();
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        if (s.wasGrounded) {
          s.ducking = true;
        } else {
          // Fast fall in air
          s.vy += FAST_FALL;
        }
      }
    };
    const onKeyUp = e => {
      const s = stateRef.current;
      if (!s) return;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        s.ducking = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
    };
  }, [phase, doJump]);

  const mobileDuck = useCallback((active) => {
    if (stateRef.current) stateRef.current.ducking = active;
  }, []);

  return (
    <div className="bull-game">
      <div ref={wrapRef} className="bull-canvas-outer">
        <div className="bull-canvas-scaler" style={{ height: CH * scale }}>
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: CW, height: CH,
              position: "relative",
            }}
          >
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              className="bull-canvas"
              onClick={phase === "playing" ? doJump : undefined}
              style={{ cursor: phase === "playing" ? "pointer" : "default" }}
            />

            {toast && (
              <div className="bull-toast" style={{ color: toast.color }}>
                {toast.text}
              </div>
            )}

            {phase === "idle" && (
              <div className="bull-overlay">
                <p className="bull-title">🏃 Dev Run</p>
                <p className="bull-hint">
                  Space / ↑ / W &nbsp;=&nbsp; jump &nbsp;·&nbsp; S / ↓ &nbsp;=&nbsp; duck
                  <br />
                  Double jump available &nbsp;·&nbsp; Tap canvas on mobile
                </p>
                <button className="button primary small" onClick={startGame} type="button">
                  Start Running
                </button>
                {highScore > 0 && <p className="bull-hs">Best: {highScore}m</p>}
              </div>
            )}

            {phase === "dead" && (
              <div className="bull-overlay">
                <p className="bull-title">{newBest ? "🏆 New Best!" : "💥 Wiped out!"}</p>
                <p className="bull-stat">
                  {score}m
                  {newBest
                    ? " — new record!"
                    : ` · Best: ${highScore}m`}
                </p>
                <button className="button primary small" onClick={startGame} type="button">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile controls */}
      {phase === "playing" && (
        <div className="bull-mobile-btns" aria-label="Mobile controls">
          <button
            type="button"
            aria-label="Jump"
            onPointerDown={doJump}
          >
            ▲
          </button>
          <button
            type="button"
            aria-label="Duck"
            onPointerDown={() => mobileDuck(true)}
            onPointerUp={() => mobileDuck(false)}
            onPointerLeave={() => mobileDuck(false)}
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
}

export default BullRunnerGame;