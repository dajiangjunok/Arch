import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import postcss from "postcss";

const root = process.cwd();
const assetDir = resolve(root, "public/reference");
const generatedDir = resolve(root, "app/_reference/generated");

const pages = [
  { id: "home", file: "arch-home-fix2.html" },
  { id: "week1", file: "arch-week1-fix2.html" },
  { id: "week2", file: "arch-week2-fix2.html" },
  { id: "week3", file: "arch-week3-fix2.html" },
];

const routes = {
  "arch-home-fix2.html": "/",
  "arch-week1-fix2.html": "/week1",
  "arch-week2-fix2.html": "/week2",
  "arch-week3-fix2.html": "/week3",
};

mkdirSync(assetDir, { recursive: true });
mkdirSync(generatedDir, { recursive: true });

function extractAssets(source) {
  return source.replace(
    /data:image\/([a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)/g,
    (_, type, encoded) => {
      const bytes = Buffer.from(encoded, "base64");
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
      const extension = type === "jpeg" ? "jpg" : type === "svg+xml" ? "svg" : type;
      const filename = `${hash}.${extension}`;
      writeFileSync(resolve(assetDir, filename), bytes);
      return `/reference/${filename}`;
    },
  );
}

function rewriteLinks(markup) {
  let result = markup;
  for (const [file, route] of Object.entries(routes)) {
    result = result.replaceAll(`href="${file}"`, `href="${route}"`);
  }

  result = result
    .replace(/href="mailto:business@globalpropeller\.com\?subject=[^"]*Fellowship[^"]*"/g, 'href="/apply?pass=full_residency"')
    .replace(/href="mailto:business@globalpropeller\.com\?subject=[^"]*(?:Application|Invitation|Founders|Investors|Executives|Institutions)[^"]*"/g, 'href="/apply?pass=single_week_pass"')
    .replace(/href="#" onclick="[^"]*"/g, 'href="#" data-dossier-placeholder="true"');

  return result;
}

function scopeCss(css, id) {
  const scope = `.arch-reference.arch-${id}`;
  const ast = postcss.parse(css);

  ast.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;

    rule.selectors = rule.selectors.map((selector) => {
      const trimmed = selector.trim();
      if (trimmed === ":root" || trimmed === "html" || trimmed === "body") return scope;
      if (trimmed.startsWith("body")) return trimmed.replace(/^body/, scope);
      if (trimmed.startsWith("html")) return trimmed.replace(/^html/, scope);
      return `${scope} ${trimmed}`;
    });
  });

  return ast.toString();
}

function readScriptValue(script, declaration) {
  const match = script.match(new RegExp(`const ${declaration} = ([\\s\\S]*?);\\n`));
  if (!match) return declaration === "DAYS" ? [] : {};
  return vm.runInNewContext(`(${match[1]})`, Object.create(null));
}

const generated = {};
const cssParts = [];

for (const page of pages) {
  const original = readFileSync(resolve(root, "example", page.file), "utf8");
  const withAssets = extractAssets(original);
  const style = withAssets.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  const script = withAssets.match(/<script>([\s\S]*?)<\/script>/)?.[1] || "";
  let body = withAssets.match(/<body[^>]*>([\s\S]*?)<script>/)?.[1];

  if (!style || !body) throw new Error(`Unable to parse ${page.file}`);

  body = body
    .replace(/<div class="scroll-progress"[^>]*><\/div>\s*/, "")
    .replace(/<div class="wrap">\s*<nav class="top">[\s\S]*?<\/nav>\s*<\/div>\s*/, "")
    .trim();

  generated[page.id] = {
    markup: rewriteLinks(body),
    days: readScriptValue(script, "DAYS"),
    chipDayMap: readScriptValue(script, "CHIP_DAY_MAP"),
  };
  cssParts.push(`/* ${page.file} */\n${scopeCss(style, page.id)}`);
}

const moduleSource = `// Generated from example/*.html by scripts/build-reference-pages.mjs.\n` +
  `export const referencePages = ${JSON.stringify(generated, null, 2)} as const;\n` +
  `export type ReferencePageId = keyof typeof referencePages;\n`;

writeFileSync(resolve(generatedDir, "reference-pages.ts"), moduleSource);
writeFileSync(
  resolve(root, "app/_reference/reference.css"),
  `${cssParts.join("\n\n")}\n\n` +
    `.arch-reference{min-height:100vh;background:#faf6ea;overflow-x:hidden;}\n` +
    `body:has(.arch-reference)::before{display:none;}\n` +
    `.arch-reference .auth-link{opacity:.72;}\n` +
    `.arch-reference .auth-link:hover{opacity:1;}\n` +
    `.arch-reference .desktop-auth{display:flex;align-items:center;gap:1.25rem}.arch-reference .auth-form{display:flex;}\n` +
    `.arch-reference .auth-button{border:0;border-bottom:1px solid transparent;background:transparent;color:inherit;padding:0;font:inherit;font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.62;}\n` +
    `.arch-reference .auth-button:hover{border-bottom-color:var(--marigold);opacity:1;}\n` +
    `@media(max-width:799px){.arch-reference nav.top{gap:1rem}.arch-reference .mobile-auth{display:flex;margin-left:auto;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--navy)}.arch-reference .desktop-auth{display:none}}\n` +
    `@media(min-width:800px){.arch-reference .mobile-auth{display:none}}\n`,
);

console.log(`Generated ${pages.length} pages in ${generatedDir}`);
