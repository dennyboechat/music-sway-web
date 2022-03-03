import { find, map } from 'lodash';

const singleton = Object.freeze({
    PRIVATE: { name: 'PRIVATE', id: 1, label: 'Private' },
    BAND: { name: 'BAND', id: 2, label: 'Band' },
    PUBLIC: { name: 'PUBLIC', id: 3, value: 'PUBLIC', label: 'Public' },
});

export default singleton;

export function getRestrictions() {
    return map(singleton, key => {
        return {
            name: key.name,
            id: key.id,
            label: key.label,
        };
    });
}

export function getRestrictionByName(name) {
    return find(singleton, key => { return key.name === name });
}

export function getRestrictionById(id) {
    return find(singleton, key => { return key.id === id });
}