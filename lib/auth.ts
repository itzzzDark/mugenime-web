import { createClient } from './supabase/server';

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile data from users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    role: userProfile?.role || 'user',
    full_name: userProfile?.full_name,
    avatar_url: userProfile?.avatar_url,
  };
}

export async function getUserRole(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  return data?.role || 'user';
}

export async function isAdmin(userId: string) {
  const role = await getUserRole(userId);
  return role === 'admin';
}

export async function isEditor(userId: string) {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'editor';
}

export async function isAdminOrEditor(userId: string) {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'editor';
}
