'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const USER_MAP: Record<string, string> = {
  cesarmensajero: 'cesar@elmensajero.com',
  lauramensajera: 'laura@elmensajero.com',
};
const ALLOWED_EMAILS = ['cesar@elmensajero.com', 'laura@elmensajero.com'];

export async function login(formData: FormData) {
  const supabase = await createClient();

  let email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const normalized = (email || '').toLowerCase().trim();
  if (USER_MAP[normalized]) {
    email = USER_MAP[normalized];
  }

  // Verify email belongs to allowed editors
  if (!ALLOWED_EMAILS.includes(email)) {
    redirect('/revision/login?error=unauthorized');
    return;
  }

  // Verify password matches secret
  const validPassword = process.env.EDITOR_PASSWORD;
  if (!validPassword || password !== validPassword) {
    redirect('/revision/login?error=invalid_password');
    return;
  }

  // Try to sign in with Supabase
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // If sign-in fails, provide error
    redirect('/revision/login?error=true');
    return;
  }

  if (error || !data.session) {
    redirect('/revision/login?error=true')
    return
  }

  // Supabase session cookie is now set; revalidate layout and go to editor panel
  revalidatePath('/', 'layout')
  redirect('/revision/newsroom')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const emailInput = formData.get('email') as string
  const password = formData.get('password') as string

  // Map allowed short usernames to real emails (same as login)
  const userMap: Record<string, string> = {
    cesarmensajero: 'cesar@elmensajero.com',
    lauramensajera: 'laura@elmensajero.com',
  }
  const normalized = (emailInput || '').toLowerCase().trim()
  const email = userMap[normalized] || emailInput

  // Verify allowed editors
  const allowedEmails = ['cesar@elmensajero.com', 'laura@elmensajero.com']
  if (!allowedEmails.includes(email)) {
    redirect('/revision/login?error=unauthorized_email')
    return
  }

  // Password must match the secret (same as login)
  const validPassword = process.env.EDITOR_PASSWORD
  if (!validPassword || password !== validPassword) {
    redirect('/revision/login?error=invalid_password')
    return
  }

  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    redirect('/revision/login?error=true')
    return
  }

  revalidatePath('/', 'layout')
  redirect('/revision')
}
