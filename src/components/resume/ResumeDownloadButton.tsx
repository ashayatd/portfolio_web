"use client";

import { useState } from "react";
import LeadCaptureModal from "./LeadCaptureModal";

/** Set once a visitor has submitted or skipped, so we never nag them twice. */
const STORAGE_KEY = "ashay_resume_lead";

type ResumeDownloadButtonProps = {
  /** Which button this is, recorded with the lead. */
  source: string;
  className?: string;
  children: React.ReactNode;
};

export default function ResumeDownloadButton({
  source,
  className,
  children,
}: ResumeDownloadButtonProps) {
  const [open, setOpen] = useState(false);

  function startDownload() {
    // /resume redirects to a URL served with content-disposition: attachment,
    // so this downloads without navigating away from the page.
    window.location.href = "/resume";
  }

  function alreadyAsked(): boolean {
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      // Private mode or blocked storage: just ask again, no harm done.
      return false;
    }
  }

  function remember() {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {}
  }

  function handleClick() {
    if (alreadyAsked()) {
      startDownload();
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>

      <LeadCaptureModal
        open={open}
        onClose={() => setOpen(false)}
        source={source}
        onDone={() => {
          remember();
          startDownload();
        }}
      />
    </>
  );
}
