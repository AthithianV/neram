import NeramLogo from '@/assets/logo.png';

const LoadingPage = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <img src={NeramLogo} alt="Neram Logo" className="h-20 w-20 animate-pulse" />
        </div>
    );
};

export default LoadingPage;
