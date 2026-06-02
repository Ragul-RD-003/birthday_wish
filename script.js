/* ═══════════════════════════════════════════════════
   NITHYA — BIRTHDAY DREAMSCAPE
   script.js — animations, audio, visualizer
═══════════════════════════════════════════════════ */

'use strict';

/* ── UTILITIES ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const randOf = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ══════════════════════════════════════════════════
   1. BACKGROUND CANVAS
   Deep pink nebula sky with 200 drifting star particles
══════════════════════════════════════════════════ */
function initCanvas() {
  const canvas = $('#bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  /* Twinkling stars */
  const STAR_COLORS = [
    '255,228,236',   // blush white
    '240,168,190',   // rose
    '212,168,75',    // gold
    '255,252,248',   // warm white
    '252,220,242',   // lavender pink
  ];

  const stars = Array.from({ length: 210 }, () => ({
    x:   rand(0, window.innerWidth),
    y:   rand(0, window.innerHeight),
    r:   rand(0.3, 1.6),
    col: randOf(STAR_COLORS),
    tw:  rand(0.003, 0.009),   // twinkle speed
    ph:  rand(0, Math.PI * 2), // phase offset
    dx:  rand(-0.055, 0.055),  // slow drift x
    dy:  rand(-0.05, 0.05),    // slow drift y
  }));

  /* Soft mist / nebula blobs */
  const MIST_COLORS = [
    '200, 80, 135',  // deep rose
    '170, 60, 120',  // magenta rose
    '100, 45, 140',  // purple mist
    '220, 100, 145', // pink mist
    '190, 90, 130',  // rose mist
  ];

  const mists = Array.from({ length: 6 }, (_, i) => ({
    x:   rand(0, window.innerWidth),
    y:   rand(0, window.innerHeight),
    w:   rand(160, 320),
    col: MIST_COLORS[i % MIST_COLORS.length],
    a:   rand(0.035, 0.07),
    dx:  rand(-0.2, 0.2),
    dy:  rand(-0.15, 0.15),
    ph:  rand(0, Math.PI * 2),
  }));

  let t = 0;
  const WRAP = (v, lo, hi) => v < lo ? hi : v > hi ? lo : v;

  const draw = () => {
    t += 0.013;

    /* ── Deep radial gradient background ── */
    const bg = ctx.createRadialGradient(W * 0.38, H * 0.28, 0, W * 0.5, H * 0.6, Math.hypot(W, H) * 0.75);
    bg.addColorStop(0,    '#2e0c22');
    bg.addColorStop(0.35, '#1a0626');
    bg.addColorStop(0.7,  '#0f0318');
    bg.addColorStop(1,    '#08010f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ── Nebula mist ── */
    mists.forEach(m => {
      m.x = WRAP(m.x + m.dx, -m.w, W + m.w);
      m.y = WRAP(m.y + m.dy, -m.w, H + m.w);
      const pulse = m.a * (0.68 + 0.32 * Math.sin(t * 0.45 + m.ph));
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.w);
      g.addColorStop(0, `rgba(${m.col},${pulse.toFixed(3)})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    /* ── Stars ── */
    stars.forEach(s => {
      s.x = WRAP(s.x + s.dx, 0, W);
      s.y = WRAP(s.y + s.dy, 0, H);
      const a = 0.28 + 0.68 * (0.5 + 0.5 * Math.sin(t * s.tw * 52 + s.ph));
      ctx.save();
      ctx.shadowColor = `rgba(${s.col},${a.toFixed(2)})`;
      ctx.shadowBlur  = s.r * 7;
      ctx.fillStyle   = `rgba(${s.col},${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}

/* ══════════════════════════════════════════════════
   2. SPARKLE DOTS  (fixed ambient glitter)
══════════════════════════════════════════════════ */
function initSparkles() {
  const COLORS = [
    '#f0a8be', '#d4a84b', '#fce4ec',
    '#f2d98a', '#e07898', '#ffd6e8',
  ];

  const frag = document.createDocumentFragment();

  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    const c  = COLORS[i % COLORS.length];
    const sz = rand(1.5, 3.8);
    el.style.cssText = `
      left: ${rand(0, 100)}%;
      top:  ${rand(0, 100)}%;
      width:  ${sz}px;
      height: ${sz}px;
      background: ${c};
      box-shadow: 0 0 ${sz * 2}px ${c}, 0 0 ${sz * 4}px ${c}40;
      --dur:   ${rand(1.8, 5.2)}s;
      --delay: ${rand(0, 7)}s;
    `;
    frag.appendChild(el);
  }

  document.body.appendChild(frag);
}

/* ══════════════════════════════════════════════════
   3. FLOATING PETALS
══════════════════════════════════════════════════ */
const PETAL_GLYPHS = ['🌸', '🌺', '🌷', '🌼', '✿', '❀'];

function spawnPetal() {
  const el = document.createElement('div');
  el.className = 'petal';
  el.textContent = randOf(PETAL_GLYPHS);
  el.style.cssText = `
    left:     ${rand(-5, 108)}vw;
    top:      -50px;
    font-size: ${rand(0.7, 1.05)}rem;
    --drift:   ${rand(-140, 140)}px;
    animation-duration: ${rand(9, 15)}s;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 16000);
}

function initPetals() {
  // Stagger initial burst
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnPetal, i * 450);
  }
  setInterval(spawnPetal, 1150);
}

/* ══════════════════════════════════════════════════
   4. CRYSTAL HEART — SVG built in JS
   Glassmorphism + rose-gold glow + pulse
══════════════════════════════════════════════════ */
function buildHeart() {
  const wrap = $('.heart-wrap');
  if (!wrap) return;

  const NS  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 92');
  svg.setAttribute('class', 'heart-svg');
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('aria-hidden', 'true');

  // Heart path (mathematically correct)
  const heartPath = 'M50 85 C50 85 8 58 8 30 C8 16 18 8 30 8 C38 8 45 12 50 18 C55 12 62 8 70 8 C82 8 92 16 92 30 C92 58 50 85 50 85 Z';

  const defs = document.createElementNS(NS, 'defs');

  // ── fill gradient: radial from highlight centre
  const fillGrad = document.createElementNS(NS, 'radialGradient');
  fillGrad.setAttribute('id', 'heartFill');
  fillGrad.setAttribute('cx', '40%');
  fillGrad.setAttribute('cy', '35%');
  fillGrad.setAttribute('r',  '65%');
  const stops = [
    ['0%',   'rgba(255,230,248,0.55)'],
    ['25%',  'rgba(240,168,190,0.45)'],
    ['55%',  'rgba(212,120,155,0.32)'],
    ['80%',  'rgba(170,70,110,0.20)'],
    ['100%', 'rgba(100,25,65,0.08)'],
  ];
  stops.forEach(([offset, color]) => {
    const s = document.createElementNS(NS, 'stop');
    s.setAttribute('offset', offset);
    s.setAttribute('stop-color', color);
    fillGrad.appendChild(s);
  });

  // ── rim gradient: conic-like via linear
  const rimGrad = document.createElementNS(NS, 'linearGradient');
  rimGrad.setAttribute('id', 'heartRim');
  rimGrad.setAttribute('x1', '0%');
  rimGrad.setAttribute('y1', '0%');
  rimGrad.setAttribute('x2', '100%');
  rimGrad.setAttribute('y2', '100%');
  [
    ['0%',   'rgba(240,168,190,0.85)'],
    ['30%',  'rgba(212,168,75,0.70)'],
    ['60%',  'rgba(240,168,190,0.55)'],
    ['100%', 'rgba(212,168,75,0.85)'],
  ].forEach(([offset, color]) => {
    const s = document.createElementNS(NS, 'stop');
    s.setAttribute('offset', offset);
    s.setAttribute('stop-color', color);
    rimGrad.appendChild(s);
  });

  // ── glow filter
  const filter = document.createElementNS(NS, 'filter');
  filter.setAttribute('id', 'heartGlow');
  filter.setAttribute('x', '-40%'); filter.setAttribute('y', '-40%');
  filter.setAttribute('width', '180%'); filter.setAttribute('height', '180%');

  const blur = document.createElementNS(NS, 'feGaussianBlur');
  blur.setAttribute('stdDeviation', '4');
  blur.setAttribute('result', 'coloredBlur');
  const merge = document.createElementNS(NS, 'feMerge');
  ['coloredBlur', 'SourceGraphic'].forEach(in_ => {
    const n = document.createElementNS(NS, 'feMergeNode');
    n.setAttribute('in', in_);
    merge.appendChild(n);
  });
  filter.appendChild(blur);
  filter.appendChild(merge);

  defs.appendChild(fillGrad);
  defs.appendChild(rimGrad);
  defs.appendChild(filter);
  svg.appendChild(defs);

  // ── Drop-shadow glow heart (behind)
  const glowHeart = document.createElementNS(NS, 'path');
  glowHeart.setAttribute('d', heartPath);
  glowHeart.setAttribute('fill', 'rgba(230,130,170,0.28)');
  glowHeart.setAttribute('transform', 'scale(1.06) translate(-3,-3)');
  glowHeart.setAttribute('filter', 'url(#heartGlow)');
  svg.appendChild(glowHeart);

  // ── Main filled heart
  const mainHeart = document.createElementNS(NS, 'path');
  mainHeart.setAttribute('d', heartPath);
  mainHeart.setAttribute('fill', 'url(#heartFill)');
  mainHeart.setAttribute('filter', 'url(#heartGlow)');
  svg.appendChild(mainHeart);

  // ── Rim stroke
  const rimHeart = document.createElementNS(NS, 'path');
  rimHeart.setAttribute('d', heartPath);
  rimHeart.setAttribute('fill', 'none');
  rimHeart.setAttribute('stroke', 'url(#heartRim)');
  rimHeart.setAttribute('stroke-width', '1.4');
  svg.appendChild(rimHeart);

  // ── Glass highlight — top-left shine
  const shine = document.createElementNS(NS, 'ellipse');
  shine.setAttribute('cx', '38');
  shine.setAttribute('cy', '32');
  shine.setAttribute('rx', '12');
  shine.setAttribute('ry', '7');
  shine.setAttribute('fill', 'rgba(255,245,255,0.35)');
  shine.setAttribute('transform', 'rotate(-28,38,32)');
  svg.appendChild(shine);

  // ── Tiny sparkle dots on heart
  [
    [62, 20, 2.2], [28, 36, 1.8], [74, 46, 1.6],
    [50, 15, 2.0], [36, 22, 1.5],
  ].forEach(([cx, cy, r]) => {
    const d = document.createElementNS(NS, 'circle');
    d.setAttribute('cx', cx); d.setAttribute('cy', cy); d.setAttribute('r', r);
    d.setAttribute('fill', 'rgba(255,240,252,0.6)');
    svg.appendChild(d);
  });

  wrap.appendChild(svg);

  // Pulse animation via JS (so audio analyser can override later)
  let pScale = 1, pDir = 1, pT = 0;
  const pulseCycle = () => {
    pT += 0.018;
    const s = 1 + 0.07 * Math.sin(pT * 2.2);
    svg.style.transform = `scale(${s.toFixed(4)})`;
    svg.style.filter = `
      drop-shadow(0 0 ${Math.round(18 + 12 * Math.abs(Math.sin(pT)))}px rgba(240,168,190,${(0.45 + 0.35 * Math.abs(Math.sin(pT))).toFixed(2)}))
      drop-shadow(0 0 ${Math.round(36 + 20 * Math.abs(Math.sin(pT)))}px rgba(212,130,160,${(0.25 + 0.22 * Math.abs(Math.sin(pT))).toFixed(2)}))
    `;
    requestAnimationFrame(pulseCycle);
  };
  requestAnimationFrame(pulseCycle);

  return svg;
}

/* ══════════════════════════════════════════════════
   5. FLOATING MUSIC NOTES
   Emerge from heart, float up, never cover text
══════════════════════════════════════════════════ */
const NOTE_GLYPHS = ['♪', '♫', '♬', '♩', '♭'];

function initNotes() {
  const container = $('.notes-container');
  if (!container) return;

  const spawn = () => {
    const n = document.createElement('div');
    n.className = 'music-note';
    n.textContent = randOf(NOTE_GLYPHS);
    const dx = rand(-80, 80);
    n.style.cssText = `
      left:      ${rand(18, 82)}%;
      --n-dur:   ${rand(2.2, 3.8)}s;
      --n-delay: 0s;
      --n-dx:    ${dx}px;
      font-size: ${rand(0.85, 1.22)}rem;
    `;
    container.appendChild(n);
    setTimeout(() => n.remove(), 4500);
  };

  // Start spawning after heart section is visible
  setInterval(spawn, 480);
}

/* ══════════════════════════════════════════════════
   6. AUDIO ENGINE
   Autoplay → fallback to first-interaction play
   Web Audio API for heart pulse sync
══════════════════════════════════════════════════ */
function initAudio() {
  const audio = document.getElementById('bg-audio');
  if (!audio) return;

  let audioStarted = false;
  let audioCtx = null;
  let analyser = null;
  let freqData = null;

  /* Try to connect Web Audio for visualizer reactivity */
  const connectAnalyser = () => {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      freqData = new Uint8Array(analyser.frequencyBinCount);

      const src = audioCtx.createMediaElementSource(audio);
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) {
      // Web Audio unavailable — CSS fallback stays active
      analyser = null;
    }
  };

  /* Fade volume in gently */
  const fadeIn = () => {
    audio.volume = 0;
    const step = () => {
      if (audio.volume < 0.98) {
        audio.volume = Math.min(audio.volume + 0.022, 1);
        setTimeout(step, 80);
      } else {
        audio.volume = 1;
      }
    };
    step();
  };

  const startPlayback = () => {
    if (audioStarted) return;
    audioStarted = true;

    connectAnalyser();

    audio.play()
      .then(() => {
        fadeIn();
      })
      .catch(() => {
        audioStarted = false;
        // Will retry on next interaction
      });
  };

  /* ── Attempt silent autoplay ── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      audio.play()
        .then(() => {
          audioStarted = true;
          connectAnalyser();
          fadeIn();
        })
        .catch(() => {
          /* blocked — wait for user gesture */
        });
    }, 400);
  });

  /* ── First-interaction fallback (no overlay) ── */
  const onFirstGesture = () => {
    startPlayback();
    // Remove listeners once triggered
    ['click', 'touchend', 'keydown', 'pointerdown'].forEach(ev =>
      document.removeEventListener(ev, onFirstGesture)
    );
  };

  ['click', 'touchend', 'keydown', 'pointerdown'].forEach(ev =>
    document.addEventListener(ev, onFirstGesture, { passive: true })
  );

  /* ── Heart audio-reactive pulse (replaces CSS when active) ── */
  const heartSvg = $('.heart-svg');

  const audioTick = () => {
    if (analyser && heartSvg) {
      analyser.getByteFrequencyData(freqData);
      // Bass average (bins 1-4)
      let bass = 0;
      for (let i = 1; i <= 4; i++) bass += (freqData[i] || 0);
      bass = bass / (4 * 255);

      const s = (1 + bass * 0.18).toFixed(4);
      const g1 = Math.round(18 + bass * 42);
      const g2 = Math.round(35 + bass * 65);
      const a1 = (0.45 + bass * 0.45).toFixed(2);
      const a2 = (0.22 + bass * 0.35).toFixed(2);

      heartSvg.style.transform = `scale(${s})`;
      heartSvg.style.filter = `
        drop-shadow(0 0 ${g1}px rgba(240,168,190,${a1}))
        drop-shadow(0 0 ${g2}px rgba(212,130,160,${a2}))
      `;
    }
    requestAnimationFrame(audioTick);
  };

  requestAnimationFrame(audioTick);
}

/* ══════════════════════════════════════════════════
   7. STAGGERED REVEAL SEQUENCE
   Each element fades + rises with precise timing
══════════════════════════════════════════════════ */
function initReveal() {
  const page = $('#page');

  // Map: [selector, delay-ms, classes-to-add]
  const sequence = [
    ['#page',          100,  ['visible']],
    ['.rule-top',      300,  ['show']],
    ['.tagline',       500,  ['show']],
    ['.hb-line',       700,  ['show']],
    ['.name-line',    1400,  ['show']],
    ['.quote-card',   2400,  ['show']],
    ['.heart-section',3200,  ['show']],
    ['.footer-rule',  3800,  ['show']],
    ['.rule-bottom',  3900,  ['show']],
  ];

  sequence.forEach(([sel, delay, classes]) => {
    setTimeout(() => {
      const el = $(sel);
      if (el) classes.forEach(c => el.classList.add(c));
    }, delay);
  });
}

/* ══════════════════════════════════════════════════
   8. PREVENT HORIZONTAL OVERFLOW
   Guard against any child causing x-scroll
══════════════════════════════════════════════════ */
function guardOverflow() {
  const check = () => {
    if (document.documentElement.scrollWidth > window.innerWidth) {
      // Find and log offenders in dev, silently fix in prod
      document.body.style.overflowX = 'hidden';
    }
  };
  window.addEventListener('resize', check);
  check();
}

/* ══════════════════════════════════════════════════
   9. BOOT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initSparkles();
  initPetals();
  buildHeart();
  initNotes();
  initAudio();
  initReveal();
  guardOverflow();
});
