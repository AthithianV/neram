import { ToastContentProps } from 'react-toastify';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { BUY_ME_COFFEE_LINK } from '@/constants/about';

const DonateToast = ({ closeToast }: ToastContentProps) => {
    return (
        <div className="space-y-4 p-4 rounded bg-background border shadow-lg w-80">
            {/* Message */}
            <div className="text-sm sm:text-base flex-1 space-y-2">
                <h1 className="font-semibold text-sm">Enjoying Neram?</h1>
                <p className="text-sm text-muted-foreground">
                    Consider buying me a coffee to support development!
                </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-2 sm:mt-0">
                {/* Close Button */}
                <Button
                    variant={'ghost'}
                    onClick={closeToast}
                    className=" font-semibold py-1 px-3 rounded"
                >
                    Later
                </Button>

                {/* Donate Button */}
                <Button className="flex items-center gap-1 font-semibold py-1 px-3 rounded bg-rose-500 hover:bg-rose-500">
                    <a
                        href={BUY_ME_COFFEE_LINK}
                        target="_blank"
                        className="flex items-center justify-center gap-2 text-white"
                    >
                        <Heart size={16} fillRule="inherit" /> Donate
                    </a>
                </Button>
            </div>
        </div>
    );
};

export default DonateToast;
