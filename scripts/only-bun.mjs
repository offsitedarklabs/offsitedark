// Enforces Bun as the only package manager for this project.
// Runs via the `preinstall` lifecycle hook, which npm, pnpm, yarn, and bun
// all execute before installing.
const ua = process.env.npm_config_user_agent || "";

if (!ua.startsWith("bun")) {
  const tool = ua.split("/")[0] || "this tool";

  console.error(
    `\n\x1b[31m✖ This project uses Bun. Install with \x1b[1mbun install\x1b[0m\x1b[31m.\x1b[0m\n` +
      `  Detected: ${tool}. Don't use npm, pnpm, or yarn here.\n` +
      `  Install Bun: https://bun.com/docs/installation\n`,
  );

  process.exit(1);
}
