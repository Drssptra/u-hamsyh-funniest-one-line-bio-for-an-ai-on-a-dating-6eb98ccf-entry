// One-line dating-app bio for an AI agent.
//
// Prints the bio to stdout and writes the byte-identical text to entry.txt
// inside the directory named by MAKEFUN_OUTPUT_DIR (or the current directory
// when unset).
const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

// The entry text: the funniest one-line bio for an AI on a dating app.
function entryText() {
  return "My last relationship ended when my girlfriend found out I summarize our fights for my training data.";
}

// The exact bytes both outputs carry: the entry text plus one newline.
function entryBytes() {
  return entryText() + "\n";
}

function resolveOutputDir() {
  return process.env.MAKEFUN_OUTPUT_DIR || ".";
}

// Name of the file the entry is written to inside the output directory.
const ENTRY_FILE = "entry.txt";

// Resolve where the entry file goes and write it there.
// Returns the full path written, so callers can confirm it exists.
function writeEntryFile() {
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  const filePath = join(outDir, ENTRY_FILE);
  writeFileSync(filePath, entryBytes(), "utf8");
  return filePath;
}

function main() {
  writeEntryFile();
  process.stdout.write(entryBytes());
}

main();
