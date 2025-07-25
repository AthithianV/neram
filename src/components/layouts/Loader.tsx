import { Loader } from 'lucide-react';

const LoaderWrapper = () => {
    return (
        <div className="h-full w-full flex items-center justify-center text-sky-400">
            <Loader className="animate-spin h-10 w-10" />
        </div>
    );
};

export default LoaderWrapper;
