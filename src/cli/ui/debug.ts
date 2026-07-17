import chalk from "chalk";

import type { LLMResponse } from "../../models/llm-response";

export function showDebugResponses(responses: LLMResponse[]): void {
  console.log();
  console.log(chalk.yellow.bold("=== Provider Responses ==="));
  console.log();

  if (responses.length === 0) {
    console.log(chalk.red("No provider responses were received."));
    console.log();
    return;
  }

  for (const response of responses) {
    const title = `${response.provider} • ${response.model}`;

    if (response.error) {
      console.log(chalk.red(`✗ ${title}`));

      if (response.latency > 0) {
        console.log(chalk.gray(`Latency: ${response.latency} ms`));
      }

      console.log(chalk.red(`Error: ${response.error}`));

      console.log();
      console.log(chalk.gray("--------------------------------------------"));
      console.log();

      continue;
    }

    console.log(chalk.green(`✓ ${title}`));
    console.log(chalk.gray(`Latency: ${response.latency} ms`));

    console.log();
    console.log(response.content.trim());

    console.log();
    console.log(chalk.gray("--------------------------------------------"));
    console.log();
  }
}
