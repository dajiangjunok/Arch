const plainPaths = new Set(["/", "/account", "/partner", "/admin"]);
const ticketIds = new Set(["single_week", "two_weeks", "full_program"]);
const weekIds = new Set(["week_1", "week_2", "week_3"]);

export function safeAuthNext(value: string | null | undefined) {
  const rawValue = value || "";

  if (plainPaths.has(rawValue)) return rawValue;

  try {
    const url = new URL(rawValue, "http://auth.local");

    if (url.origin !== "http://auth.local" || url.pathname !== "/apply") {
      return "/";
    }

    const pass = url.searchParams.get("pass");
    const week = url.searchParams.get("week");
    const safeParams = new URLSearchParams();

    if (pass && ticketIds.has(pass)) safeParams.set("pass", pass);
    if (week && weekIds.has(week)) safeParams.set("week", week);

    const query = safeParams.toString();
    return query ? `/apply?${query}` : "/apply";
  } catch {
    return "/";
  }
}
