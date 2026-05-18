import 'dotenv/config';
import { SongEntry } from './types';
import { getExistingSlackTs, appendSongRows, getLastRowNumber } from './sheetsClient';

function songEntryToRow(entry: SongEntry, rowNumber: number): string[] {
  const { song, artist, genre, sessions, youtubeUrl, recommender, recommendedAt, slackTs } = entry;
  return [
    String(rowNumber),
    genre,
    song,
    artist,
    sessions.vocal != null ? String(sessions.vocal) : '-',
    sessions.drums != null ? String(sessions.drums) : '-',
    sessions.guitar != null ? String(sessions.guitar) : '-',
    sessions.bass != null ? String(sessions.bass) : '-',
    sessions.keyboard != null ? String(sessions.keyboard) : '-',
    sessions.chorus != null ? String(sessions.chorus) : '-',
    youtubeUrl ?? '',
    recommender,
    recommendedAt,
    slackTs,
  ];
}

async function main() {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is required in .env');

  let rawInput = '';
  for await (const chunk of process.stdin) rawInput += chunk;

  const songs: SongEntry[] = JSON.parse(rawInput);
  if (!Array.isArray(songs) || songs.length === 0) {
    console.log('No songs to process.');
    return;
  }

  const existingTs = await getExistingSlackTs(spreadsheetId);
  const newSongs = songs.filter(s => !existingTs.has(s.slackTs));

  if (newSongs.length === 0) {
    console.log('No new songs to add (all already in sheet).');
    return;
  }

  // getLastRowNumber counts header + existing data rows
  // e.g. header(1) + 23 songs = 24 → next song number is 24
  let nextSongNumber = await getLastRowNumber(spreadsheetId);
  const rows = newSongs.map(song => songEntryToRow(song, nextSongNumber++));

  const added = await appendSongRows(spreadsheetId, rows);
  console.log(`Added ${added} new songs to the sheet.`);
}

main().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
