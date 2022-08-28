import { find, map } from 'lodash';

const singleton = Object.freeze({
    PUBLIC: { name: 'PUBLIC', id: 3, value: 'PUBLIC', label: 'Public' },
    PRIVATE: { name: 'PRIVATE', id: 1, label: 'Private' },
    BAND: { name: 'BAND', id: 2, label: 'Band' },
});

export default singleton;

export const getRestrictions = () => {
    return map(singleton, key => {
        return {
            name: key.name,
            id: key.id,
            label: key.label,
        };
    });
};

export const getRestrictionByName = (name) => {
    return find(singleton, key => { return key.name === name });
};

export const getRestrictionById = (id) => {
    return find(singleton, key => { return key.id === id });
};