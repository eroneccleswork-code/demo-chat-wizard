import invocaLogo from '@/assets/invoca-logo.png';

export default function InvocaLogo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 'h-10', md: 'h-20', lg: 'h-28' };
  return (
    <img
      src={invocaLogo}
      alt="Invoca"
      className={`${heights[size]} w-auto ${className}`}
    />
  );
}
