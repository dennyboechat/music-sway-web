import { v4 } from 'uuid';
import Restriction from '@/lib/restriction';

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