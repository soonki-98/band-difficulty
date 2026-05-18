import { google } from 'googleapis';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SERVICE_ACCOUNT_PATH = path.resolve(process.cwd(), 'service-account.json');

function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: SCOPES,
  });
}

export async function getExistingSlackTs(spreadsheetId: string): Promise<Set<string>> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!N:N',
  });

  const values = response.data.values ?? [];
  return new Set(values.flat().filter(Boolean));
}

export async function appendSongRows(
  spreadsheetId: string,
  rows: string[][]
): Promise<number> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  if (rows.length === 0) return 0;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:N',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  return rows.length;
}

export async function getLastRowNumber(spreadsheetId: string): Promise<number> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A:A',
  });

  return (response.data.values ?? []).length;
}
