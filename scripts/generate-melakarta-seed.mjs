/**
 * Generates SQL seed for 72 Melakarta ragas.
 * Run: node scripts/generate-melakarta-seed.mjs > supabase/migrations/20260805300000_seed_melakartas.sql
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Inline minimal data — full list generated from melakartas-seed.ts at build time
const seedPath = join(__dirname, "../src/lib/data/melakartas-seed.ts");
const content = readFileSync(seedPath, "utf8");

// Extract the array using eval-like parsing (simple regex for the data)
const match = content.match(/export const MELAKARTA_SEED_DATA[^=]*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not parse melakarta seed data");
  process.exit(1);
}

const data = eval(match[1]);

let sql = `-- Seed all 72 Melakarta ragas\n\n`;
for (const m of data) {
  const meta = m.metadata ? JSON.stringify(m.metadata).replace(/'/g, "''") : null;
  const desc = (m.description || "").replace(/'/g, "''");
  sql += `insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)\n`;
  sql += `values (${m.number}, '${m.name.replace(/'/g, "''")}', '${m.chakra}', '${m.arohana}', '${m.avarohana}', '${desc}', ${meta ? `'${meta}'::jsonb` : "null"})\n`;
  sql += `on conflict (number) do update set\n`;
  sql += `  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,\n`;
  sql += `  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;\n\n`;
}

const outPath = join(__dirname, "../supabase/migrations/20260805300000_seed_melakartas.sql");
writeFileSync(outPath, sql);
console.log(`Written ${data.length} melakartas to ${outPath}`);
