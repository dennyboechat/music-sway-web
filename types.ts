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
    filterOrder?: number, 
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

export type SessionUser = {
    name: string,
    email: string,
    image: string,
}

export type Session = {
    user: SessionUser,
}

export type Context = {
    session: Session,
}

export interface Query {
    (q: string, values: string[]): any;
}

export interface BandUserStatus {
    id?: number
}