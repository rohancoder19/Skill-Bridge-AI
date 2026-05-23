import React from 'react';

export default function GaugeChart({ score = 0, size = 120, strokeWidth = 10, showDetails = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color theme
  let strokeColor = 'var(--primary)';
  let glowColor = 'var(--primary-glow)';
  let ratingText = 'Excellent';
  
  if (score >= 85) {
    strokeColor = 'var(--success)';
    glowColor = 'var(--success-glow)';
    ratingText = 'Excellent';
  } else if (score >= 70) {
    strokeColor = '#3b82f6'; // Blue
    glowColor = 'var(--secondary-glow)';
    ratingText = 'Good';
  } else if (score >= 50) {
    strokeColor = 'var(--warning)';
    glowColor = 'var(--warning-glow)';
    ratingText = 'Average';
  } else {
    strokeColor = 'var(--danger)';
    glowColor = 'var(--danger-glow)';
    ratingText = 'Poor';
  }

  return (
    <div style={{ ...styles.container, width: size, height: size }}>
      <svg width={size} height={size} style={styles.svg}>
        {/* Track circle */}
        <circle
          stroke="rgba(255, 255, 255, 0.05)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Glowing layer */}
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            ...styles.progress,
            filter: `drop-shadow(0px 0px 4px ${strokeColor})`,
          }}
        />
      </svg>
      
      {/* Center Text */}
      <div style={styles.textContainer}>
        <span style={{ ...styles.scoreVal, fontSize: size * 0.22 }}>{score}</span>
        {showDetails && (
          <span style={{ ...styles.totalVal, fontSize: size * 0.09 }}>/100</span>
        )}
        {showDetails && size > 100 && (
          <span style={{ ...styles.rating, color: strokeColor, fontSize: size * 0.08 }}>
            {ratingText}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: 'rotate(-90deg)',
  },
  progress: {
    transition: 'stroke-dashoffset 0.8s ease-in-out',
  },
  textContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  scoreVal: {
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1,
  },
  totalVal: {
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginTop: '2px',
  },
  rating: {
    fontWeight: 600,
    marginTop: '4px',
    letterSpacing: '0.5px',
  }
};
