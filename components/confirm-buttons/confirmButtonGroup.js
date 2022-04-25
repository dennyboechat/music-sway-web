import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '@/styles/general.module.css';

const ConfirmButtonGroup = ({ confirmLabel = 'Yes', cancelLabel = 'No', text = 'Confirm?', onConfirm, onCancel }) => {
    return (
        <div className={styles.confirm_buttons_wrapper}>
            <Typography component="h4" color="primary">
                {text}
            </Typography>
            <ButtonGroup variant="outlined">
                <Button onClick={onConfirm}>
                    {confirmLabel}
                </Button>
                <Button onClick={onCancel}>
                    {cancelLabel}
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default ConfirmButtonGroup;