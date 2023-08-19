export interface RestrictionItem {
    name: string;
    id: number;
    label: string;
}

export interface Restriction {
    PUBLIC: RestrictionItem;
    PRIVATE: RestrictionItem;
    BAND: RestrictionItem;
}
