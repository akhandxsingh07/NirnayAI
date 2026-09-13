import type { LanguageCode } from '../types';
import { supabase } from '../lib/supabase';

export type VoiceAudioResult = {
  blob: Blob;
  engine: 'gemini-tts';
};

export async function requestNirnayVoice(
  text: string,
  language: LanguageCode
): Promise<VoiceAudioResult | null> {
  const cleanText = text.trim();
  if (!cleanText) return null;

  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        text: cleanText.slice(0, 4200),
        language,
      }),
    });

    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('audio/')) return null;

    return {
      blob: await response.blob(),
      engine: 'gemini-tts',
    };
  } catch {
    return null;
  }
}
