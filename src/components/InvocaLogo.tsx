export default function InvocaLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-end ${className}`}>
      <svg viewBox="0 0 280 60" className="h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* INVOCA text */}
        <text
          x="0"
          y="48"
          className="fill-foreground"
          style={{
            fontSize: '52px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.02em',
          }}
        >
          INVOCA
        </text>
        {/* Green speech bubble - positioned at top right overlapping the A */}
        <g transform="translate(232, -2)">
          <path
            d="M8 2h24c3.3 0 6 2.7 6 6v14c0 3.3-2.7 6-6 6H20l-7 6v-6H8c-3.3 0-6-2.7-6-6V8c0-3.3 2.7-6 6-6z"
            fill="hsl(158, 42%, 52%)"
          />
        </g>
      </svg>
    </div>
  );
}
