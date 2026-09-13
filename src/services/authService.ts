import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { CitizenSession, LanguageCode } from '../types';

export type LoginMethod = 'mobile' | 'email';

function normalizeIndianPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  const local = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(local)) throw new Error('Enter a valid 10-digit Indian mobile number.');
  return `+91${local}`;
}

export async function sendCitizenLogin(
  method: LoginMethod,
  identifier: string,
  displayName: string,
  language: LanguageCode
): Promise<{ delivery: 'otp' | 'magic-link'; normalizedIdentifier: string }> {
  if (method === 'mobile') {
    const phone = normalizeIndianPhone(identifier);
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { data: { display_name: displayName, preferred_language: language } },
    });
    if (error) throw error;
    return { delivery: 'otp', normalizedIdentifier: phone };
  }

  const email = identifier.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
      data: { display_name: displayName, preferred_language: language },
    },
  });
  if (error) throw error;
  return { delivery: 'magic-link', normalizedIdentifier: email };
}

export async function verifyCitizenPhoneOtp(phone: string, token: string): Promise<CitizenSession> {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  if (error) throw error;
  if (!data.user) throw new Error('Unable to verify this login.');

  const session = await buildCitizenSession(data.user, 'mobile');
  if (!session) throw new Error('This account is not a citizen account.');
  return session;
}

export async function getCurrentCitizenSession(): Promise<CitizenSession | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return buildCitizenSession(user, user.phone ? 'mobile' : 'email');
}

async function buildCitizenSession(user: User, fallbackMethod: LoginMethod): Promise<CitizenSession | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('display_name, role, email, phone')
    .eq('id', user.id)
    .single();

  if (error || !profile || profile.role !== 'citizen') return null;
  const method: LoginMethod = user.phone ? 'mobile' : fallbackMethod;
  const identifier = profile.phone || profile.email || user.phone || user.email || '';

  return {
    displayName: profile.display_name || user.user_metadata?.display_name || 'Citizen',
    identifier,
    method,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Admin credentials are submitted only to the same-origin Express server. The
 * server maps ADMIN_LOGIN_ID to the single authorised Supabase admin email,
 * verifies the password with Supabase Auth, and returns a short-lived session.
 */
export async function signInAdminWithIdPassword(loginId: string, password: string): Promise<void> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: loginId.trim(), password }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'Admin sign-in failed.');
  if (!payload?.accessToken || !payload?.refreshToken) throw new Error('Admin session was not returned.');

  const { error } = await supabase.auth.setSession({
    access_token: payload.accessToken,
    refresh_token: payload.refreshToken,
  });
  if (error) throw error;

  const role = await getCurrentRole();
  if (role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('This account is not the authorised Nirnay AI administrator.');
  }
}

export async function getCurrentRole(): Promise<'citizen' | 'admin' | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (error || !data) return null;
  return data.role === 'admin' ? 'admin' : 'citizen';
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
