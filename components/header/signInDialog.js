import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const SignInDialog = ({ showDialog, onCloseDialog }) => {

    if (!showDialog) {
        return null;
    }

    const onClose = () => {
        onCloseDialog();
    }

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="md"
        >
            <DialogTitle>

            </DialogTitle>
            <DialogContent>
                <Button
                    id="signInButton"
                    onClick={() => { signIn('spotify') }}
                    variant="outlined"
                    startIcon={
                        <Image
                            src="/spotify_logo.png"
                            height={30}
                            width={30}
                            alt=""
                        />
                    }
                >
                    {'Sign in with Spotify'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default SignInDialog;