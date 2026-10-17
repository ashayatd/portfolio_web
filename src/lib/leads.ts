import { JWT } from "google-auth-library";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

type SheetsConfig = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
  tab: string;
};

function getConfig(): SheetsConfig | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Env vars can't hold real newlines, so the key is stored with escaped ones.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) return null;

  return {
    spreadsheetId,
    clientEmail,
    privateKey,
    tab: process.env.GOOGLE_SHEETS_TAB || "Leads",
  };
}

export function leadsConfigured(): boolean {
  return getConfig() !== null;
}

/** Reused across warm invocations so we aren't re-signing a JWT every request. */
let cachedClient: JWT | null = null;

function getClient(config: SheetsConfig): JWT {
  if (!cachedClient) {
    cachedClient = new JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: [SHEETS_SCOPE],
    });
  }
  return cachedClient;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

export async function appendLead(email: string, source: string): Promise<void> {
  const config = getConfig();
  if (!config) throw new Error("Google Sheets is not configured");

  const { token } = await getClient(config).getAccessToken();
  if (!token) throw new Error("Could not obtain a Google access token");

  const range = `${config.tab}!A:C`;
  const endpoint =
    `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}` +
    `/values/${encodeURIComponent(range)}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      values: [[new Date().toISOString(), email, source]],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Sheets append failed: ${response.status} ${await response.text()}`
    );
  }
}
