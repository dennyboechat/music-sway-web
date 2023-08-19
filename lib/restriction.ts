import { find, map } from 'lodash';
import { Restriction, RestrictionItem } from '@/components/types/RestrictionProps';

const singleton: Restriction = Object.freeze({
    PUBLIC: { name: 'PUBLIC', id: 3, label: 'Public' },
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

export const getRestrictionByName = (name: string) => {
    return find(singleton, key => { return key.name === name });
};

export const getRestrictionById = (id?: number): RestrictionItem | undefined => {
    return find(singleton, key => { return key.id === id });
};