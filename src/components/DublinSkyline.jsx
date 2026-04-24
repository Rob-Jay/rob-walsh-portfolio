export default function DublinSkyline() {
  const stars = [
    [20,8],[58,13],[94,5],[138,17],[183,7],[228,21],[272,11],
    [318,6],[362,19],[408,9],[453,4],[488,15],[508,23],
    [30,26],[108,31],[198,9],[288,25],[378,13],[478,29],
  ]

  const windowLights = [
    [36,88],[36,99],[108,78],[108,89],[163,74],[198,84],[198,95],
    [298,70],[298,81],[338,79],[338,90],[398,77],[398,88],[448,81],
    [118,107],[153,104],[298,109],[328,107],[363,105],
  ]

  return (
    <svg
      className="dublin-scene"
      viewBox="0 0 520 160"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dub-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#07060f" />
          <stop offset="65%" stopColor="#120c28" />
          <stop offset="100%" stopColor="#1e0f2a" />
        </linearGradient>
        <radialGradient id="dub-city-glow" cx="50%" cy="60%" r="45%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.11" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spire-halo" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bld-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1740" />
          <stop offset="100%" stopColor="#0e0b22" />
        </linearGradient>
        <linearGradient id="bld-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#131130" />
          <stop offset="100%" stopColor="#08080f" />
        </linearGradient>
        <linearGradient id="dub-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f2e" />
          <stop offset="100%" stopColor="#060810" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="520" height="160" fill="url(#dub-sky)" />

      {/* Ambient city glow */}
      <ellipse cx="260" cy="90" rx="210" ry="85" fill="url(#dub-city-glow)" />

      {/* Stars */}
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.2 : 0.7}
          fill="#fff" opacity={0.18 + (i % 5) * 0.07} />
      ))}

      {/* Far buildings — left cluster */}
      <rect x="0"   y="82"  width="30" height="50" fill="url(#bld-far)" />
      <rect x="32"  y="70"  width="24" height="62" fill="url(#bld-far)" />
      <rect x="58"  y="77"  width="20" height="55" fill="url(#bld-far)" />
      <rect x="80"  y="64"  width="22" height="68" fill="url(#bld-far)" />

      {/* Custom House — wider Georgian block with pediment */}
      <rect    x="104" y="72"  width="50" height="60" fill="url(#bld-far)" />
      <polygon points="104,72 154,72 129,56" fill="url(#bld-far)" />
      <ellipse cx="129" cy="56" rx="10" ry="7" fill="#1e1a42" />

      {/* Mid-left */}
      <rect x="157" y="80"  width="24" height="52" fill="url(#bld-far)" />
      <rect x="184" y="67"  width="18" height="65" fill="url(#bld-far)" />

      {/* The Spire — focal point */}
      <ellipse cx="260" cy="50" rx="14" ry="34" fill="url(#spire-halo)" opacity="0.55" />
      {/* Wide base */}
      <polygon points="254,130 266,130 262,18 258,18" fill="#1c1840" />
      {/* Bright needle */}
      <polygon points="258.8,130 261.2,130 260.2,13 259.8,13" fill="#fbbf24" opacity="0.9" />
      {/* Tip */}
      <circle cx="260" cy="12" r="2" fill="#fff" opacity="0.95" />

      {/* Mid-right */}
      <rect x="274" y="75"  width="20" height="57" fill="url(#bld-far)" />
      <rect x="296" y="62"  width="28" height="70" fill="url(#bld-far)" />

      {/* Convention Centre — rotunda suggestion */}
      <rect    x="328" y="70"  width="42" height="62" fill="url(#bld-far)" />
      <ellipse cx="349" cy="70" rx="21" ry="12" fill="#16122e" />

      {/* Right cluster */}
      <rect x="372" y="78"  width="22" height="54" fill="url(#bld-far)" />
      <rect x="396" y="67"  width="26" height="65" fill="url(#bld-far)" />
      <rect x="424" y="80"  width="20" height="52" fill="url(#bld-far)" />
      <rect x="446" y="71"  width="30" height="61" fill="url(#bld-far)" />
      <rect x="480" y="77"  width="18" height="55" fill="url(#bld-far)" />
      <rect x="500" y="64"  width="20" height="68" fill="url(#bld-far)" />

      {/* Near foreground buildings */}
      <rect x="0"   y="108" width="40" height="52" fill="url(#bld-near)" />
      <rect x="42"  y="98"  width="34" height="62" fill="url(#bld-near)" />
      <rect x="78"  y="112" width="28" height="48" fill="url(#bld-near)" />
      <rect x="108" y="100" width="32" height="60" fill="url(#bld-near)" />
      <rect x="142" y="116" width="24" height="44" fill="url(#bld-near)" />
      <rect x="168" y="104" width="30" height="56" fill="url(#bld-near)" />
      <rect x="200" y="118" width="22" height="42" fill="url(#bld-near)" />
      <rect x="228" y="110" width="20" height="50" fill="url(#bld-near)" />
      <rect x="270" y="112" width="22" height="48" fill="url(#bld-near)" />
      <rect x="294" y="102" width="30" height="58" fill="url(#bld-near)" />
      <rect x="326" y="116" width="28" height="44" fill="url(#bld-near)" />
      <rect x="356" y="100" width="36" height="60" fill="url(#bld-near)" />
      <rect x="394" y="108" width="26" height="52" fill="url(#bld-near)" />
      <rect x="422" y="98"  width="30" height="62" fill="url(#bld-near)" />
      <rect x="454" y="112" width="26" height="48" fill="url(#bld-near)" />
      <rect x="482" y="104" width="38" height="56" fill="url(#bld-near)" />

      {/* River Liffey */}
      <rect x="0" y="130" width="520" height="30" fill="url(#dub-river)" />

      {/* Ha'penny Bridge arch */}
      <path d="M172,130 Q218,108 264,130"
        fill="none" stroke="rgba(245,158,11,0.38)" strokeWidth="1.6" />
      {[184,196,208,220,232,244,256].map((x, i) => {
        const t = (x - 172) / 92
        const archY = 130 - Math.sin(t * Math.PI) * 22
        return <line key={i} x1={x} y1="130" x2={x} y2={archY}
          stroke="rgba(245,158,11,0.18)" strokeWidth="0.8" />
      })}

      {/* Spire reflection in river */}
      <line x1="260" y1="130" x2="260" y2="156"
        stroke="rgba(251,191,36,0.18)" strokeWidth="1.2" />

      {/* River shimmer lines */}
      <line x1="60"  y1="138" x2="160" y2="138" stroke="rgba(245,158,11,0.05)" strokeWidth="0.8" />
      <line x1="290" y1="136" x2="400" y2="136" stroke="rgba(245,158,11,0.06)" strokeWidth="1" />
      <line x1="420" y1="142" x2="500" y2="142" stroke="rgba(245,158,11,0.04)" strokeWidth="0.8" />

      {/* Window lights */}
      {windowLights.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="3" height="2"
          fill="rgba(245,158,11,0.38)" rx="0.5" />
      ))}

      {/* Label */}
      <text x="10" y="148" fontSize="7" fill="rgba(245,158,11,0.4)"
        fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">DUBLIN</text>
    </svg>
  )
}
