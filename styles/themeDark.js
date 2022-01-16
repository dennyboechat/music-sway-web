import { createTheme } from '@mui/material/styles';

const themeDark = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#000",
        },
        primary: {
            main: '#00BFFF',
        },
    },
});

export default themeDark;