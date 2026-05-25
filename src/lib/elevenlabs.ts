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

import { supabase } from '@/integrations/supabase/client';

const cache = new Map<string, string>(); // key -> object URL

export async function speakWithElevenLabs(text: string, voiceId: string): Promise<HTMLAudioElement> {
  const key = `${voiceId}::${text}`;
  let url = cache.get(key);
  if (!url) {
    const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
      body: { text, voiceId },
    });
    if (error) throw error;
    // supabase-js returns the binary body as a Blob for non-JSON responses
    const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: 'audio/mpeg' });
    url = URL.createObjectURL(blob);
    cache.set(key, url);
  }
  const audio = new Audio(url);
  return audio;
}
