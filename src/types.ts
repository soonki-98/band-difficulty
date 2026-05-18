export interface SessionDifficulty {
  vocal: number | null;
  drums: number | null;
  guitar: number | null;
  bass: number | null;
  keyboard: number | null;
  chorus: number | null;
}

export interface SongEntry {
  song: string;
  artist: string;
  genre: string;
  sessions: SessionDifficulty;
  youtubeUrl: string | null;
  recommender: string;
  recommendedAt: string;
  slackTs: string;
}
