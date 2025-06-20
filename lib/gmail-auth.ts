import fs from "fs";
import { google } from "googleapis";

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
  console.log('✅ Tokens saved to token.json');
  return tokens;
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  // Save tokens to file
  fs.writeFileSync('token.json', JSON.stringify(tokens, null, 2));
  console.log('✅ Tokens saved to token.json');
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