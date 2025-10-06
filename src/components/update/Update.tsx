import { useEffect } from 'react';
import { toast } from 'react-toastify';
import UpdateToast from './UpdateToast';
import { useUpdater } from '@/hooks/useUpdater';

const Update = () => {
    const { status } = useUpdater();

    useEffect(() => {
        if (status) {
            toast(<UpdateToast />, {
                className:
                    '!p-0 border border-gray-700 shadow-lg bg-background opacity-100',
                autoClose: false,
                hideProgressBar: true,
                pauseOnHover: false,
                closeOnClick: false,
            });
        }
    }, []);

    return <></>;
};

export default Update;
