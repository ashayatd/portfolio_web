import { getStoredResume } from "@/lib/resume-store";

const MISSING = new Response("No resume has been uploaded yet.", {
  status: 404,
  headers: { "content-type": "text/plain" },
});

/** Stable public URL for the "Download Resume" buttons. */
export async function GET() {
  let resume;

  try {
    resume = await getStoredResume();
  } catch (error) {
    // A misconfigured blob store shouldn't show visitors a 500; the upload
    // panel reports the real cause when you next try to replace the resume.
    console.error("Could not read the stored resume", error);
    return MISSING.clone();
  }

  if (!resume) return MISSING.clone();

  // downloadUrl carries a content-disposition that saves rather than previews.
  return Response.redirect(resume.downloadUrl, 307);
}
