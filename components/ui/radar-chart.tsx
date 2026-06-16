'use client';

import { useMemo } from 'react';

interface RadarDataPoint {
  label: string;
  value: number;
  max: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  className?: string;
}

export function RadarChart({ data, size = 220, className = '' }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const levels = 4;

  const angleStep = (Math.PI * 2) / data.length;

  const gridPolygons = useMemo(() => {
    return Array.from({ length: levels }, (_, level) => {
      const r = (radius / levels) * (level + 1);
      const points = data
        .map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        })
        .join(' ');
      return points;
    });
  }, [data, radius, cx, cy, angleStep]);

  const axes = useMemo(() => {
    return data.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const x2 = cx + radius * Math.cos(angle);
      const y2 = cy + radius * Math.sin(angle);
      return { x1: cx, y1: cy, x2, y2 };
    });
  }, [data, radius, cx, cy, angleStep]);

  const dataPolygon = useMemo(() => {
    return data
      .map((d, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const r = (d.value / d.max) * radius;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      })
      .join(' ');
  }, [data, radius, cx, cy, angleStep]);

  const labelPositions = useMemo(() => {
    return data.map((d, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const labelRadius = radius + 22;
      return {
        x: cx + labelRadius * Math.cos(angle),
        y: cy + labelRadius * Math.sin(angle),
        label: d.label,
        value: d.value.toFixed(1),
      };
    });
  }, [data, radius, cx, cy, angleStep]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="rgba(52,211,153,0.15)"
          strokeWidth={0.5}
        />
      ))}
      {axes.map((axis, i) => (
        <line key={i} {...axis} stroke="rgba(52,211,153,0.15)" strokeWidth={0.5} />
      ))}
      <polygon points={dataPolygon} fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.6)" strokeWidth={1.5} />
      {data.map((d, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const r = (d.value / d.max) * radius;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        return <circle key={i} cx={px} cy={py} r={3} fill="rgba(52,211,153,0.9)" />;
      })}
      {labelPositions.map((pos, i) => (
        <text
          key={i}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-emerald-500"
          fontSize={9}
          fontFamily="monospace"
        >
          {pos.label}
        </text>
      ))}
    </svg>
  );
}
