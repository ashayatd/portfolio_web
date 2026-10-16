"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, RefreshCw } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ResumeUploader from "./ResumeUploader";

export type ResumeSummary = {
  url: string;
  sizeLabel: string;
  uploadedLabel: string;
};

export default function ResumePanel({
  resume,
}: {
  resume: ResumeSummary | null;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-900">
          <FileText size={18} />
          <h2 className="text-base font-semibold">Current resume</h2>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          <RefreshCw size={15} />
          Replace
        </button>
      </div>

      {resume ? (
        <>
          <p className="mb-3 text-xs text-slate-400">
            {resume.sizeLabel} · uploaded {resume.uploadedLabel}
          </p>
          <iframe
            src={resume.url}
            title="Current resume"
            className="h-[520px] w-full rounded-xl border border-slate-200 bg-slate-50"
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 px-6 py-14 text-center">
          <p className="text-sm text-slate-500">
            No resume uploaded yet. Hit Replace to add one.
          </p>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Replace resume"
        subtitle="The new PDF goes live immediately at /resume."
      >
        <ResumeUploader
          onUploaded={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </Modal>
    </>
  );
}
