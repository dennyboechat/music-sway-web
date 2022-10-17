export type NewSongEntry = {
    uuid: string,
    id: null,
    title: string,
    content: string,
}

export type NewSong = {
    id: null,
    title: string,
    artist: string,
    category: string,
    observation: string,
    entries: NewSongEntry[],
    restrictionId: number,
}

export type Song = {
    id: number,
    title: string,
    artist: string,
    category: string,
    observation: string,
    entries: NewSongEntry[],
    restrictionId: number,
}

export type NewPlaylistEntry = {

}

export type NewPlaylist = {
    id: null,
    name: string,
    observation: string,
    restrictionId: number,
    entries: NewPlaylistEntry[],
}

export type User = {
    id: number,
    email: string,
}

export type Token = {
    name: string,
    email: string,
    picture: string,
}

export type Session = {
    token: Token,
}

export type Context = {
    session: Session,
}

export interface Query {
    (q: string, values: string[]): any;
}