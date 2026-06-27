import fs from "fs";
import path from "path";

import { AsciiScaler } from "./ascii-scaler";

function loadAscii(filename: string): string {
  try {
    return fs.readFileSync(
      path.join(process.cwd(), "public", "ascii", filename),
      "utf8",
    );
  } catch {
    return "[ signal lost ]";
  }
}

export function AsciiBlock({ file = "hero.txt" }: { file?: string }) {
  const content = loadAscii(file);
  return <AsciiScaler content={content} />;
}
