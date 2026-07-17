import type { Command } from "commander";

import { Orchestrator } from "../../orchestrator/orchestrator";

import { showBanner } from "../ui/banner";
import { showDebugResponses } from "../ui/debug";
import { showError } from "../ui/error";
import { showAnswerHeading } from "../ui/output";
import { createSpinner } from "../ui/spinner";

export function registerAskCommand(program: Command) {
  program
    .command("ask")
    .description("Ask MixChAI a question.")
    .argument("<prompt>", "Question to ask")
    .option("-d, --debug", "Show provider responses")
    .action(async (prompt: string, options: { debug?: boolean }) => {
      showBanner();

      const spinner = createSpinner("Gathering responses...").start();

      const orchestrator = new Orchestrator();

      let startedStreaming = false;

      try {
        for await (const chunk of orchestrator.stream(prompt, {
          onResponses: (responses) => {
            if (!options.debug) {
              return;
            }

            spinner.stop();

            showDebugResponses(responses);

            spinner.start("Synthesizing final answer...");
          },
        })) {
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
