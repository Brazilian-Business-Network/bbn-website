"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";

import { GoldHeading } from "@/components/brand/GoldHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formspreeEndpoint } from "@/data/site";
import { cn } from "@/lib/utils";

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  /** Options for `type: "select"`. */
  options?: { value: string; label: string }[];
  /** Full-width in the two-column grid. */
  wide?: boolean;
  minLength?: number;
};

export type FormLabels = {
  submit: string;
  sending: string;
  optional: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  notConfigured: string;
  /** Consent line with a {link} token, e.g. "Ao enviar, você concorda com a nossa {link}." */
  consent: string;
  consentLink: string;
  validation: { required: string; email: string; minLength: string };
};

/** Which form this is. Every form posts to the same Formspree endpoint. */
export type FormKind = "membresia" | "parceiros" | "contato" | "visita";

/**
 * Fixed, untranslated subjects — they are for the BBN inbox (filters, search),
 * not for the reader, so they stay identical whatever the page language.
 */
const SUBJECTS: Record<FormKind, string> = {
  membresia: "[BBN] Membresia",
  parceiros: "[BBN] Parceiros",
  contato: "[BBN] Contato",
  visita: "[BBN] Visita",
};

type FormspreeFormProps = {
  kind: FormKind;
  /** Page and locale the submission came from, e.g. "/pt/membresia". Sent as "origem". */
  origin: string;
  /** Locale-prefixed link to the privacy policy. */
  privacyHref: string;
  fields: FieldSpec[];
  labels: FormLabels;
};

type Status = "idle" | "submitting" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formspree-backed form. Progressive: it posts with fetch and reports inline,
 * but the markup is a real <form> with native `required` attributes so the
 * browser validates even before hydration.
 */
export function FormspreeForm({
  kind,
  origin,
  privacyHref,
  fields,
  labels,
}: FormspreeFormProps) {
  const endpoint = formspreeEndpoint();
  const formKey = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const focusOnMount = useCallback((node: HTMLDivElement | null) => {
    node?.focus();
  }, []);

  if (!endpoint) {
    return (
      <p
        role="status"
        className="flex items-start gap-3 rounded-sm border border-bbn-line bg-bbn-card p-5 text-sm leading-relaxed text-bbn-muted"
      >
        <TriangleAlert
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-bbn-gold"
        />
        {labels.notConfigured}
      </p>
    );
  }

  function validate(data: FormData): Record<string, string> {
    const found: Record<string, string> = {};

    for (const field of fields) {
      const raw = data.get(field.name);
      const value = typeof raw === "string" ? raw.trim() : "";

      if (field.required && !value) {
        found[field.name] = labels.validation.required;
        continue;
      }
      if (!value) continue;

      if (field.type === "email" && !emailPattern.test(value)) {
        found[field.name] = labels.validation.email;
      }
      if (field.minLength && value.length < field.minLength) {
        found[field.name] = labels.validation.minLength;
      }
    }

    return found;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint) return;
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a bot that fills the hidden field is silently accepted.
    if (data.get("_gotcha")) {
      setStatus("success");
      return;
    }

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = fields.find((f) => found[f.name]);
      if (first) {
        form.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      }
      return;
    }

    // Replies from the BBN inbox go straight to the sender.
    const email = data.get("email");
    if (typeof email === "string" && email.trim()) {
      data.set("_replyto", email.trim());
    }

    setStatus("submitting");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        // The form it replaced is unmounted along with the focused submit
        // button, so focus is moved here explicitly — otherwise a keyboard user
        // is dropped back to the top of the document and a screen reader may
        // never announce the result.
        ref={focusOnMount}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-3 rounded-sm border border-bbn-line-strong bg-bbn-card p-8 outline-none"
      >
        <CircleCheck aria-hidden="true" className="size-8 text-bbn-gold" />
        <GoldHeading as="h3" size="md">
          {labels.successTitle}
        </GoldHeading>
        <p className="text-pretty leading-relaxed text-bbn-muted">
          {labels.successBody}
        </p>
      </div>
    );
  }

  return (
    // action/method make the form work even before hydration: Formspree then
    // shows its own confirmation page and uses the "email" field as reply-to.
    <form
      action={endpoint}
      method="POST"
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <input type="hidden" name="_subject" value={SUBJECTS[kind]} />
      <input type="hidden" name="origem" value={origin} />
      {/* Honeypot — hidden from people and from assistive tech. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${formKey}-gotcha`}>Do not fill this field</label>
        <input id={`${formKey}-gotcha`} type="text" name="_gotcha" tabIndex={-1} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((field) => {
          const fieldId = `${formKey}-${field.name}`;
          const errorId = `${fieldId}-error`;
          const error = errors[field.name];
          const isWide = field.wide || field.type === "textarea";

          return (
            <div
              key={field.name}
              className={cn("flex flex-col gap-2", isWide && "sm:col-span-2")}
            >
              <Label htmlFor={fieldId} className="label-caps text-bbn-champagne">
                {field.label}
                {field.required ? (
                  <span aria-hidden="true" className="ml-1 text-bbn-gold">
                    *
                  </span>
                ) : (
                  <span className="ml-2 normal-case tracking-normal text-bbn-muted">
                    ({labels.optional})
                  </span>
                )}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={fieldId}
                  name={field.name}
                  rows={5}
                  required={field.required}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                />
              ) : field.type === "select" ? (
                // A native select keeps this form usable without JS and avoids
                // Base UI's controlled-items API for a simple one-of choice.
                <select
                  id={fieldId}
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className="h-11 w-full rounded-lg border border-input bg-bbn-surface px-3.5 text-base text-bbn-ink outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
                >
                  <option value="" disabled={field.required}>
                    —
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={fieldId}
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  placeholder={field.placeholder}
                  autoComplete={
                    field.type === "email"
                      ? "email"
                      : field.name === "name"
                        ? "name"
                        : field.type === "tel"
                          ? "tel"
                          : undefined
                  }
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                />
              )}

              {error ? (
                <p id={errorId} className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {status === "error" ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-sm border border-destructive/50 bg-bbn-card p-4 text-sm"
        >
          <TriangleAlert
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-destructive"
          />
          <span>
            <strong className="text-bbn-champagne">{labels.errorTitle}</strong>
            <span className="mt-1 block leading-relaxed text-bbn-muted">
              {labels.errorBody}
            </span>
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              {labels.sending}
            </>
          ) : (
            labels.submit
          )}
        </Button>

        <ConsentLine
          template={labels.consent}
          linkLabel={labels.consentLink}
          href={privacyHref}
        />
      </div>
    </form>
  );
}

/** "Ao enviar, você concorda com a nossa Política de Privacidade" — {link} becomes a link. */
function ConsentLine({
  template,
  linkLabel,
  href,
}: {
  template: string;
  linkLabel: string;
  href: string;
}) {
  const [before, after = ""] = template.split("{link}");

  return (
    <p className="max-w-sm text-sm leading-relaxed text-bbn-muted">
      {before}
      <Link
        href={href}
        className="text-bbn-champagne underline decoration-bbn-line-strong underline-offset-4 transition-colors hover:text-bbn-gold hover:decoration-bbn-gold"
      >
        {linkLabel}
      </Link>
      {after}
    </p>
  );
}
