export interface ElevenVoice {
  id: string;
  name: string;
  description: string;
}

export const ELEVEN_VOICES: ElevenVoice[] = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah',   description: 'Warm female, conversational' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura',   description: 'Friendly female, upbeat' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice',   description: 'British female, polished' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', description: 'Confident female, sales' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily',    description: 'Soft female, calm' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George',  description: 'British male, authoritative' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian',   description: 'American male, warm' },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric',    description: 'American male, conversational' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam',    description: 'American male, youthful' },
  { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris',   description: 'American male, casual' },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const cache = new Map<string, string>(); // key -> object URL

export async function fetchTtsUrl(text: string, voiceId: string): Promise<string> {
  const key = `${voiceId}::${text}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voiceId }),
  });
  if (!resp.ok) throw new Error(`TTS ${resp.status}: ${await resp.text()}`);
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  cache.set(key, url);
  return url;
}

// Back-compat helper (creates fresh Audio per call)
export async function speakWithElevenLabs(text: string, voiceId: string): Promise<HTMLAudioElement> {
  const url = await fetchTtsUrl(text, voiceId);
  return new Audio(url);
}
