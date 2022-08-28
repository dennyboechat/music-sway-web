import React from 'react';
import Router from 'next/router';
import { useAuthProvider } from '@/lib/auth-provider';
import HeaderPanel from '@/components/header/header-panel';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import FloatingButton from '@/components/floating-button';
import SaveIcon from '@mui/icons-material/Save';
import styles from '@/styles/general.module.css';
import { createUser } from '@/graphQl/mutations';
import { GraphQLClient } from 'graphql-request';
import { useMessageState } from '@/lib/message-store';
import { songsQuery } from '@/graphQl/queries';
import { validateUser } from '@/lib/utils';
import { useSWRConfig } from 'swr';

const NewUserPage = () => {
    const { newUser } = useAuthProvider();
    const { setAlertMessage } = useMessageState();
    const [userName, setUserName] = React.useState(newUser?.name);
    const [hasErrors, setHasErrors] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const { mutate } = useSWRConfig();

    if (!newUser) {
        return null;
    }

    const onSave = ({ }) => async () => {
        const invalidMessages = validateUser({ userName });
        if (invalidMessages.length) {
            setHasErrors(true);
            setAlertMessage({ message: `Yoo fill mandatory fields: ${invalidMessages.join(', ')}`, severity: 'error' });
            return;
        }

        setSaving(true);

        let variables = {
            input: {
                name: userName,
                email: newUser.email,
            }
        }

        try {
            const graphQLClient = new GraphQLClient('/api/create-user');
            await graphQLClient.request(createUser, variables);
        } catch (error) {
            console.error(error);
            setAlertMessage({ message: `Damn it!Some error occurred.`, severity: 'error' });
            setSaving(false);
            return;
        }
        mutate(songsQuery);
        setAlertMessage({ message: `${userName} was saved.`, severity: 'success' });
        setSaving(false);
        Router.push('/');
    };

    const disabled = saving;

    return (
        <>
            <HeaderPanel showSignInButton={false} />
            <Container className={styles.content_container}>
                <Grid container item xs={12} lg={6}>
                    {newUser.photo &&
                        <Avatar
                            id="user_avatar"
                            src={newUser.photo}
                            sx={{ width: 56, height: 56 }}
                            className="default_bottom_margin"
                        />
                    }
                    <TextField
                        id="userName"
                        label="Your Name"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        required
                        fullWidth
                        autoFocus
                        autoComplete="off"
                        className="default_bottom_margin"
                        inputProps={{ maxLength: 255 }}
                        error={hasErrors}
                        helperText={hasErrors ? "I know, I know, but we need to know your name." : null}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        value={newUser.email}
                        fullWidth
                        className="default_bottom_margin"
                        disabled
                    />
                </Grid>
                <div className={styles.fab_buttons}>
                    <FloatingButton
                        id="saveNewUserButton"
                        aria-label="save"
                        disabled={disabled}
                        label={saving ? 'Saving' : 'Save'}
                        icon={<SaveIcon />}
                        onClick={onSave()}
                    />
                </div>
            </Container>
        </>
    );
}

export default NewUserPage;