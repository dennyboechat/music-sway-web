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
        secondary: {
            main: '#FFF',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            1300: 1300,
            xl: 1536,
        },
    },
});

export default themeDark;