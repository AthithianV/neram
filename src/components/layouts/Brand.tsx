import NeramLogo from '@/assets/logo.png';

const Brand = () => {
    return (
        <div className="px-2">
            <div className="font-bold flex items-center gap-2 p-0 hover:bg-transparent">
                <div className="flex items-center gap-2">
                    <img
                        src={NeramLogo}
                        alt="Neram Logo"
                        className="h-5 w-5 rounded-md"
                    />
                    <span className="text-base font-semibold whitespace-nowrap">
                        Neram
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Brand;
