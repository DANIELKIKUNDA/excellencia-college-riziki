export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, anonKey, serviceRole };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = supabaseConfig();
  return Boolean(url && anonKey);
}
