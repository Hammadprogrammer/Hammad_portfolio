"use client";

import { useRef, useState, type FormEvent } from "react";
import { Send, Check, AlertTriangle, Loader2 } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useMagnetic } from "@/hooks/useMagnetic";
import { validateContact, type ContactErrors } from "@/lib/validate-contact";

type Status = "idle" | "sending" | "sent" | "error";

type Errors = ContactErrors;

const PROJECT_TYPES = [
  "Web Application",
  "E-Commerce",
  "SaaS / Dashboard",
  "API / Backend",
  "Interactive / 3D",
  "Other",
];

const BUDGETS = ["< $1k", "$1k – $5k", "$5k – $15k", "$15k+", "Not sure yet"];

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="mono-font text-[10px] uppercase tracking-[0.35em] text-silver transition-colors group-focus-within:text-cyan-glow"
      >
        {label}
      </label>
      {children}
      <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full bg-ice/15" />
      <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-glow to-violet-glow shadow-[0_0_12px_rgba(34,224,255,0.5)] transition-transform duration-500 group-focus-within:scale-x-100" />
      {error && (
        <p role="alert" className="mono-font mt-2 text-[11px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent pb-3 pt-1 text-base text-ice placeholder:text-silver/60 focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useMagnetic<HTMLButtonElement>(0.2);

  const validate = (fd: FormData): Errors =>
    validateContact({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      projectType: String(fd.get("projectType") || ""),
      message: String(fd.get("message") || ""),
    });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      setStatus("error");
      // shake the button on error
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { x: -8 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
      }
      return;
    }

    setStatus("sending");
    try {
      // open the user's mail client with a prefilled message (no backend required)
      const subject = encodeURIComponent(
        `Project inquiry: ${fd.get("projectType")} — ${fd.get("name")}`
      );
      const body = encodeURIComponent(
        `Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\nProject type: ${fd.get(
          "projectType"
        )}\nBudget: ${fd.get("budget") || "—"}\n\n${fd.get("message")}`
      );
      await new Promise((r) => setTimeout(r, 900)); // brief state feedback
      window.location.href = `mailto:hammadzahid221@gmail.com?subject=${subject}&body=${body}`;
      setStatus("sent");
      formRef.current?.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-10"
      aria-label="Contact form"
    >
      <div className="grid gap-10 md:grid-cols-2">
        <Field label="Full Name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={inputCls}
            onChange={() => setErrors((p) => ({ ...p, name: undefined }))}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={inputCls}
            onChange={() => setErrors((p) => ({ ...p, email: undefined }))}
          />
        </Field>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <Field label="Project Type" htmlFor="projectType" error={errors.projectType}>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            className={`${inputCls} appearance-none [&>option]:bg-navy`}
            onChange={() => setErrors((p) => ({ ...p, projectType: undefined }))}
          >
            <option value="" disabled>
              Select a type
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget (optional)" htmlFor="budget">
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className={`${inputCls} appearance-none [&>option]:bg-navy`}
          >
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" htmlFor="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell me about your product, idea or technical challenge…"
          className={`${inputCls} resize-none`}
          onChange={() => setErrors((p) => ({ ...p, message: undefined }))}
        />
      </Field>

      <div className="flex flex-col items-start gap-4">
        <button
          ref={btnRef}
          type="submit"
          disabled={status === "sending"}
          className={`group inline-flex w-full items-center justify-center gap-3 rounded-full px-10 py-5 mono-font text-xs uppercase tracking-[0.3em] transition-all duration-500 md:w-auto ${
            status === "sent"
              ? "bg-emerald-400/90 text-void"
              : status === "error"
                ? "border border-red-400/60 text-red-300"
                : "bg-cyan-glow text-void hover:shadow-[0_0_40px_rgba(34,224,255,0.35)]"
          }`}
        >
          {status === "sending" && (
            <>
              Sending… <Loader2 className="h-4 w-4 animate-spin" />
            </>
          )}
          {status === "sent" && (
            <>
              Message sent <Check className="h-4 w-4" />
            </>
          )}
          {status === "error" && (
            <>
              Error — try again <AlertTriangle className="h-4 w-4" />
            </>
          )}
          {status === "idle" && (
            <>
              Send message
              <Send className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
        <p aria-live="polite" className="mono-font text-[11px] text-silver">
          {status === "sent" && "Thanks — I usually respond within 24 hours."}
          {status === "error" &&
            Object.keys(errors).length > 0 &&
            "Please fix the highlighted fields."}
        </p>
      </div>
    </form>
  );
}
