import fs from "fs";
import { google } from "googleapis";

/*
const SERVICE_ACCOUNT_FILE = "" //path here
const DELEGATED_USER = "team@atom.com"
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

let authClient: JWT;

function loadServiceAccountCredentials(){
  const json = fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8');
  return JSON.parse(json);
}
export function createServiceAccountClient(){
  const credentials = loadServiceAccountCredentials();
  authClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });
  return google.gmail({ version: "v1", auth: authClient });
}
*/
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl() {
  const scope = ["https://www.googleapis.com/auth/gmail.readonly"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope,
    prompt: "consent",
  });
}

export async function getAccessToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  // Save tokens to file
  fs.writeFileSync('token.json', JSON.stringify(tokens, null, 2));
  console.log('Tokens saved to token.json');
  return tokens;
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  // Save tokens to file
  fs.writeFileSync('token.json', JSON.stringify(tokens, null, 2));
  console.log('Tokens saved to token.json');
  return tokens;
}

function loadTokensFromFile() {
  try {
    if (!fs.existsSync('token.json')) {
      return null;
    }
    const tokenData = fs.readFileSync('token.json', 'utf8');
    if (tokenData.trim() === '') {
      return null;
    }
    return JSON.parse(tokenData);
  } catch (error) {
    console.error('Error loading tokens:', error);
    return null;
  }
}


export function createGmailClient() {
  const tokens = loadTokensFromFile();
  if (!tokens || !tokens.access_token || !tokens.refresh_token) {
    throw new Error('NO_TOKENS');
  }
  oauth2Client.setCredentials(tokens);
  return google.gmail({ version: "v1", auth: oauth2Client });
}

/*api health check*/
export function hasValidTokens(): boolean {
  try {
    const tokens = loadTokensFromFile();
    return !!(tokens?.access_token && tokens?.refresh_token);
  } catch {
    return false;
  }
}

export function isTokenExpired(tokens: any): boolean {
  if (!tokens?.expiry_date) return false;
  return Date.now() >= tokens.expiry_date;
}

export async function canCreateGmailClient(): Promise<boolean> {
  if (!hasValidTokens()) return false;

  const tokens = loadTokensFromFile();
  if (!tokens) return false;

  // If token is expired, try to refresh it
  if (isTokenExpired(tokens)) {
    try {
      oauth2Client.setCredentials(tokens);
      const newTokens = await oauth2Client.refreshAccessToken();
      // Save the refreshed tokens
      fs.writeFileSync('token.json', JSON.stringify(newTokens.credentials, null, 2));
      console.log('Tokens refreshed successfully');
      return true;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return false;
    }
  }

  return true;
}
