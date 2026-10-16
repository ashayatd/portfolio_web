import { appendLead, isValidEmail, leadsConfigured } from "@/lib/leads";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid body." }, { status: 400 });
  }

  const { email, source } =
    (payload as { email?: unknown; source?: unknown }) ?? {};

  if (typeof email !== "string" || !isValidEmail(email.trim())) {
    return Response.json({ error: "Invalid email." }, { status: 400 });
  }

  if (!leadsConfigured()) {
    // Never fail the visitor's download over our own missing config.
    console.error("Lead received but Google Sheets is not configured");
    return Response.json({ ok: false }, { status: 200 });
  }

  try {
    await appendLead(
      email.trim().toLowerCase(),
      typeof source === "string" ? source.slice(0, 40) : "unknown"
    );
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Could not append lead to the sheet", error);
    return Response.json({ ok: false }, { status: 200 });
  }
}
