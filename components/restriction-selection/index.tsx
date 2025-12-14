import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalPlayIcon from '@mui/icons-material/LocalPlay';
import Restriction, { getRestrictions, getRestrictionById } from '@/lib/restriction';
import { forEach } from 'lodash';
import type { RestrictionSelection } from '@/components/types/RestrictionSelectionProps';

const RestrictionSelection = ({
    id,
    selectedRestrictionId,
    onChange,
    options,
}: RestrictionSelection) => {
    const restrictions: React.ReactElement[] = [];
    forEach(getRestrictions(), restriction => {
        let icon;
        switch (restriction.name) {
            case Restriction.BAND.name:
                if (options.includes(Restriction.BAND)) {
                    icon = (
                        <Tooltip title="BAND. Only members of your band can see this.">
                            <LocalPlayIcon />
                        </Tooltip>
                    );
                }
                break;
            case Restriction.PRIVATE.name:
                if (options.includes(Restriction.PRIVATE)) {
                    icon = (
                        <Tooltip title="PRIVATE. Only you can see this.">
                            <VisibilityOffIcon />
                        </Tooltip>
                    )
                }
                break;
            case Restriction.PUBLIC.name:
                if (options.includes(Restriction.PUBLIC)) {
                    icon = (
                        <Tooltip title="PUBLIC. Anyone can see this.">
                            <VisibilityIcon />
                        </Tooltip>
                    );
                }
                break;
        }
        if (icon) {
            restrictions.push(
                <ToggleButton
                    key={restriction.id}
                    value={restriction.name}
                >
                    {icon}
                </ToggleButton >
            );
        }
    });

    const restrictionName = getRestrictionById(selectedRestrictionId)?.name;

    return (
        <ToggleButtonGroup
            id={id}
            color="primary"
            value={restrictionName}
            exclusive
            onChange={(e: React.MouseEvent<HTMLElement>, value: string) => onChange(value)}
        >
            {restrictions}
        </ToggleButtonGroup>
    );
}

export default RestrictionSelection;

