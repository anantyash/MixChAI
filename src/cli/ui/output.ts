import chalk from "chalk";

export function showAnswerHeading() {
  console.log();
  console.log(chalk.green.bold("Final Answer"));
  console.log(chalk.gray("──────────────────────────────"));
  console.log();
}
