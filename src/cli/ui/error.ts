import chalk from "chalk";

export function showError(error: unknown) {
  if (error instanceof Error) {
    console.error(chalk.red(error.message));
    return;
  }

  console.error(chalk.red("Unknown error."));
}
