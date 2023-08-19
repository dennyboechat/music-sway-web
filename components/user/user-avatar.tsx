import Avatar from '@mui/material/Avatar';
import { useSession } from 'next-auth/react';

export const UserAvatar = () => {
    const { data: session } = useSession();

    if (!session || !session.user) {
        return null;
    }

    return (
        <Avatar
            id="user_main_menu_avatar"
            src={session.user.image ?? undefined}
        />
    );
}