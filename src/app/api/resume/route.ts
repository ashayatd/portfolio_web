import { isAdmin } from "@/lib/admin-session";
import {
  MAX_RESUME_BYTES,
  looksLikePdf,
  storeResume,
} from "@/lib/resume-store";

/**
 * Upload lives in a Route Handler rather than a Server Action because Server
 * Actions cap request bodies at 1MB by default, which a resume can exceed.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Not authorised." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("resume");

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "No file received." }, { status: 400 });
  }

  if (file.size > MAX_RESUME_BYTES) {
    return Response.json(
      {
        error: `File is ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum is ${
          MAX_RESUME_BYTES / 1024 / 1024
        }MB.`,
      },
      { status: 413 }
    );
  }

  if (!(await looksLikePdf(file))) {
    return Response.json({ error: "That is not a PDF." }, { status: 415 });
  }

  try {
    const blob = await storeResume(file);
    return Response.json({ url: blob.url });
  } catch (error) {
    console.error("Resume upload failed", error);
    return Response.json(
      { error: "Upload failed. Check the blob store is configured." },
      { status: 500 }
    );
  }
}
