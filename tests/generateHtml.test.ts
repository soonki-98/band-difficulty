import { generateHtml } from '../src/generateHtml';
import { SongEntry } from '../src/types';

const mockSong: SongEntry = {
  song: 'Bohemian Rhapsody',
  artist: 'Queen',
  mainGenre: '록',
  subGenre: '얼터너티브 록',
  sessions: { vocal: 5, drums: 4, guitar: 4, bass: 3, keyboard: 4, chorus: 5 },
  youtubeUrl: 'https://youtu.be/abc123',
  recommender: '김민수',
  recommendedAt: '2026-05-18 14:30',
  slackTs: '1234567890.123456',
};

test('generates valid HTML with song data', () => {
  const html = generateHtml([mockSong], '2026-05-18 14:30');
  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('Bohemian Rhapsody');
  expect(html).toContain('Queen');
  expect(html).toContain('록');
  expect(html).toContain('얼터너티브 록');
  expect(html).toContain('https://youtu.be/abc123');
});

test('formats null session as dash', () => {
  const song: SongEntry = { ...mockSong, sessions: { ...mockSong.sessions, keyboard: null, chorus: null } };
  const html = generateHtml([song], '2026-05-18 14:30');
  expect(html).toContain('"-"');
  expect(html).not.toContain('"keyboard":null');
  expect(html).not.toContain('"chorus":null');
});

test('escapes HTML special characters in song/artist names', () => {
  const song: SongEntry = { ...mockSong, song: '<script>alert("xss")</script>' };
  const html = generateHtml([song], '2026-05-18 14:30');
  // Data is stored raw in JSON; client-side esc() handles rendering.
  // The </script> closing tag must be neutralized to prevent script injection.
  expect(html).not.toContain('</script><script>');
  expect(html).toContain('<\\/script>');
  // The esc() helper must be present for client-side escaping.
  expect(html).toContain('function esc(s)');
});

test('generates empty state for empty array', () => {
  const html = generateHtml([], '2026-05-18 14:30');
  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('총 0곡');
});

test('includes mainGenre in main filter options', () => {
  const html = generateHtml([mockSong], '2026-05-18 14:30');
  expect(html).toContain('mainGenreFilter');
  expect(html).toContain('록');
});

test('includes subGenre in data', () => {
  const html = generateHtml([mockSong], '2026-05-18 14:30');
  expect(html).toContain('얼터너티브 록');
});
