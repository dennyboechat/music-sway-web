import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import styles from '@/styles/general.module.css';

const ConfirmButtonFab = ({ confirmLabel = 'Yes', cancelLabel = 'No', text = 'Confirm?', onConfirm, onCancel }) => {
    return (
        <div className={styles.confirm_buttons_wrapper}>
            <Typography component="h4" color="primary">
                {text}
            </Typography>
            <Fab
                color="primary"
                variant="extended"
                onClick={onConfirm}
            >
                {confirmLabel}
            </Fab>
            <Fab
                color="secondary"
                variant="extended"
                onClick={onCancel}
            >
                {cancelLabel}
            </Fab>
        </div>
    );
};

export default ConfirmButtonFab;