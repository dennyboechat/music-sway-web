import { v4 } from 'uuid';
import Restriction from '@/lib/restriction';
import { orderBy, forEach } from 'lodash';

export const getNewSongEntry = () => {
    return {
        uuid: v4(),
        id: null,
        title: '',
        content: '',
    }
}

export const getNewSong = ({ addEntry }) => {
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

export const getNewPlaylist = () => {
    return {
        id: null,
        name: '',
        observation: '',
        restrictionId: Restriction.PUBLIC.id,
        entries: [],
    };
}

export const validateSong = ({ songTitle, songRestrictionId }) => {
    const invalidMessages = [];
    if (!songTitle || songTitle.trim.length) {
        invalidMessages.push('Title');
    }
    if (!songRestrictionId) {
        invalidMessages.push('Restriction');
    }
    return invalidMessages;
}

export const validatePlaylist = ({ playlistName, playlistRestrictionId }) => {
    const invalidMessages = [];
    if (!playlistName || playlistName.trim.length) {
        invalidMessages.push('Playlist Name');
    }
    if (!playlistRestrictionId) {
        invalidMessages.push('Restriction');
    }
    return invalidMessages;
}

export const validateBand = ({ bandName }) => {
    const invalidMessages = [];
    if (!bandName || bandName.trim.length) {
        invalidMessages.push('Band Name');
    }
    return invalidMessages;
}

export const getParsedCharacterText = ({ text }) => {
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

export const scrollToPageTop = () => {
    window.scrollTo({
        top: 0,
    });
}

export const scrollSmoothlyToPageTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

export const autoPageScrollDownStart = (speed = 100) => {
    scroll = setInterval(
        () => { window.scrollBy(0, 1); },
        speed
    );
}

export const autoPageScrollDownStop = () => {
    clearInterval(scroll);
}

export const filterSongs = ({ songs, songsFilterValue }) => {
    let sortedSongs = [];
    if (songs.length) {
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

export const validateEmail = ({ email }) => {
    if (email && email.trim().length) {
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        if (!regexExp.test(email)) {
            return `Email ${email} is invalid.`;
        }
    }
    return null;
}

export const focusLastElement = ({ rootElemRef, elementRef }) => {
    const rootElem = document.querySelector(rootElemRef);
    if (rootElem) {
        const foundElements = rootElem.querySelectorAll(elementRef);
        if (foundElements) {
            return foundElements[foundElements.length - 1].focus();
        }
    }
    return null;
}