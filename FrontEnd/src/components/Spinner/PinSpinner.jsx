import './PinSpinner.css'

export default function PinSpinner({ show = true, size = 320 }) {
  if (!show) return null

  return (
    <div className="pin-overlay" role="status" aria-live="polite">
      <svg
        width={size}
        height={size}
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient */}
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFE0" />
            <stop offset="45%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#7FB6FF" />
          </linearGradient>

          {/* Glow */}
          <filter id="glow-lg" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-md" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" result="m" />
            <feMerge>
              <feMergeNode in="m" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(160 160)">
          {/* OUTER ENERGY RING (thick segments) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="10s"
              repeatCount="indefinite"
            />
            <circle
              r="138"
              fill="none"
              stroke="url(#g1)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="90 40 30 60 140 40"
            />
            <circle
              r="138"
              fill="none"
              stroke="url(#g1)"
              strokeWidth="34"
              strokeOpacity="0.18"
              strokeDasharray="90 40 30 60 140 40"
              filter="url(#glow-lg)"
            />
          </g>

          {/* MID SCAN RING */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360"
              to="0"
              dur="14s"
              repeatCount="indefinite"
            />
            <circle
              r="112"
              fill="none"
              stroke="url(#g1)"
              strokeWidth="10"
              strokeDasharray="160 520"
              filter="url(#glow-md)"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.5;0.9;0.6"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* INNER STABILITY RING */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="22s"
              repeatCount="indefinite"
            />
            <circle
              r="86"
              fill="none"
              stroke="url(#g1)"
              strokeWidth="8"
              strokeOpacity="0.65"
            />
          </g>

          {/* CORE CHARGING */}
          <g>
            <circle r="10" fill="#E6FBFF">
              <animate
                attributeName="r"
                values="10;14;10"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>

            <circle
              r="22"
              fill="#00FFE0"
              opacity="0.9"
              filter="url(#glow-md)"
            >
              <animate
                attributeName="r"
                values="18;28;18"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>

            <circle
              r="38"
              fill="#00D2FF"
              opacity="0.15"
              filter="url(#glow-lg)"
            >
              <animate
                attributeName="opacity"
                values="0.05;0.25;0.05"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>
      </svg>
    </div>
  )
}
