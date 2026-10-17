import type { Metadata } from "next";
import { getAdminPassword, isAdmin } from "@/lib/admin-session";
import { getStoredResume } from "@/lib/resume-store";
import { logout } from "./actions";
import LoginForm from "./LoginForm";
import ResumePanel, { type ResumeSummary } from "./ResumePanel";

export const metadata: Metadata = {
  title: "…",
  robots: { index: false, follow: false, nocache: true },
};

function formatSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/** Formatted here so the client component can't drift on locale. */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export default async function AdminPage() {
  // isAdmin() reads cookies(), a request-time API -- awaiting it unconditionally
  // is what keeps this route out of the static prerender.
  const authed = await isAdmin();
  const configured = getAdminPassword() !== null;

  let resume: ResumeSummary | null = null;

  if (authed) {
    try {
      const stored = await getStoredResume();
      if (stored) {
        resume = {
          url: stored.url,
          sizeLabel: formatSize(stored.size),
          uploadedLabel: formatDate(stored.uploadedAt),
        };
      }
    } catch (error) {
      console.error("Could not read the stored resume", error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div
        className={`w-full ${
          authed ? "max-w-3xl" : "max-w-sm"
        } rounded-2xl border border-slate-200 bg-white p-8 shadow-sm`}
      >
        {!configured ? (
          <p className="text-sm text-rose-600">
            RESUME_ACCESS_PASSWORD is not set. Add it to your environment and
            redeploy.
          </p>
        ) : authed ? (
          <>
            <div className="mb-6 flex items-baseline justify-between">
              <h1 className="text-lg font-semibold text-slate-900">Resume</h1>
              <form action={logout}>
                <button
                  type="submit"
                  className="cursor-pointer text-xs text-slate-400 transition-colors hover:text-slate-700"
                >
                  Sign out
                </button>
              </form>
            </div>
            <ResumePanel resume={resume} />
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
