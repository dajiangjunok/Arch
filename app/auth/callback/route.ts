import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeAuthNext } from "@/lib/auth-redirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeAuthNext(url.searchParams.get("next"));
  const authError = url.searchParams.get("error_description") || url.searchParams.get("error");

  if (authError) {
    const query = new URLSearchParams({ error: authError, next });
    return NextResponse.redirect(new URL(`/login?${query.toString()}`, url.origin));
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }

    const query = new URLSearchParams({ error: error.message, next });
    return NextResponse.redirect(new URL(`/login?${query.toString()}`, url.origin));
  }

  const query = new URLSearchParams({ error: "Google sign-in could not be completed.", next });
  return NextResponse.redirect(new URL(`/login?${query.toString()}`, url.origin));
}
