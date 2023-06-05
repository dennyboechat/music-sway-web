export interface PlaylistEntry {

}

export interface Playlist {
    id?: number,
    name: string,
    observation?: string,
    restrictionId?: number,
    entries?: PlaylistEntry[],
}