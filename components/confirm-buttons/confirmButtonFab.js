import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import styles from '@/styles/general.module.css';

const ConfirmButtonFab = ({
    confirmLabel = 'Yes',
    cancelLabel = 'No',
    text = 'Sure?',
    onConfirm,
    onCancel,
    disabled = false,
}) => {
    return (
        <div className={styles.confirm_buttons_wrapper}>
            <Typography component="h4" color="primary">
                {text}
            </Typography>
            <Fab
                color="primary"
                variant="extended"
                onClick={onConfirm}
                disabled={disabled}
            >
                {confirmLabel}
            </Fab>
            <Fab
                color="secondary"
                variant="extended"
                onClick={onCancel}
                disabled={disabled}
            >
                {cancelLabel}
            </Fab>
        </div>
    );
};

export default ConfirmButtonFab;