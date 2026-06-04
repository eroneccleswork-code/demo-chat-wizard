import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const SALEO_URL = 'https://tour-viewer.platform.saleo.io/734d3a34-4fdc-4c57-8e51-f6f46585a2cd';

export default function InvocaSaleoTour() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        src={SALEO_URL}
        title="Invoca Platform"
        className="w-full h-full border-0"
        allow="fullscreen"
      />
      <button
        onClick={() => navigate('/')}
        className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm"
        title="Exit"
        aria-label="Exit demo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
