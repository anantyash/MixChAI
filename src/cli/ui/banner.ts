import chalk from "chalk";

export function showBanner() {
  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════╗
║          🤖 MixChAI          ║
╚══════════════════════════════╝
`),
  );
}
