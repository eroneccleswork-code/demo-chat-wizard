// Deepgram Aura TTS (filename kept for import compatibility)
export interface ElevenVoice {
  id: string;
  name: string;
  description: string;
}

export const ELEVEN_VOICES: ElevenVoice[] = [
  { id: 'aura-asteria-en', name: 'Asteria', description: 'Warm female, conversational (US)' },
  { id: 'aura-luna-en',    name: 'Luna',    description: 'Friendly female, polite (US)' },
  { id: 'aura-stella-en',  name: 'Stella',  description: 'Confident female (US)' },
  { id: 'aura-athena-en',  name: 'Athena',  description: 'Mature female (UK)' },
  { id: 'aura-hera-en',    name: 'Hera',    description: 'Business female (US)' },
  { id: 'aura-orion-en',   name: 'Orion',   description: 'Approachable male (US)' },
  { id: 'aura-arcas-en',   name: 'Arcas',   description: 'Natural male (US)' },
  { id: 'aura-perseus-en', name: 'Perseus', description: 'Confident male (US)' },
  { id: 'aura-angus-en',   name: 'Angus',   description: 'Friendly male (Ireland)' },
  { id: 'aura-helios-en',  name: 'Helios',  description: 'Upbeat male (UK)' },
  { id: 'aura-zeus-en',    name: 'Zeus',    description: 'Deep authoritative male (US)' },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const cache = new Map<string, string>();

export async function fetchTtsUrl(text: string, voiceId: string): Promise<string> {
  const key = `${voiceId}::${text}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/deepgram-tts`, {
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

export async function speakWithElevenLabs(text: string, voiceId: string): Promise<HTMLAudioElement> {
  const url = await fetchTtsUrl(text, voiceId);
  return new Audio(url);
}
