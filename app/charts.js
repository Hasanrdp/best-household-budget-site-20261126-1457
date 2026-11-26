// Small SVG charts, drawn with no library and no network: a monthly bar
// chart and a category donut, both built from the household's own numbers.

export function barChart(rows, { width = 640, height = 220, highlightLast = true } = {}) {
  const max = Math.max(...rows.map((r) => r.spent), 1);
  const pad = { top: 14, right: 8, bottom: 26, left: 52 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const slot = innerW / rows.length;
  const barW = Math.min(54, slot * 0.58);
  const bars = rows
    .map((row, i) => {
      const h = Math.max(2, (row.spent / max) * innerH);
      const x = pad.left + i * slot + (slot - barW) / 2;
      const y = pad.top + innerH - h;
      const last = highlightLast && i === rows.length - 1;
      const fill = last ? '#b45309' : '#1e5631';
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${fill}"><title>${row.month}: $${row.spent.toLocaleString('en-US')}</title></rect>
      <text x="${(x + barW / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="11" fill="#374151">$${row.spent.toLocaleString('en-US')}</text>
      <text x="${(x + barW / 2).toFixed(1)}" y="${(pad.top + innerH + 18).toFixed(1)}" text-anchor="middle" font-size="12" fill="#6b7280">${row.month}</text>`;
    })
    .join('\n');
  const grid = [0.25, 0.5, 0.75, 1]
    .map((f) => {
      const y = pad.top + innerH * (1 - f);
      return `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="#e5e7eb" stroke-width="1" />
      <text x="${pad.left - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#9ca3af">$${Math.round(max * f).toLocaleString('en-US')}</text>`;
    })
    .join('\n');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly spending bar chart" class="chart">${grid}${bars}</svg>`;
}

export function donutChart(slices, { size = 260 } = {}) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const hole = r * 0.62;
  let angle = -Math.PI / 2;
  const paths = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const frac = s.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const ix1 = cx + hole * Math.cos(a1);
      const iy1 = cy + hole * Math.sin(a1);
      const ix0 = cx + hole * Math.cos(a0);
      const iy0 = cy + hole * Math.sin(a0);
      return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${ix1.toFixed(1)} ${iy1.toFixed(1)} A ${hole} ${hole} 0 ${large} 0 ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z" fill="${s.color}"><title>${s.label}: $${s.value.toLocaleString('en-US')} (${Math.round(frac * 100)}%)</title></path>`;
    })
    .join('\n');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category donut chart" class="chart donut">${paths}
  <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="22" font-weight="700" fill="#111827">$${Math.round(total).toLocaleString('en-US')}</text>
  <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="12" fill="#6b7280">spent in November</text></svg>`;
}
