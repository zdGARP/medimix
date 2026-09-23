import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabasePublishableKey || ''
);

/**
 * Dev connection test helper
 */
export async function testSupabaseConnection() {
  if (!supabaseUrl || !supabasePublishableKey) {
    console.warn('⚡ [Supabase] Skipping test: env variables missing.');
    return { success: false, reason: 'missing_env' };
  }

  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .limit(5);

    if (error) {
      console.warn('⚠️ [Supabase] Connection test returned error:', error.message);
      return { success: false, error };
    }

    console.log('✅ [Supabase] Connected successfully! Sample medicines catalog:', data);
    return { success: true, data };
  } catch (err) {
    console.warn('⚠️ [Supabase] Connection test failed:', err);
    return { success: false, error: err };
  }
}
