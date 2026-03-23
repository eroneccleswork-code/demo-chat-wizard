import invocaLogo from '@/assets/invoca-logo.png';

export default function InvocaLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src={invocaLogo}
      alt="Invoca"
      className={`h-10 w-auto ${className}`}
    />
  );
}
