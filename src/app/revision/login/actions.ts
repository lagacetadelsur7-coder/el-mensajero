'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient();

  let email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Map allowed usernames to their email addresses
  const userMap: Record<string, string> = {
    cesarmensajero: 'cesar@elmensajero.com',
    lauramensajera: 'laura@elmensajero.com',
  };
  const normalized = (email || '').toLowerCase().trim();
  if (userMap[normalized]) {
    email = userMap[normalized];
  }

  // Verify email belongs to allowed editors
  const allowedEmails = ['cesar@elmensajero.com', 'laura@elmensajero.com'];
  if (!allowedEmails.includes(email)) {
    redirect('/revision/login?error=unauthorized');
    return;
  }

  // Validate password against environment variable
  const validPassword = process.env.EDITOR_PASSWORD;
  if (!validPassword || password !== validPassword) {
    redirect('/revision/login?error=invalid_password');
    return;
  }

  // Attempt authentication with Supabase
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect('/revision/login?error=true');
    return;
  }

  revalidatePath('/', 'layout');
  redirect('/revision');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // No secret code required for registration; rely on server‑side controls if needed.
  const emailInput = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Map allowed usernames to official emails
  const userMap: Record<string, string> = {
    cesarmensajero: 'cesar@elmensajero.com',
    lauramensajera: 'laura@elmensajero.com',
  };
  const normalized = (emailInput || '').toLowerCase().trim();
  const email = userMap[normalized] || emailInput;

  // Validate that the email belongs to an allowed editor
  const allowedEmails = [
    'cesar@elmensajero.com',
    'laura@elmensajero.com',
  ];
  const normalizedEmail = (email || '').toLowerCase();
  if (!allowedEmails.includes(normalizedEmail)) {
    redirect('/revision/login?error=unauthorized_email');
    return;
  }

  // Validate password against environment variable
  const validPassword = process.env.EDITOR_PASSWORD;
  if (!validPassword || password !== validPassword) {
    redirect('/revision/login?error=invalid_password');
    return;
  }

  // Attempt registration with Supabase
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect('/revision/login?error=true');
    return;
  }

  revalidatePath('/', 'layout');
  redirect('/revision');
}
