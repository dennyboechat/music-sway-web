import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalPlayIcon from '@mui/icons-material/LocalPlay';
import Restriction, { getRestrictions, getRestrictionById } from '@/lib/restriction';
import { forEach } from 'lodash';

const RestrictionSelection = ({ id, selectedRestrictionId, onChange }) => {

    const restrictions = [];
    forEach(getRestrictions(), restriction => {
        let icon;
        switch (restriction.name) {
            case Restriction.BAND.name:
                icon = (
                    <Tooltip title="BAND. Only members of your band can see this.">
                        <LocalPlayIcon />
                    </Tooltip>
                );
                break;
            case Restriction.PRIVATE.name:
                icon = (
                    <Tooltip title="PRIVATE. Only you can see this.">
                        <VisibilityOffIcon />
                    </Tooltip>
                )
                break;
            case Restriction.PUBLIC.name:
                icon = (
                    <Tooltip title="PUBLIC. Anyone can see this.">
                        <VisibilityIcon />
                    </Tooltip>
                );
                break;
        }
        restrictions.push(
            <ToggleButton
                key={restriction.id}
                value={restriction.name}
            >
                {icon}
            </ToggleButton >
        );
    });

    const restrictionName = getRestrictionById(selectedRestrictionId).name;

    return (
        <ToggleButtonGroup
            id={id}
            color="primary"
            value={restrictionName}
            exclusive
            onChange={(e, value) => onChange(value)}
        >
            {restrictions}
        </ToggleButtonGroup>
    );
}

export default RestrictionSelection;

