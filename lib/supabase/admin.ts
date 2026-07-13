import "server-only";

import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export function createSupabaseAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return createClient(getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"), secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
