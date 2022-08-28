import Avatar from '@mui/material/Avatar';
import { useSession } from 'next-auth/react';

const UserAvatar = () => {
    const { data: session } = useSession();

    if (!session || !session.token) {
        return null;
    }

    return (
        <Avatar
            id="user_main_menu_avatar"
            src={session.token.picture}
        >
            {session.token.name}
        </Avatar>
    );
}

export default UserAvatar;