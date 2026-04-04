import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(customer)/login/page';
import { useAuth } from '@/context/AuthContext';
import { act } from 'react';

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

describe('LoginPage', () => {
    const mockLogin = jest.fn();
    const mockLoginLocal = jest.fn();
    const mockRegister = jest.fn();

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            user: null,
            login: mockLogin,
            loginLocal: mockLoginLocal,
            register: mockRegister,
        });

        // Mock window.location for navigation
        const location = new URL('http://localhost') as any;
        location.assign = jest.fn();
        location.replace = jest.fn();
        delete (window as any).location;
        window.location = location;
    });



    it('renders login options initially', () => {
        render(<LoginPage />);
        expect(screen.getByText('Join the Garage')).toBeInTheDocument();
        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
        expect(screen.getByText('Guest Login')).toBeInTheDocument();
        expect(screen.getByText('New Account')).toBeInTheDocument();
    });

    it('switches to login mode when Guest Login is clicked', () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByText('Guest Login'));
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Authorize Mission/i })).toBeInTheDocument();
    });

    it('switches to register mode when New Account is clicked', () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByText('New Account'));
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Ignite Journey/i })).toBeInTheDocument();
    });

    it('calls loginLocal on login form submission', async () => {
        mockLoginLocal.mockResolvedValue({ success: true });
        render(<LoginPage />);

        fireEvent.click(screen.getByText('Guest Login'));

        fireEvent.change(screen.getByPlaceholderText('rider@yamaha.com'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByRole('button', { name: /Authorize Mission/i }));

        await waitFor(() => {
            expect(mockLoginLocal).toHaveBeenCalledWith({
                email: 'test@test.com',
                password: 'password123',
            });
        });
    });

    it('calls register on register form submission', async () => {
        mockRegister.mockResolvedValue({ success: true });
        render(<LoginPage />);

        fireEvent.click(screen.getByText('New Account'));

        fireEvent.change(screen.getByPlaceholderText('Yamaha Rider'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('rider@yamaha.com'), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByRole('button', { name: /Ignite Journey/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                displayName: 'John Doe',
                email: 'john@test.com',
                password: 'password123',
            });
        });
    });

    it('shows error message on failed login', async () => {
        mockLoginLocal.mockResolvedValue({ success: false, message: 'Invalid credentials' });
        render(<LoginPage />);

        fireEvent.click(screen.getByText('Guest Login'));

        fireEvent.change(screen.getByPlaceholderText('rider@yamaha.com'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } });

        fireEvent.submit(screen.getByRole('button', { name: /Authorize Mission/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
