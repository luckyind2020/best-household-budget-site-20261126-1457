// Hearth Budget — canvas charts (no libraries, no network).
// drawDonut draws a spending-by-category ring; drawBars draws income-vs-spent bars.
// Both scale for devicePixelRatio so they stay crisp on phones.

function setupCanvas(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function drawDonut(canvas, slices) {
  const w = canvas.clientWidth || 300;
  const h = canvas.clientHeight || 300;
  const ctx = setupCanvas(canvas, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const outer = Math.min(w, h) / 2 - 8;
  const inner = outer * 0.62;
  const total = slices.reduce((s, x) => s + x.value, 0);
  ctx.clearRect(0, 0, w, h);
  if (total <= 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fillStyle = "#e8e0d2";
    ctx.fill();
  } else {
    let start = -Math.PI / 2;
    for (const slice of slices) {
      const sweep = (slice.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outer, start, start + sweep);
      ctx.arc(cx, cy, inner, start + sweep, start, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      // Thin cream separator so neighbouring slices stay distinct.
      ctx.strokeStyle = "#fffdf8";
      ctx.lineWidth = 2;
      ctx.stroke();
      start += sweep;
    }
  }
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = "#fffdf8";
  ctx.fill();
  ctx.fillStyle = "#1e4d3b";
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$" + Math.round(total).toLocaleString("en-US"), cx, cy - 8);
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = "#6b6257";
  ctx.fillText("spent this month", cx, cy + 14);
}

export function drawBars(canvas, series) {
  const w = canvas.clientWidth || 560;
  const h = canvas.clientHeight || 220;
  const ctx = setupCanvas(canvas, w, h);
  ctx.clearRect(0, 0, w, h);
  const padL = 44;
  const padB = 26;
  const padT = 12;
  const chartW = w - padL - 8;
  const chartH = h - padT - padB;
  const maxVal = Math.max(...series.flatMap((s) => [s.income, s.spent]), 1000);
  const niceMax = Math.ceil(maxVal / 2000) * 2000;
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = "#6b6257";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let g = 0; g <= 3; g++) {
    const v = (niceMax / 3) * g;
    const y = padT + chartH - (v / niceMax) * chartH;
    ctx.fillText("$" + (v / 1000).toFixed(0) + "k", padL - 6, y);
    ctx.strokeStyle = g === 0 ? "#c9bfae" : "#e8e0d2";
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - 8, y);
    ctx.stroke();
  }
  const groupW = chartW / series.length;
  const barW = Math.min(22, (groupW - 16) / 2);
  series.forEach((s, i) => {
    const gx = padL + i * groupW + groupW / 2;
    const incH = (s.income / niceMax) * chartH;
    const spH = (s.spent / niceMax) * chartH;
    ctx.fillStyle = "#1e4d3b";
    ctx.fillRect(gx - barW - 2, padT + chartH - incH, barW, incH);
    ctx.fillStyle = "#c96f4a";
    ctx.fillRect(gx + 2, padT + chartH - spH, barW, spH);
    ctx.fillStyle = "#3d362e";
    ctx.textAlign = "center";
    ctx.fillText(s.month, gx, h - 10);
  });
}
