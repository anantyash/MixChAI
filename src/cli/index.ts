import { Command } from "commander";
import { registerAskCommand } from "./commands/ask.command";

const program = new Command();

program
  .name("mixchai")
  .description("CLI that synthesizes responses from multiple AI models.")
  .version("1.0.0");

registerAskCommand(program);

export function runCLI() {
  program.parse();
}
