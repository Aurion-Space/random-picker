export const WHEEL_COLORS = [
  '#ff6b6b',
  '#14b8a6',
  '#f59e0b',
  '#6366f1',
  '#ec4899',
  '#22c55e',
  '#0ea5e9',
  '#a855f7',
  '#f97316',
  '#84cc16',
];

const TAU = Math.PI * 2;

function shortLabel(name, maxLength) {
  return name.length > maxLength ? `${name.slice(0, maxLength - 1)}...` : name;
}

function drawEmptyWheel(ctx, centerX, centerY, radius) {
  const rings = [
    { radius: radius * 0.98, color: '#f8fafc' },
    { radius: radius * 0.72, color: '#eef2ff' },
    { radius: radius * 0.46, color: '#fff7ed' },
    { radius: radius * 0.2, color: '#fdf2f8' },
  ];

  rings.forEach((ring) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, ring.radius, 0, TAU);
    ctx.fillStyle = ring.color;
    ctx.fill();
  });

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, TAU);
  ctx.strokeStyle = '#d7dde8';
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function drawWheel(ctx, names, rotation = 0) {
  const { width, height } = ctx.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 34;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const outerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.12, centerX, centerY, radius * 1.08);
  outerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
  outerGlow.addColorStop(0.72, 'rgba(255, 255, 255, 0.98)');
  outerGlow.addColorStop(1, 'rgba(15, 23, 42, 0.16)');
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 22, 0, TAU);
  ctx.fillStyle = outerGlow;
  ctx.fill();

  if (!names || names.length === 0) {
    drawEmptyWheel(ctx, centerX, centerY, radius);
    ctx.restore();
    return;
  }

  const segmentAngle = TAU / names.length;
  const canDrawLabels = names.length <= 36;
  const fontSize = names.length <= 8 ? 27 : names.length <= 16 ? 22 : names.length <= 28 ? 17 : 13;
  const maxLabelLength = names.length <= 8 ? 18 : names.length <= 16 ? 14 : 10;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  for (let i = 0; i < names.length; i += 1) {
    const startAngle = i * segmentAngle - Math.PI / 2;
    const endAngle = startAngle + segmentAngle;
    const color = WHEEL_COLORS[i % WHEEL_COLORS.length];

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    const highlight = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
    highlight.addColorStop(0, 'rgba(255,255,255,0.28)');
    highlight.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = highlight;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.72)';
    ctx.lineWidth = 5;
    ctx.stroke();

    if (canDrawLabels && segmentAngle > 0.16) {
      const labelAngle = startAngle + segmentAngle / 2;
      const normalized = ((labelAngle % TAU) + TAU) % TAU;

      ctx.save();
      ctx.rotate(labelAngle);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(15, 23, 42, 0.38)';
      ctx.shadowBlur = 8;
      ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.textBaseline = 'middle';

      if (normalized > Math.PI / 2 && normalized < Math.PI * 1.5) {
        ctx.rotate(Math.PI);
        ctx.textAlign = 'left';
        ctx.fillText(shortLabel(names[i], maxLabelLength), -radius + 36, 0);
      } else {
        ctx.textAlign = 'right';
        ctx.fillText(shortLabel(names[i], maxLabelLength), radius - 36, 0);
      }

      ctx.restore();
    }
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius + 4, 0, TAU);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, TAU);
  ctx.fillStyle = '#111827';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 7;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 21px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PICK', 0, 0);

  ctx.restore();
  ctx.restore();
}
