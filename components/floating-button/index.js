import Fab from '@mui/material/Fab';
import useMediaQuery from '@mui/material/useMediaQuery';

const FloatingButton = ({
    id,
    color = 'primary',
    variant = 'extended',
    size = 'large',
    disabled = false,
    label,
    title,
    icon,
    ariaLabel,
    href,
    onClick,
}) => {

    const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('sm'));
    if (!isBiggerResolution) {
        size = 'small';
    }

    return (
        <Fab
            id={id}
            color={color}
            variant={variant}
            size={size}
            disabled={disabled}
            title={title}
            aria-label={ariaLabel}
            href={href}
            onClick={onClick}
        >
            {icon}
            {label}
        </Fab>
    );
};

export default FloatingButton;