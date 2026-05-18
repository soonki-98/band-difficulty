import 'dotenv/config';
import { google } from 'googleapis';
import path from 'path';

async function main() {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is required in .env');

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(process.cwd(), 'service-account.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Sheet1!A1:N1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [['번호', '장르', '곡명', '아티스트', '보컬', '드럼', '기타', '베이스', '건반', '코러스', 'YouTube링크', '추천인', '추천일시', 'slack_ts']],
    },
  });

  console.log('Sheet header initialized.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
