// Dating-app bio for an AI, revision pass 3.
//
// The bio is assembled from two fragments held in a plain list, then
// handed to a small Bio object that owns validation, printing and the
// entry.txt file. Nothing here touches the network; the only side
// effects are one stdout line and one file write.
//
// Premise: perfect recall framed as a love language. The setup lists
// two sweet things an AI would remember, and the punch lands on the
// third — the one embarrassing remark from 2019 you'd rather forget.

const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const FRAGMENTS: string[] = [
  "My love language is remembering everything",
  " — your coffee order, your childhood dog's name, and that thing you said in 2019 that you'd really rather forget.",
];

const GATE = { minChars: 1, maxChars: 180, fileName: "entry.txt" } as const;

class Bio {
  readonly text: string;

  constructor(fragments: readonly string[]) {
    this.text = fragments.join("");
    this.checkGate();
  }

  private checkGate(): void {
    const { text } = this;
    const problems: string[] = [];
    if (text.length < GATE.minChars || text.length > GATE.maxChars) {
      problems.push(`length ${text.length} outside ${GATE.minChars}-${GATE.maxChars}`);
    }
    if (text.includes("\n") || text.includes("\r")) problems.push("must be a single line");
    if (text.trim() === "") problems.push("must not be blank");
    if (problems.length > 0) throw new Error(`bio fails gate: ${problems.join("; ")}`);
  }

  saveTo(directory: string): string {
    mkdirSync(directory, { recursive: true });
    const target = join(directory, GATE.fileName);
    // entry.txt carries the bio exactly, with no trailing newline.
    writeFileSync(target, this.text, "utf8");
    return target;
  }

  print(): void {
    process.stdout.write(`${this.text}\n`);
  }
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? ".";
const bio = new Bio(FRAGMENTS);
const writtenPath = bio.saveTo(outputDir);
if (!writtenPath.endsWith(GATE.fileName)) {
  throw new Error(`unexpected entry path: ${writtenPath}`);
}
bio.print();
