import { v4 } from 'uuid';
import Restriction from '@/lib/song-restriction';

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