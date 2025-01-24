import { selectAuthUserId } from '@/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { useNavigate } from '@tanstack/react-router';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
}

export function ProtectedRoute({ children }: Readonly<Props>) {
    const navigate = useNavigate();
    const userId = useAppSelector(selectAuthUserId);
    if (!userId) {
        console.warn('User is not authenticated. Redirecting to home page.');
        navigate({ to: '/' });
        return null;
    }
    return (
        <>
            {children}
        </>
    );
};
