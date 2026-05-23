import React from 'react';

export default function RadarChart({ data = [], size = 300, maxVal = 100 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const N = data.length;
  
  if (N < 3) return null; // Needs at least 3 points for a polygon

  // 1. Helper to calculate coordinates
  const getCoordinates = (index, value) => {
    const angle = (index * 2 * Math.PI) / N - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // 2. Generate Grid Polygons (at 25%, 50%, 75%, 100% of maxVal)
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map(level => {
    const points = [];
    for (let i = 0; i < N; i++) {
      const { x, y } = getCoordinates(i, level);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  });

  // 3. Generate User Data Polygon
  const userPoints = [];
  for (let i = 0; i < N; i++) {
    const { x, y } = getCoordinates(i, data[i].value);
    userPoints.push(`${x},${y}`);
  }
  const userPolygonString = userPoints.join(' ');

  // 4. Generate Axis Lines and Text Labels
  const axes = [];
  for (let i = 0; i < N; i++) {
    const outerPoint = getCoordinates(i, maxVal);
    const labelPoint = getCoordinates(i, maxVal * 1.2); // Push text further out
    
    // Adjust label position for alignment
    let textAnchor = 'middle';
    if (labelPoint.x > cx + 10) textAnchor = 'start';
    if (labelPoint.x < cx - 10) textAnchor = 'end';

    axes.push({
      line: { x1: cx, y1: cy, x2: outerPoint.x, y2: outerPoint.y },
      label: {
        x: labelPoint.x,
        y: labelPoint.y + 4, // minor offset
        text: data[i].label,
        value: data[i].value,
        textAnchor
      }
    });
  }

  return (
    <div style={styles.container}>
      <svg width={size} height={size}>
        {/* Grid levels */}
        {gridPolygons.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Center to corner axis lines */}
        {axes.map((axis, idx) => (
          <line
            key={idx}
            x1={axis.line.x1}
            y1={axis.line.y1}
            x2={axis.line.x2}
            y2={axis.line.y2}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}

        {/* Shaded Area Polygon (User Score) */}
        <polygon
          points={userPolygonString}
          fill="rgba(99, 102, 241, 0.25)"
          stroke="var(--primary)"
          strokeWidth="2.5"
          filter="drop-shadow(0px 0px 6px rgba(99, 102, 241, 0.6))"
        />

        {/* Data points dots */}
        {data.map((item, idx) => {
          const { x, y } = getCoordinates(idx, item.value);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4"
              fill="#fff"
              stroke="var(--primary)"
              strokeWidth="2"
            />
          );
        })}

        {/* Text Labels */}
        {axes.map((axis, idx) => (
          <g key={idx}>
            <text
              x={axis.label.x}
              y={axis.label.y - 6}
              textAnchor={axis.label.textAnchor}
              fill="var(--text-muted)"
              style={styles.labelText}
            >
              {axis.label.text}
            </text>
            <text
              x={axis.label.x}
              y={axis.label.y + 6}
              textAnchor={axis.label.textAnchor}
              fill="#fff"
              style={styles.labelVal}
            >
              {axis.label.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0',
  },
  labelText: {
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
  },
  labelVal: {
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'Outfit, sans-serif',
  }
};
