"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

type Status =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export default function ResumeUploader({
  onUploaded,
}: {
  onUploaded?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ kind: "uploading" });

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        body: new FormData(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setStatus({ kind: "error", message: payload.error ?? "Upload failed." });
        return;
      }

      form.reset();
      setFileName(null);
      setStatus({ kind: "done" });
      onUploaded?.();
    } catch {
      setStatus({ kind: "error", message: "Network error. Try again." });
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40">
        <Upload size={20} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-700">
          {fileName ?? "Choose a PDF"}
        </span>
        <span className="text-xs text-slate-400">PDF only, up to 4MB</span>
        <input
          type="file"
          name="resume"
          accept="application/pdf,.pdf"
          required
          className="hidden"
          onChange={(event) => {
            setFileName(event.target.files?.[0]?.name ?? null);
            setStatus({ kind: "idle" });
          }}
        />
      </label>

      {status.kind === "error" && (
        <p className="text-sm text-rose-600">{status.message}</p>
      )}
      {status.kind === "done" && (
        <p className="text-sm text-emerald-600">
          Resume replaced. It is live at /resume.
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "uploading" || !fileName}
        className="w-full cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status.kind === "uploading" ? "Uploading…" : "Replace resume"}
      </button>
    </form>
  );
}
