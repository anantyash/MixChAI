import type { Command } from "commander";

import { Orchestrator } from "../../orchestrator/orchestrator";

import { showBanner } from "../ui/banner";
import { createSpinner } from "../ui/spinner";
import { showAnswerHeading } from "../ui/output";
import { showError } from "../ui/error";

export function registerAskCommand(program: Command) {
  program
    .command("ask")
    .description("Ask MixChAI a question.")
    .argument("<prompt>", "Question to ask")
    .action(async (prompt: string) => {
      showBanner();

      const spinner = createSpinner("Gathering responses...").start();

      const orchestrator = new Orchestrator();

      let startedStreaming = false;

      try {
        for await (const chunk of orchestrator.stream(prompt)) {
          if (!startedStreaming) {
            spinner.stop();

            showAnswerHeading();

            startedStreaming = true;
          }

          process.stdout.write(chunk);
        }

        console.log();
      } catch (error) {
        spinner.stop();

        showError(error);

        process.exitCode = 1;
      }
    });
}
