import { v4 } from 'uuid';
import Restriction from '@/lib/restriction';
import { orderBy, forEach } from 'lodash';
import { NewSongEntry, NewSong, Song, NewPlaylist, User, Context, Query } from 'types';

let scroll: NodeJS.Timer;

export const getNewSongEntry = (): NewSongEntry => {
    return {
        uuid: v4(),
        id: null,
        title: '',
        content: '',
    }
}

export const getNewSong = ({ addEntry }: { addEntry: boolean }): NewSong => {
    const entries = [];
    if (addEntry) {
        entries.push(getNewSongEntry());
    }
    return {
        id: null,
        title: '',
        artist: '',
        category: '',
        observation: '',
        entries,
        restrictionId: Restriction.PUBLIC.id,
    };
}

export const getNewPlaylist = (): NewPlaylist => {
    return {
        id: null,
        name: '',
        observation: '',
        restrictionId: Restriction.BAND.id,
        entries: [],
    };
}

export const validateSong = ({ songTitle, songRestrictionId }: { songTitle: string, songRestrictionId: number }): string[] => {
    const invalidMessages = [];
    if (!songTitle || songTitle.trim.length) {
        invalidMessages.push('Title');
    }
    if (!songRestrictionId) {
        invalidMessages.push('Restriction');
    }
    return invalidMessages;
}

export const validatePlaylist = ({ playlistName, playlistRestrictionId }: { playlistName: string, playlistRestrictionId?: number }): string[] => {
    const invalidMessages = [];
    if (!playlistName || playlistName.trim.length) {
        invalidMessages.push('Playlist Name');
    }
    if (!playlistRestrictionId) {
        invalidMessages.push('Restriction');
    }
    return invalidMessages;
}

export const validateBand = ({ bandName }: { bandName: string }): string[] => {
    const invalidMessages = [];
    if (!bandName || bandName.trim.length) {
        invalidMessages.push('Band Name');
    }
    return invalidMessages;
}

export const validateUser = ({ userName }: { userName: string }): string[] => {
    const invalidMessages = [];
    if (!userName || userName.trim.length) {
        invalidMessages.push('Your Name');
    }
    return invalidMessages;
}

export const getParsedCharacterText = ({ text }: { text: string }): string => {
    if (text) {
        return text.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/æ/g, 'ae')
            .replace(/ç/g, 'c')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/ñ/g, 'n')
            .replace(/[òóôõö]/g, 'o')
            .replace(/œ/g, 'oe')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ýÿ]/g, 'y');
    }
    return '';
}

export const scrollToPageTop = (): void => {
    window.scrollTo({
        top: 0,
    });
}

export const autoPageScrollDownStart = (speed = 100): void => {
    scroll = setInterval(
        () => { window.scrollBy(0, 1); },
        speed
    );
}

export const autoPageScrollDownStop = (): void => {
    clearInterval(scroll);
}

export const filterSongs = ({ songs, songsFilterValue }: { songs: Song[], songsFilterValue: string }): Song[] => {
    let sortedSongs: Song[] = [];
    if (songs && songs.length) {
        if (songsFilterValue && songsFilterValue.length) {
            forEach(songs, song => {
                if (getParsedCharacterText({ text: song.title }).startsWith(songsFilterValue.toLowerCase())) {
                    song.filterOrder = 1;
                    sortedSongs.push(song);
                } else if (getParsedCharacterText({ text: song.title }).includes(songsFilterValue.toLowerCase())) {
                    song.filterOrder = 2;
                    sortedSongs.push(song);
                } else if (getParsedCharacterText({ text: song.artist }).includes(songsFilterValue.toLowerCase())) {
                    song.filterOrder = 3;
                    sortedSongs.push(song);
                } else if (getParsedCharacterText({ text: song.category }).includes(songsFilterValue.toLowerCase())) {
                    song.filterOrder = 4;
                    sortedSongs.push(song);
                } else if (getParsedCharacterText({ text: song.observation }).includes(songsFilterValue.toLowerCase())) {
                    song.filterOrder = 5;
                    sortedSongs.push(song);
                } else if (song.entries && song.entries.some(entry => (getParsedCharacterText({ text: entry.title }).includes(songsFilterValue.toLowerCase())))) {
                    song.filterOrder = 6;
                    sortedSongs.push(song);
                } else if (song.entries && song.entries.some(entry => (getParsedCharacterText({ text: entry.content }).includes(songsFilterValue.toLowerCase())))) {
                    song.filterOrder = 7;
                    sortedSongs.push(song);
                }
            });
            sortedSongs = orderBy(sortedSongs, ['filterOrder']);
        } else {
            sortedSongs = songs;
        }
    }
    return sortedSongs;
}

export const validateEmail = ({ email }: { email: string }): string | null => {
    if (email && email.trim().length) {
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        if (!regexExp.test(email)) {
            return `Email ${email} is invalid.`;
        }
    }
    return null;
}

export const focusLastElement = ({ rootElemRef, elementRef }: { rootElemRef: string, elementRef: string }): void => {
    const rootElem = document.querySelector(rootElemRef);
    if (rootElem) {
        const foundElements = rootElem.querySelectorAll(elementRef) as NodeListOf<HTMLElement>;
        if (foundElements && foundElements.length > 0) {
            foundElements[foundElements.length - 1].focus();
        }
    }
}

export const getUserByEmail = async ({ context, query }: { context: Context, query: Query }): Promise<User | null> => {
    if (!context || !context.session || !context.session.user) {
        console.error('User not authenticate.');
        return null;
    }

    const userResult = await query(`
        SELECT 
          id,
          email 
        FROM 
          user 
        WHERE 
          email = ?
      `, [context.session.user.email]
    );

    if (!userResult || !userResult.length) {
        console.error('User not authenticate.');
        return null;
    }
    return userResult[0];
}