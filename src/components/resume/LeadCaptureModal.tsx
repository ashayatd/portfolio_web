"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

type LeadCaptureModalProps = {
  open: boolean;
  onClose: () => void;
  /** Which button opened this, recorded alongside the email. */
  source: string;
  /** Called once the visitor has either submitted or skipped. */
  onDone: () => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LeadCaptureModal({
  open,
  onClose,
  source,
  onDone,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function finish(withEmail: string | null) {
    if (withEmail) {
      // Not awaited: the spec is that the download starts immediately.
      // keepalive lets the request survive the navigation that follows.
      void fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: withEmail, source }),
        keepalive: true,
      }).catch(() => {});
    }

    onClose();
    onDone();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();

    // The field is optional, so an empty submit behaves exactly like Skip.
    if (!trimmed) {
      finish(null);
      return;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("That doesn't look like an email — or just hit skip.");
      return;
    }

    finish(trimmed);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="I'd love to stay in touch!"
      subtitle="Drop your email below so I can say hello — or just hit skip and the resume is yours either way."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            placeholder="you@example.com"
            autoComplete="email"
            aria-label="Your email (optional)"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400"
          />
          {error ? (
            <p className="mt-2 text-sm text-rose-600">{error}</p>
          ) : (
            <p className="mt-2 text-xs text-slate-400">
              Completely optional. No spam, ever.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => finish(null)}
            className="flex-1 cursor-pointer rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Skip &amp; download
          </button>
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Send &amp; download
          </button>
        </div>
      </form>
    </Modal>
  );
}
