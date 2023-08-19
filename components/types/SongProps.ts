export type SongArtist = string;

export type SongCategory = string;

export type SongEntryTitle = string;

export interface SongEntry {
    uuid?: string,
    title?: SongEntryTitle,
    content: string,
}

export interface Song {
    id?: number;
    title: string;
    artist?: SongArtist;
    category?: SongCategory;
    observation?: string;
    restrictionId: number;
    entries: SongEntry[];
}