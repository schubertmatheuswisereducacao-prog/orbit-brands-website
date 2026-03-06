/* ============================================================
   ORBIT BRANDS — Orbital Canvas Animation
   ============================================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('orbital-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let time = 0;
  let w, h, cx, cy;

  const PLANETS = [
    { name: 'Produto',      emoji: '📦', color: '#e8a020', a: 0.42, b: 0.18, speed: 0.0008,  offset: 0,    angle: Math.PI * 0.3,  size: 9 },
    { name: 'Funil',        emoji: '🎯', color: '#00d4ff', a: 0.54, b: 0.24, speed: 0.00055, offset: 1.2,  angle: Math.PI * 0.9,  size: 8 },
    { name: 'Suporte',      emoji: '⚡', color: '#34d399', a: 0.48, b: 0.21, speed: 0.00045, offset: 0.8,  angle: Math.PI * 0.6,  size: 7.5 },
    { name: 'Recorrência',  emoji: '♾️', color: '#fb7185', a: 0.64, b: 0.29, speed: 0.0003,  offset: 1.8,  angle: Math.PI * 1.4,  size: 9.5 },
  ];

  const PARTICLES = Array.from({ length: 80 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    alpha: Math.random() * 0.4 + 0.05,
    speed: Math.random() * 0.0001 + 0.00002,
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    w = rect.width;
    h = rect.height;
    cx = w / 2;
    cy = h / 2;
  }

  function getPlanetPos(planet, t) {
    const angle = planet.angle + t * planet.speed + planet.offset;
    const rx = w * planet.a;
    const ry = h * planet.b;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;
    return { x, y, angle };
  }

  function drawBackground() {
    ctx.clearRect(0, 0, w, h);
  }

  function drawParticles() {
    PARTICLES.forEach(p => {
      p.x += p.speed;
      if (p.x > 1) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });
  }

  function drawOrbit(planet, t) {
    const rx = w * planet.a;
    const ry = h * planet.b;

    // Orbit ring
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    const gradient = ctx.createLinearGradient(cx - rx, cy, cx + rx, cy);
    gradient.addColorStop(0, `${planet.color}00`);
    gradient.addColorStop(0.5, `${planet.color}22`);
    gradient.addColorStop(1, `${planet.color}00`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Orbit trail
    const pos = getPlanetPos(planet, t);
    const trailLen = 60;
    for (let i = trailLen; i >= 0; i--) {
      const tTrail = t - i * 600;
      const tp = getPlanetPos(planet, tTrail);
      const alpha = ((trailLen - i) / trailLen) * 0.3;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, planet.size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `${planet.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
    }
  }

  function drawPlanet(planet, t, hovered) {
    const pos = getPlanetPos(planet, t);
    const scale = hovered ? 1.4 : 1;
    const size = planet.size * scale;

    // Glow
    const glowRadius = size * 3.5;
    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
    grd.addColorStop(0, `${planet.color}50`);
    grd.addColorStop(1, `${planet.color}00`);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Planet dot
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.shadowColor = planet.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Planet label (always visible)
    const labelOffsetY = -size - 12;
    ctx.font = `500 11px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(240,236,228,0.7)`;
    ctx.fillText(planet.name, pos.x, pos.y + labelOffsetY);

    return pos;
  }

  function drawSun() {
    // Outer corona
    const coronaR = w * 0.055;
    const coronaGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, coronaR);
    coronaGrd.addColorStop(0, 'rgba(232,160,32,0.28)');
    coronaGrd.addColorStop(0.4, 'rgba(232,160,32,0.10)');
    coronaGrd.addColorStop(1, 'rgba(232,160,32,0.00)');
    ctx.beginPath();
    ctx.arc(cx, cy, coronaR, 0, Math.PI * 2);
    ctx.fillStyle = coronaGrd;
    ctx.fill();

    // Pulsing ring
    const pulseScale = 1 + Math.sin(time * 0.002) * 0.12;
    const ringR = w * 0.025 * pulseScale;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(232,160,32,${0.3 + Math.sin(time * 0.002) * 0.15})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sun body
    const sunR = w * 0.022;
    const sunGrd = ctx.createRadialGradient(cx - sunR * 0.3, cy - sunR * 0.3, 0, cx, cy, sunR);
    sunGrd.addColorStop(0, '#ffd060');
    sunGrd.addColorStop(0.5, '#e8a020');
    sunGrd.addColorStop(1, '#c47a00');
    ctx.beginPath();
    ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fillStyle = sunGrd;
    ctx.shadowColor = '#e8a020';
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Sun label
    ctx.font = `700 12px 'Space Grotesk', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(240,236,228,0.85)';
    ctx.fillText('Você', cx, cy + sunR + 18);
  }

  function drawConnectionLines(planet, pos) {
    const alpha = 0.04 + Math.sin(time * 0.001 + planet.offset) * 0.02;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = `rgba(232,160,32,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function draw() {
    drawBackground();
    drawParticles();

    // Orbits first (behind)
    PLANETS.forEach(p => drawOrbit(p, time));

    // Connection lines
    PLANETS.forEach(p => {
      const pos = getPlanetPos(p, time);
      drawConnectionLines(p, pos);
    });

    // Sun
    drawSun();

    // Planets on top
    PLANETS.forEach(p => drawPlanet(p, time));

    time++;
    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    draw();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  // Visibility API — pause when tab not active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(draw);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
