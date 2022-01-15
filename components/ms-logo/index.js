import Image from 'next/image';

const MsLogo = ({ className }) => {
    return (
        <Image
            src="/ms_logo.png"
            height={30}
            width={30}
            alt=""
            className={className}
        />
    );
}

export default MsLogo;