"use client";

/* Native images keep the supplied arrow and error icons at their intrinsic size. */
/* eslint-disable @next/next/no-img-element */
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { validateEmail } from "./email-schema";

export function LaunchForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      // Demo only: the address stays in this tab and is never sent anywhere.
      setSubmittedEmail(value.email.trim());
    },
    onSubmitInvalid: () => inputRef.current?.focus(),
  });

  return (
    <form
      className="launch-form"
      noValidate
      aria-describedby="demo-note"
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onSubmit: ({ value }) => validateEmail(value),
          onChange: ({ value, fieldApi }) => (fieldApi.form.state.submissionAttempts > 0 ? validateEmail(value) : undefined),
        }}
      >
        {field => {
          const error = field.state.meta.errors.find(Boolean);
          return (
            <>
              <div className={`email-control${error ? " has-error" : ""}`}>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  ref={inputRef}
                  id="email"
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Email Address"
                  value={field.state.value}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "email-error" : undefined}
                  onBlur={field.handleBlur}
                  onChange={event => {
                    setSubmittedEmail(null);
                    field.handleChange(event.target.value);
                  }}
                />
                {error ? <img className="error-icon" src="/images/icon-error.svg" width="24" height="24" alt="" /> : null}
                <form.Subscribe selector={state => state.isSubmitting}>
                  {isSubmitting => (
                    <button type="submit" className="submit" aria-label="Submit email for launch news" aria-busy={isSubmitting || undefined}>
                      <img src="/images/icon-arrow.svg" width="12" height="20" alt="" />
                    </button>
                  )}
                </form.Subscribe>
              </div>
              {error ? <p id="email-error" className="form-message error">{String(error)}</p> : null}
            </>
          );
        }}
      </form.Field>
      <p className="form-message status" role="status">
        {submittedEmail ? `Thanks! ${submittedEmail} passed the check, but this demo doesn't save or send it.` : ""}
      </p>
      <p id="demo-note" className="demo-note">Demo only: nothing is sent.</p>
    </form>
  );
}
