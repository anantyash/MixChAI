# 🤖 MixChAI

MixChAI is a **CLI-based GenAI application** that implements the **Self-Consistency Technique** by orchestrating multiple Large Language Models (LLMs) in parallel and generating a single refined response.

Instead of relying on a single AI model, MixChAI sends the user's prompt to multiple models simultaneously, collects their responses, and then asks an evaluator model to synthesize the strongest ideas into one final answer.

## ✨ Features

- 🚀 CLI-based interface built with **Bun + TypeScript**
- ⚡ Parallel execution of multiple LLMs
- 🧠 Self-Consistency based answer synthesis
- 🌊 Streaming final response to the terminal
- 🔄 OpenAI Compatible architecture
- 🛡️ Runtime validation using Zod
- 🏗️ Clean Architecture with SOLID principles

<br><br>

# 🏗️ Project Architecture

```
User Prompt
      │
      ▼
  Orchestrator
      │
      ▼
Provider Factory
      │
      ▼
Multiple AI Providers (Parallel)
      │
      ▼
Collect Responses
      │
      ▼
Evaluator Model
      │
      ▼
Stream Final Answer
      │
      ▼
CLI
```

<br>

# 📁 Folder Structure

```
src/
│
├── cli/
│   ├── commands/
│   ├── ui/
│   └── index.ts
│
├── config/
│   ├── env.ts
│   ├── models.ts
│   └── providers.ts
│
├── models/
│   ├── llm-response.ts
│   └── provider-config.ts
│
├── orchestrator/
│   └── orchestrator.ts
│
├── prompts/
│   ├── evaluator.prompt.ts
│   └── evaluator.system-prompt.ts
│
├── providers/
│   ├── ai-provider.ts
│   ├── openai-compatible.provider.ts
│   └── provider.factory.ts
│
├── schemas/
│   └── ai-response.schema.ts
│
├── services/
│   └── evaluator.service.ts
│
└── index.ts
```

<br>

## 📂 Folder Overview

| Folder           | Responsibility                                                                  |
| ---------------- | ------------------------------------------------------------------------------- |
| **cli**          | Handles user interaction, commands, spinner, and terminal output.               |
| **config**       | Stores environment configuration, provider definitions, and available models.   |
| **models**       | Domain models and interfaces used throughout the application.                   |
| **orchestrator** | Coordinates the complete self-consistency workflow.                             |
| **prompts**      | Contains evaluator system prompt and prompt builders.                           |
| **providers**    | AI provider abstraction and implementations.                                    |
| **schemas**      | Runtime validation schemas for external API responses using Zod.                |
| **services**     | Business services such as the evaluator responsible for synthesizing responses. |
| **logs**         | Stores application logs for debugging                                           |

---

<br>
<br>

# ⚙️ Workflow

1. User enters a prompt.
2. The Orchestrator requests all providers from the Provider Factory.
3. Multiple AI models execute **in parallel**.
4. Responses are collected.
5. Failed responses are ignored.
6. Successful responses are sent to the Evaluator.
7. The Evaluator synthesizes a better answer.
8. The final answer is streamed directly to the terminal.

<br>
<br>

# 🧩 Design Patterns Used

## 1. Strategy Pattern

Different AI providers implement the same interface.

```
AIProvider
     ▲
     │
OpenAICompatibleProvider
```

This allows adding new providers without changing the Orchestrator.

## 2. Factory Pattern

The `ProviderFactory` is responsible for creating all provider instances from configuration.

Instead of manually creating providers throughout the application, all provider creation is centralized in one place.

## 3. Facade Pattern

The `Orchestrator` acts as the single entry point for the application's business logic.

The CLI doesn't know anything about:

- AI Providers
- Parallel execution
- Prompt construction
- Evaluation

It simply streams the final answer.

## 4. Dependency Injection

Dependencies such as the `EvaluatorService` are injected into the Orchestrator instead of being tightly coupled.

This improves maintainability and testability.

<br>

# 🛡️ Validation

MixChAI uses **Zod** to validate data crossing trust boundaries.

Currently validated:

- Environment Variables
- OpenAI Compatible API Responses

Internal domain models are validated using TypeScript.

<br>

# 📝 Logging

MixChAI includes a built-in file-based logging system to simplify debugging without cluttering the terminal.

The logger records:

- Application startup
- Provider requests
- Provider responses
- API latency
- Validation failures
- Provider failures
- Evaluator execution
- Unexpected errors

Logs are stored in:

`logs/app.log`

Example log output:

```
[2026-07-17T17:44:55.734Z] [INFO] Sending request to evaluator
[2026-07-17T17:44:55.741Z] [INFO] Starting orchestration
[2026-07-17T17:44:55.912Z] [INFO] Streaming evaluator response
[2026-07-17T17:44:55.913Z] [INFO] Executing providers in parallel
```

<br>

# 🐞 Debug Mode

MixChAI supports a debug mode for development.

Enable it using the `-d` (or `--debug`) flag:

```bash
bun run ask -d "Explain Quantum Computing"
```

or

```bash
bun run start ask -d "Explain Quantum Computing"
```

Debug mode enables verbose logging, including:

- Provider execution
- API latency
- Request lifecycle
- Evaluator activity
- Internal workflow events

<br>

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/anantyash/MixChAI
```

Move into the project

```bash
cd MixChAI
```

Install dependencies

```bash
bun install
```

<br>

# 🔑 Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

<br>

# ▶️ Running the Project

Start the CLI

```bash
bun run start ask "Explain Quantum Computing"
```

or

```bash
bun run ask "Highest Peak on Earth?"
```

Example

```bash
bun run ask "What is Artificial Intelligence?"
```

<br>

# 📦 Technologies Used

- Bun
- TypeScript
- Commander
- OpenAI SDK
- OpenRouter
- Gemini
- Chalk
- Ora
- Zod

<br>

# 🎯 Project Objective

The primary objective of MixChAI is to demonstrate the **Self-Consistency Technique** by leveraging multiple LLMs to improve answer quality.

Rather than trusting a single model, MixChAI:

- Executes multiple models concurrently.
- Compares their outputs.
- Uses an evaluator model to synthesize the strongest reasoning.
- Streams the final refined answer to the user.

This approach produces responses that are generally more robust and reliable than relying on a single model.

---
