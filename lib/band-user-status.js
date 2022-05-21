import { map } from 'lodash';

const singleton = Object.freeze({
    APPROVED: { name: 'APPROVED', id: 1, value: 'APPROVED', label: 'Approved' },
    PENDING: { name: 'PENDING', id: 2, label: 'Pending' },
    DENIED: { name: 'DENIED', id: 3, label: 'Denied' },
});

export default singleton;

export function getBandUserStatuses() {
    return map(singleton, key => {
        return {
            name: key.name,
            id: key.id,
            label: key.label,
        };
    });
}