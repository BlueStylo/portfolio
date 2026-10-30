(() => {
  const canvas = document.getElementById("mesh-hero");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let points = [];
  let frame = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width < 720 ? 54 : 88;
    points = Array.from({ length: count }, (_, index) => ({
      x: width * (0.42 + Math.random() * 0.58),
      y: height * (0.08 + Math.random() * 0.84),
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      phase: index * 0.37,
    }));
  }

  function draw() {
    frame += 0.014;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0b0c0f";
    ctx.fillRect(0, 0, width, height);

    for (const point of points) {
      point.x += point.vx + Math.sin(frame + point.phase) * 0.08;
      point.y += point.vy + Math.cos(frame * 0.8 + point.phase) * 0.08;

      if (point.x < width * 0.36 || point.x > width + 20) point.vx *= -1;
      if (point.y < -20 || point.y > height + 20) point.vy *= -1;
    }

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.22;
          ctx.strokeStyle = `rgba(180, 195, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const point of points) {
      const radius = 1.8 + Math.sin(frame + point.phase) * 0.8;
      ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
})();
