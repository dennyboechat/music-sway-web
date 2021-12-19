import { v4 } from 'uuid';

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
    };
}

export const validateSong = ({ songTitle }) => {
    const invalidMessages = [];
    if (!songTitle || songTitle.trim().length === 0) {
        invalidMessages.push('title');
    }
    return invalidMessages;
}