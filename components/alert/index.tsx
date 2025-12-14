import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useMessageState } from '@/lib/message-store';

const AlertMessage = () => {
    const { alertMessage, setAlertMessage } = useMessageState();
    if (!alertMessage || !alertMessage.message) {
        return null;
    }

    const onCloseSnackbar = (e: React.SyntheticEvent | Event, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertMessage({});
    };

    return (
        <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={onCloseSnackbar}
        >
            <Alert
                severity={alertMessage?.severity}
                onClose={() => setAlertMessage({})}
            >
                {alertMessage?.message}
            </Alert>
        </Snackbar>
    );
};

export default AlertMessage;