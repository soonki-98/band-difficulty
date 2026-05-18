import { generateHtml } from '../src/generateHtml';
import { SongEntry } from '../src/types';

const mockSong: SongEntry = {
  song: 'Bohemian Rhapsody',
  artist: 'Queen',
  genre: '클래식 록',
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
  expect(html).toContain('클래식 록');
  expect(html).toContain('https://youtu.be/abc123');
});

test('formats null session as dash', () => {
  const song: SongEntry = { ...mockSong, sessions: { ...mockSong.sessions, keyboard: null, chorus: null } };
  const html = generateHtml([song], '2026-05-18 14:30');
  expect(html).toContain('"-"');
});

test('escapes HTML special characters in song/artist names', () => {
  const song: SongEntry = { ...mockSong, song: '<script>alert("xss")</script>' };
  const html = generateHtml([song], '2026-05-18 14:30');
  expect(html).not.toContain('<script>alert');
});

test('generates empty state for empty array', () => {
  const html = generateHtml([], '2026-05-18 14:30');
  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('데이터가 없습니다');
});

test('includes genre in filter options', () => {
  const html = generateHtml([mockSong], '2026-05-18 14:30');
  expect(html).toContain('클래식 록');
});
