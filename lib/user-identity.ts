import type { User } from "@supabase/supabase-js";

function readMetadataString(metadata: User["user_metadata"] | undefined, keys: string[]) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

export function getUserIdentity(user: Pick<User, "email" | "user_metadata"> | null | undefined) {
  const email = user?.email?.trim().toLowerCase() || "";
  const name = readMetadataString(user?.user_metadata, ["full_name", "name", "display_name"]);
  const avatarUrl = readMetadataString(user?.user_metadata, ["avatar_url", "picture"]);
  const displayName = name || (email ? email.split("@")[0] : "Member");
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "M";

  return {
    displayName,
    email,
    avatarUrl,
    initials,
  };
}
