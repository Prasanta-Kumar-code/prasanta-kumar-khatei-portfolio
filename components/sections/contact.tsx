"use client";

import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { MotionSection } from "@/components/shared/motion-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { SocialLinks } from "@/components/shared/social-links";
import { track } from "@/lib/analytics";
import { profile } from "@/lib/data/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormStatus } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Please enter a valid email address, e.g. name@company.com.";

  if (!values.message.trim()) errors.message = "Please tell me a little about your project.";
  else if (values.message.trim().length < 12)
    errors.message = "Message must be at least 12 characters.";

  return errors;
}

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusDetail, setStatusDetail] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const hasErrors = useMemo(
    () => Boolean(errors.name || errors.email || errors.message),
    [errors],
  );

  const setField = (field: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    // Honeypot: silently drop bot submissions.
    if (honeypotRef.current?.value) return;

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus("error");
      setStatusDetail("Please fix the highlighted fields and try again.");
      track("contact_error", { reason: "validation" });
      const firstField = (Object.keys(found) as Array<keyof typeof values>)[0];
      if (firstField) document.getElementById(firstField)?.focus();
      return;
    }

    setStatus("submitting");
    setStatusDetail("");

    if (!endpoint) {
      // No endpoint configured: hand the validated message to the mail client.
      const subject = encodeURIComponent("Portfolio enquiry from " + values.name.trim());
      const body = encodeURIComponent(
        values.message.trim() + "\n\n---\nFrom: " + values.name.trim() +
          " <" + values.email.trim() + ">",
      );
      window.location.href = "mailto:" + profile.email + "?subject=" + subject + "&body=" + body;
      setStatus("success");
      setStatusDetail("Opening your email app with the message pre-filled.");
      track("contact_submit", { mode: "mailto" });
      setValues({ name: "", email: "", message: "" });
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, _subject: "Portfolio enquiry from " + values.name }),
      });

      if (!response.ok) throw new Error("Request failed with status " + response.status);

      setStatus("success");
      setStatusDetail("Thanks — your message is on its way. I usually reply within 24 hours.");
      track("contact_submit", { mode: "endpoint" });
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setStatusDetail("Something went wrong sending your message. Please email me directly.");
      track("contact_error", { reason: "network" });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32"
    >
      <MotionSection>
        <SectionHeading
          id="contact"
          eyebrow="Contact"
          title="Let's Build Something Amazing Together"
          description="Have an AEM, React or analytics challenge? Tell me about it and I'll get back to you within 24 hours."
        />
      </MotionSection>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <MotionSection delay={0.05}>
          <form onSubmit={onSubmit} noValidate className="glass gradient-border rounded-2xl p-6 sm:p-8">
            <div className="grid gap-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">
                  Name <span aria-hidden="true" className="text-primary">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                  value={values.name}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onChange={(event) => setField("name", event.target.value)}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-danger">
                    <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
                  Email <span aria-hidden="true" className="text-primary">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@company.com"
                  required
                  value={values.email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onChange={(event) => setField("email", event.target.value)}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-danger">
                    <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-foreground">
                  Message <span aria-hidden="true" className="text-primary">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project, timeline and goals..."
                  required
                  value={values.message}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  onChange={(event) => setField("message", event.target.value)}
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-danger">
                    <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
                    {errors.message}
                  </p>
                )}
              </div>

              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="company">Company</label>
                <input
                  ref={honeypotRef}
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_14px_38px_-14px_var(--glow-cyan)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send aria-hidden="true" className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>

              <a
                href={"mailto:" + profile.email}
                onClick={() => track("social_click", { network: "Email" })}
                className="focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-border-strong px-5 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:border-primary/60 hover:text-primary"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                {profile.email}
              </a>
            </div>

            {status !== "idle" && status !== "submitting" && (
              <div
                role={status === "success" ? "status" : "alert"}
                aria-live={status === "success" ? "polite" : "assertive"}
                className={
                  "mt-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm " +
                  (status === "success"
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-danger/40 bg-danger/10 text-danger")
                }
              >
                {status === "success" ? (
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{statusDetail}</span>
              </div>
            )}

            {hasErrors && status === "error" && (
              <span className="sr-only" role="alert">
                {statusDetail}
              </span>
            )}
          </form>
        </MotionSection>

        <MotionSection delay={0.12}>
          <aside className="glass gradient-border h-full rounded-2xl p-6 sm:p-8">
            <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
              Start a conversation
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Available for enterprise AEM engagements, React frontend architecture, analytics
              implementations and AI-enabled delivery workflows.
            </p>

            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
                  Location
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{profile.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={"mailto:" + profile.email}
                    className="focus-ring break-all rounded text-sm font-medium text-primary hover:underline"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
                  Response time
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">Within 24 hours</dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
                Find me online
              </p>
              <SocialLinks className="mt-4" />
            </div>
          </aside>
        </MotionSection>
      </div>
    </section>
  );
}
