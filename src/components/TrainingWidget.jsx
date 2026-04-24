const TRAINING_DATA = {
  goal: 'UTMB — Ultra-Trail du Mont-Blanc',
  raceDate: 'Aug 2027',
  distance: '171 km · 10,000 m D+',
  stravaUrl: 'https://www.strava.com/athletes/rob-walsh',
  stats: {
    weeklyKm: 68,
    targetWeeklyKm: 90,
    weeklyElevation: 2840,
    longestTrail: 38,
    totalThisYear: 612,
  },
  recentRuns: [
    { day: 'Tue', name: 'Hill reps', km: 12.4, pace: '6:10' },
    { day: 'Thu', name: 'Alpine simulation', km: 18.6, pace: '7:20' },
    { day: 'Sat', name: 'Mountain long run', km: 38, pace: '7:45' },
  ],
}

function MountainScene() {
  const stars = [
    [38,10],[85,6],[128,18],[196,4],[242,16],[288,9],[352,5],[402,14],
    [440,8],[68,28],[158,12],[318,20],[458,26],[18,22],[178,32],[258,7],
    [378,18],[110,15],[480-30,35],[30,40],
  ]
  return (
    <svg
      className="mountain-scene"
      viewBox="0 0 520 160"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060610" />
          <stop offset="60%" stopColor="#14082a" />
          <stop offset="100%" stopColor="#1f0c18" />
        </linearGradient>
        <radialGradient id="mt-glow" cx="62%" cy="40%" r="35%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a55" />
          <stop offset="100%" stopColor="#120f30" />
        </linearGradient>
        <linearGradient id="mt-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1538" />
          <stop offset="100%" stopColor="#0e0c20" />
        </linearGradient>
        <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111122" />
          <stop offset="100%" stopColor="#08080f" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="520" height="160" fill="url(#mt-sky)" />

      {/* Amber horizon glow */}
      <ellipse cx="323" cy="58" rx="140" ry="70" fill="url(#mt-glow)" />

      {/* Stars */}
      {stars.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y}
          r={i % 4 === 0 ? 1.3 : i % 3 === 0 ? 1 : 0.7}
          fill="#fff"
          opacity={0.25 + (i % 5) * 0.08}
        />
      ))}

      {/* Far peaks */}
      <path
        d="M0,105 L45,65 L72,80 L108,42 L145,68 L178,36 L212,58 L250,26 L285,52 L318,20 L352,46 L388,32 L420,55 L455,40 L490,62 L520,68 L520,160 L0,160 Z"
        fill="url(#mt-far)"
      />
      {/* Snow on far peaks */}
      <path d="M250,26 L262,40 L270,35 L280,52 L266,44 L254,48 Z" fill="rgba(255,255,255,0.1)" />
      <path d="M318,20 L330,34 L338,29 L350,46 L334,38 L322,42 Z" fill="rgba(255,255,255,0.09)" />
      <path d="M178,36 L188,49 L196,44 L210,58 L195,51 L183,55 Z" fill="rgba(255,255,255,0.07)" />

      {/* Amber ridge glow */}
      <path
        d="M178,36 L212,58 L250,26 L285,52 L318,20 L352,46"
        fill="none"
        stroke="rgba(245,158,11,0.18)"
        strokeWidth="1.5"
      />

      {/* Mid range */}
      <path
        d="M0,135 L35,108 L70,122 L100,90 L132,112 L165,78 L195,100 L228,68 L258,92 L290,76 L322,98 L358,82 L392,104 L424,86 L458,108 L490,94 L520,100 L520,160 L0,160 Z"
        fill="url(#mt-mid)"
      />

      {/* Near foreground */}
      <path
        d="M0,155 L55,130 L92,145 L128,118 L164,136 L200,120 L238,142 L274,126 L314,148 L348,130 L384,152 L424,136 L460,150 L520,140 L520,160 L0,160 Z"
        fill="url(#mt-near)"
      />

      {/* Trail path */}
      <path
        d="M128,118 L143,126 L154,120 L164,136"
        fill="none"
        stroke="rgba(245,158,11,0.4)"
        strokeWidth="1.2"
        strokeDasharray="2.5,2"
      />

      {/* Runner silhouette */}
      <g transform="translate(145,117)" opacity="0.85">
        <circle cx="2.5" cy="-5" r="1.6" fill="#f59e0b" />
        <line x1="2.5" y1="-3.4" x2="2.5" y2="0.5" stroke="#f59e0b" strokeWidth="1.1" />
        <line x1="2.5" y1="-1.5" x2="0.2" y2="0.8" stroke="#f59e0b" strokeWidth="0.9" />
        <line x1="2.5" y1="-1.5" x2="4.8" y2="0.8" stroke="#f59e0b" strokeWidth="0.9" />
        <line x1="2.5" y1="0.5" x2="1" y2="3.5" stroke="#f59e0b" strokeWidth="1" />
        <line x1="2.5" y1="0.5" x2="4.5" y2="3.2" stroke="#f59e0b" strokeWidth="1" />
      </g>

      {/* Mont Blanc label */}
      <text x="318" y="15" fontSize="7" fill="rgba(245,158,11,0.5)" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">MONT BLANC</text>
      <line x1="318" y1="19" x2="318" y2="20" stroke="rgba(245,158,11,0.3)" strokeWidth="0.8" />
    </svg>
  )
}

function ElevationBar({ current, target }) {
  const pct = Math.min(100, Math.round((current / target) * 100))
  return (
    <div className="training-progress">
      <div className="training-progress-labels">
        <span>Weekly volume</span>
        <span>{current} / {target} km</span>
      </div>
      <div className="training-bar" role="progressbar" aria-valuenow={pct} aria-valuemax={100}>
        <div className="training-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function TrainingWidget() {
  const { goal, raceDate, distance, stravaUrl, stats, recentRuns } = TRAINING_DATA
  const { weeklyKm, targetWeeklyKm, weeklyElevation, longestTrail, totalThisYear } = stats

  return (
    <div className="training-widget">
      <MountainScene />

      <div className="training-header">
        <div className="training-goal-block">
          <span className="training-eyebrow">Training for</span>
          <strong className="training-goal-name">{goal}</strong>
          <span className="training-race-date">{raceDate} · {distance}</span>
        </div>
        <a
          href={stravaUrl}
          target="_blank"
          rel="noreferrer"
          className="strava-badge"
          aria-label="View on Strava"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
          Strava
        </a>
      </div>

      <div className="training-stats">
        <div className="training-stat">
          <strong>{weeklyKm}km</strong>
          <span>This week</span>
        </div>
        <div className="training-stat">
          <strong>{weeklyElevation}m</strong>
          <span>Elevation</span>
        </div>
        <div className="training-stat">
          <strong>{longestTrail}km</strong>
          <span>Longest trail</span>
        </div>
        <div className="training-stat">
          <strong>{totalThisYear}km</strong>
          <span>This year</span>
        </div>
      </div>

      <ElevationBar current={weeklyKm} target={targetWeeklyKm} />

      <div className="training-runs">
        {recentRuns.map((run) => (
          <div key={run.day} className="training-run">
            <span className="run-day">{run.day}</span>
            <span className="run-name">{run.name}</span>
            <span className="run-km">{run.km}km</span>
            <span className="run-pace">{run.pace}/km</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainingWidget
