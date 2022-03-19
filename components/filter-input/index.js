import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import styles from '@/styles/general.module.css'
import classnames from 'classnames';

const FilterInput = ({ id, placeholder, value, setValue, className }) => {
    const inputRef = React.useRef();

    const onCleanButtonClick = () => {
        setValue('');
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }

    className = classnames(styles.search, className);

    return (
        <div className={className}>
            <TextField
                id={id}
                placeholder={placeholder}
                autoComplete="off"
                value={value}
                fullWidth={true}
                onChange={e => setValue(e.target.value)}
                inputRef={inputRef}
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>,
                    endAdornment:
                        <InputAdornment position="end">
                            {value && value.length &&
                                <IconButton
                                    id={`${id}_filterCleanButton`}
                                    className={styles.icon_button}
                                    onClick={onCleanButtonClick}
                                >
                                    <CloseIcon />
                                </IconButton>
                            }
                        </InputAdornment>,
                    classes: {
                        notchedOutline: styles.search_input,
                    },
                }}
            />
        </div>
    );
}

export default FilterInput;