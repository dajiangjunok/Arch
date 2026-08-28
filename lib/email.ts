const EMAIL_LOCAL_PART_PATTERN = /^[A-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/i;
const DOMAIN_LABEL_PATTERN = /^[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?$/i;
const TOP_LEVEL_DOMAIN_PATTERN = /^(?:[A-Z]{2,63}|XN--[A-Z0-9-]{2,59})$/i;

export function isValidEmailAddress(value: string) {
  if (!value || value.length > 254 || value !== value.trim()) return false;

  const atIndex = value.indexOf("@");
  if (atIndex <= 0 || atIndex !== value.lastIndexOf("@")) return false;

  const localPart = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);

  if (
    localPart.length > 64
    || localPart.startsWith(".")
    || localPart.endsWith(".")
    || localPart.includes("..")
    || !EMAIL_LOCAL_PART_PATTERN.test(localPart)
  ) {
    return false;
  }

  if (!domain || domain.length > 253 || domain.includes("..")) return false;

  const labels = domain.split(".");
  if (labels.length < 2 || labels.some((label) => !DOMAIN_LABEL_PATTERN.test(label))) return false;

  return TOP_LEVEL_DOMAIN_PATTERN.test(labels.at(-1) || "");
}
