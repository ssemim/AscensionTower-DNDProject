import './PinSpinner.css'

export default function PinSpinner({ show = true, size = 320 }){
  if(!show) return null

  const s = size
  return (
    <div className="pin-overlay" role="status" aria-live="polite">
      <svg className="pin-svg" width={s} height={s} viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#00FFE0" />
            <stop offset="40%" stopColor="#00D2FF" />
            <stop offset="70%" stopColor="#3AC0FF" />
            <stop offset="100%" stopColor="#7FB6FF" />
          </linearGradient>

          <filter id="blurGlow-lg" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="blurGlow-md" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="m" />
            <feMerge>
              <feMergeNode in="m" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="rings" transform="translate(160,160)">
          <g className="ring ring--a">
            <circle className="stroke base" r="136" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="10" strokeLinecap="round" />
            <circle className="stroke glow" r="136" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="20" strokeOpacity="0.18" filter="url(#blurGlow-lg)" />
          </g>

          <g className="ring ring--b">
            <circle className="stroke base" r="112" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="8" strokeLinecap="round" />
            <circle className="stroke glow" r="112" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="14" strokeOpacity="0.2" filter="url(#blurGlow-md)" />
          </g>

          <g className="ring ring--c">
            <circle className="stroke" r="86" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="7" strokeLinecap="round" />
          </g>

          <g className="ring ring--d">
            <circle className="stroke" r="60" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="6" strokeLinecap="round" />
          </g>

          <g className="ring ring--e">
            <circle className="stroke" r="36" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="5" strokeLinecap="round" />
          </g>

          <g className="ring ring--f">
            <circle className="stroke" r="18" cx="0" cy="0" fill="none" stroke="url(#g1)" strokeWidth="4" strokeLinecap="round" />
          </g>

          <g className="center-dot">
            <circle r="6" fill="#E6FBFF" />
            <circle r="10" fill="#00FFE0" style={{filter: 'url(#blurGlow-md)', opacity:0.95}} />
            <circle r="18" fill="#00D2FF" style={{filter: 'url(#blurGlow-lg)', opacity:0.18}} />
          </g>
        </g>
      </svg>
    </div>
  )
}
