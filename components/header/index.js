import Head from 'next/head';

const Header = ({ titleSuffix }) => {

    return (
        <Head>
            <title>{`Music Sway ${titleSuffix || ''}`}</title>
            <meta name="description" content="Manage music you play" />
            <link rel="icon" href="/ms_logo.png" />
        </Head>
    );
}

export default Header;