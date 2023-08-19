import { RestrictionItem } from '@/components/types/RestrictionProps';

export interface RestrictionSelection {
    id: string,
    selectedRestrictionId?: number,
    onChange: (value: string) => void,
    options: RestrictionItem[],
}