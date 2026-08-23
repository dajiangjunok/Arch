const zeroDecimalCurrencies = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

function currencyDecimals(currency: string) {
  return zeroDecimalCurrencies.has(currency.toLowerCase()) ? 0 : 2;
}

export function parseMoneyInput(value: string, currency: string) {
  const normalized = value.trim();
  const decimals = currencyDecimals(currency);
  const pattern = decimals === 0 ? /^\d+$/ : /^\d+(?:\.\d{1,2})?$/;

  if (!pattern.test(normalized)) return null;

  const [whole, fraction = ""] = normalized.split(".");
  const factor = 10 ** decimals;
  const amount = Number(whole) * factor + Number(fraction.padEnd(decimals, "0") || 0);

  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

export function moneyInputValue(amount: number, currency: string) {
  const decimals = currencyDecimals(currency);
  return (amount / 10 ** decimals).toFixed(decimals);
}

export function moneyInputStep(currency: string) {
  return currencyDecimals(currency) === 0 ? "1" : "0.01";
}
