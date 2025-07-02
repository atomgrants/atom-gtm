import { JWT } from "google-auth-library"
import { google } from "googleapis";

//const SERVICE_ACCOUNT_FILE = "service-account.json" //path here
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

let authClient: JWT;

function loadServiceAccountCredentials() {
  //const json = fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8');
  const json = process.env.GOOGLE_AUTH_JSON;
  if (!json) throw new Error('GOOGLE_AUTH_JSON is not set');
  return JSON.parse(json);
}

export function createServiceAccountClient() {
  const credentials = loadServiceAccountCredentials();
  authClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
    subject: "team@atomgrants.com"
  });
  return google.gmail({ version: "v1", auth: authClient });
}

