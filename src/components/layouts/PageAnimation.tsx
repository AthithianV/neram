import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const PageAnimation = ({ children }: { children: ReactNode }) => {
    return <div className={cn('animate-page-fade-in')}>{children}</div>;
};

export default PageAnimation;
