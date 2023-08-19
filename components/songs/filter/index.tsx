import React from 'react';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import FilterInput from '@/components/filter-input';
import styles from '@/styles/general.module.css'

export const SearchInput = () => {
    const { songsFilterValue, setSongsFilterValue } = useSongsFilterState();

    return (
        <FilterInput
            id="searchInput"
            placeholder="title, artist, content ..."
            value={songsFilterValue}
            setValue={setSongsFilterValue}
            className={styles.general_search}
        />
    )
}