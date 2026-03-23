export default function InvocaLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <span className="text-foreground font-black tracking-tight text-3xl" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        INVOCA
      </span>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="-mt-3">
        <path
          d="M6 4h20a4 4 0 014 4v12a4 4 0 01-4 4H14l-6 5v-5H6a4 4 0 01-4-4V8a4 4 0 014-4z"
          fill="hsl(160, 45%, 55%)"
        />
      </svg>
    </div>
  );
}
