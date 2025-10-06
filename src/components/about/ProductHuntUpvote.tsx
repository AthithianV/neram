import { ToastContentProps } from 'react-toastify';
import { ArrowBigUpDashIcon, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { PRODUCT_HUNT_REVIEW_LINK } from '@/constants/about';

const ProductHuntUpvote = ({ closeToast }: ToastContentProps) => {
    return (
        <div className="space-y-4 p-4 rounded bg-background border shadow-lg w-80">
            {/* Message */}
            <div className="text-sm sm:text-base flex-1 space-y-2">
                <h1 className="font-semibold text-sm">Enjoying Neram?</h1>
                <p className="text-sm text-muted-foreground">
                    Please, Consider upvoting Neram in product Hunt! Leave
                    Positive Review
                </p>
            </div>

            <ul className="w-full flex items-center justify-between px-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <li key={star}>
                        <Star className="text-yellow-400" fill="currentColor" />
                    </li>
                ))}
            </ul>

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
                <Button className="flex items-center gap-1 font-semibold px-0 py-0 rounded bg-orange-500 hover:bg-orange-600">
                    <a
                        href={PRODUCT_HUNT_REVIEW_LINK}
                        target="_blank"
                        className="flex items-center justify-center gap-2 text-white py-1 px-3"
                    >
                        <ArrowBigUpDashIcon size={16} fillRule="inherit" />{' '}
                        Upvote
                    </a>
                </Button>
            </div>
        </div>
    );
};

export default ProductHuntUpvote;
