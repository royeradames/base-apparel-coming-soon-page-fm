import { z } from "zod";

export const emptyEmailMessage = "Please provide an email address";
export const invalidEmailMessage = "Please provide a valid email";

export const emailSchema = z.string().trim().min(1, emptyEmailMessage).pipe(z.email(invalidEmailMessage));

export function validateEmail(value: string): string | undefined {
  const result = emailSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
