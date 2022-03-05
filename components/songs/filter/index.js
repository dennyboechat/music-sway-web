import React from 'react';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import FilterInput from '@/components/filter-input';

const SearchInput = () => {
    const { songsFilterValue, setSongsFilterValue } = useSongsFilterState();

    return (
        <FilterInput
            id="searchInput"
            placeholder="title, artist, content ..."
            value={songsFilterValue}
            setValue={setSongsFilterValue}
        />
    )
}

export default SearchInput;