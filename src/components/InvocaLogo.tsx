import invocaLogo from '@/assets/invoca-logo.png';

export default function InvocaLogo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 'h-8', md: 'h-14', lg: 'h-20' };
  return (
    <img
      src={invocaLogo}
      alt="Invoca"
      className={`${heights[size]} w-auto ${className}`}
    />
  );
}
