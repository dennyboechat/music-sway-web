import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '@/styles/general.module.css';

const ConfirmButtonGroup = ({
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
            <ButtonGroup variant="outlined">
                <Button onClick={onConfirm} disabled={disabled}>
                    {confirmLabel}
                </Button>
                <Button onClick={onCancel} disabled={disabled}>
                    {cancelLabel}
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default ConfirmButtonGroup;