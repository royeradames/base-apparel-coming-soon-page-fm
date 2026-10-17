import * as z from "zod/mini";
import en from "zod/v4/locales/en.js";

// Zod Mini ships no messages; load the English ones classic Zod uses so built-in issues read the same.
z.config(en());

export const emptyEmailMessage = "Please provide an email address";
export const invalidEmailMessage = "Please provide a valid email";

export const emailSchema = z.pipe(
  z.string().check(z.trim(), z.minLength(1, emptyEmailMessage)),
  z.email(invalidEmailMessage),
);

export function validateEmail(value: string): string | undefined {
  const result = emailSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
