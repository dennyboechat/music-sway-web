import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import TimerIcon from '@mui/icons-material/Timer';
import Tooltip from '@mui/material/Tooltip';
import BandUserStatus, { getBandUserStatusById } from '@/lib/band-user-status';

const UserInvitationStatus = ({ member }) => {
    let memberStatus = getBandUserStatusById(member.status);

    if (!memberStatus) {
        return null;
    }
    
    switch (memberStatus.name) {
        case BandUserStatus.APPROVED.name:
            memberStatus.icon = <ThumbUpOffAltIcon />;
            break;
        case BandUserStatus.DENIED.name:
            memberStatus.icon = <ThumbDownOffAltIcon />;
            break;
        case BandUserStatus.PENDING.name:
            memberStatus.icon = <TimerIcon />;
            break;
    }
    return (
        <Tooltip title={memberStatus.label}>
            {memberStatus.icon}
        </Tooltip>
    );
};

export default UserInvitationStatus;