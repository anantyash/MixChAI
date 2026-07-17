import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export class LoggerService {
  private readonly logDirectory = join(process.cwd(), "logs");
  private readonly logFile = join(this.logDirectory, "app.log");

  constructor() {
    if (!existsSync(this.logDirectory)) {
      mkdirSync(this.logDirectory);
    }
  }

  private write(level: string, message: string) {
    const time = new Date().toISOString();

    appendFileSync(this.logFile, `[${time}] [${level}] ${message}\n`);
  }

  info(message: string) {
    this.write("INFO", message);
  }

  warn(message: string) {
    this.write("WARN", message);
  }

  debug(message: string) {
    this.write("DEBUG", message);
  }

  error(message: string, error?: unknown) {
    let details = "";

    if (error instanceof Error) {
      details = `
Message : ${error.message}
Stack   :
${error.stack}
`;
    } else if (error) {
      details = String(error);
    }

    this.write("ERROR", `${message}\n${details}`);
  }
}
