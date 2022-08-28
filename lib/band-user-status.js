import { map, find } from 'lodash';

const singleton = Object.freeze({
    APPROVED: { name: 'APPROVED', id: 1, label: 'Approved' },
    PENDING: { name: 'PENDING', id: 2, label: 'Pending Confirmation' },
    DENIED: { name: 'DENIED', id: 3, label: 'Denied' },
});

export default singleton;

export const getBandUserStatuses = () => {
    return map(singleton, key => {
        return {
            name: key.name,
            id: key.id,
            label: key.label,
        };
    });
};

export const getBandUserStatusById = (id) => {
    if (id) {
        return find(singleton, key => { return key.id === Number(id) });
    }
    return null;
};