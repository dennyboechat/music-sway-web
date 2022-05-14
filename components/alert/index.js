import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useMessageState } from '@/lib/message-store';

const AlertMessage = () => {
    const { alertMessage, setAlertMessage } = useMessageState();
    if (!alertMessage || !alertMessage.message) {
        return null;
    }

    const onCloseAlert = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertMessage({});
    };

    return (
        <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={onCloseAlert}
        >
            <Alert
                severity={alertMessage?.severity}
                onClose={onCloseAlert}
            >
                {alertMessage?.message}
            </Alert>
        </Snackbar>
    );
};

export default AlertMessage;