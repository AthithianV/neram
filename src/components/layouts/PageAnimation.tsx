import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.1, type: 'spring', stiffness: 300, damping: 25 },
    },
    exit: {
        opacity: 0,
        y: 40,
        transition: { duration: 0.15 },
    },
};

const PageAnimation = ({ children }: { children: ReactNode }) => {
    return (
        <AnimatePresence>
            <motion.div
                className="main-content-height w-full p-[var(--page-padding)]"
                variants={pageVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageAnimation;
