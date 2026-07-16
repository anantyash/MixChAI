import { z } from "zod";

export const EvaluationResultSchema = z.object({
  finalAnswer: z.string().trim().min(1, "Evaluator returned an empty answer"),
});
