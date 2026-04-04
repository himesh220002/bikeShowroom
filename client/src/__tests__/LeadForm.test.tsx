import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadForm } from '@/components/features/LeadForm';
import { submitLead } from '@/lib/actions/leadActions';

// Mock the leadActions
jest.mock('@/lib/actions/leadActions', () => ({
    submitLead: jest.fn(),
}));

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        user: null,
        loading: false
    }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));


describe('LeadForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.alert = jest.fn();
    });

    it('renders the form correctly', () => {
        render(<LeadForm />);
        expect(screen.getByPlaceholderText("Who's riding?")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Mobile number")).toBeInTheDocument();
        expect(screen.getByText("INITIATE INQUIRY")).toBeInTheDocument();
    });

    it('validates mobile number to 10 digits', () => {
        render(<LeadForm />);
        const phoneInput = screen.getByPlaceholderText("Mobile number") as HTMLInputElement;

        fireEvent.input(phoneInput, { target: { value: '123456789012' } });
        expect(phoneInput.value).toBe('1234567890'); // maxLength is 10, but onInput also cleans
    });

    it('submits the form successfully', async () => {
        (submitLead as jest.Mock).mockResolvedValue({
            success: true,
            data: { score: 85 },
            message: 'Success'
        });

        render(<LeadForm />);

        fireEvent.change(screen.getByPlaceholderText("Who's riding?"), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText("Mobile number"), { target: { value: '9876543210' } });

        // Select an interest
        fireEvent.click(screen.getByText("R15 Series"));

        // Solve Captcha
        const captchaText = screen.getByText(/What is \d+ \+ \d+ = \?/).textContent;
        const matches = captchaText?.match(/(\d+) \+ (\d+)/);
        if (matches) {
            const sum = parseInt(matches[1]) + parseInt(matches[2]);
            fireEvent.change(screen.getByPlaceholderText("Sum..."), { target: { value: sum.toString() } });
        }

        const submitButton = screen.getByText("INITIATE INQUIRY");
        fireEvent.click(submitButton);


        await waitFor(() => {
            expect(submitLead).toHaveBeenCalled();
            expect(screen.getByText("Inquiry Logged!")).toBeInTheDocument();
            expect(screen.getByText("Lead Priority Score: 85")).toBeInTheDocument();
        });
    });

    it('shows an alert on submission failure', async () => {
        (submitLead as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Validation error'
        });

        render(<LeadForm />);

        fireEvent.change(screen.getByPlaceholderText("Who's riding?"), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText("Mobile number"), { target: { value: '9876543210' } });

        // Select an interest
        fireEvent.click(screen.getByText("R15 Series"));

        // Solve Captcha
        const captchaText = screen.getByText(/What is \d+ \+ \d+ = \?/).textContent;
        const matches = captchaText?.match(/(\d+) \+ (\d+)/);
        if (matches) {
            const sum = parseInt(matches[1]) + parseInt(matches[2]);
            fireEvent.change(screen.getByPlaceholderText("Sum..."), { target: { value: sum.toString() } });
        }

        fireEvent.click(screen.getByText("INITIATE INQUIRY"));


        await waitFor(() => {
            expect(screen.getByText('Validation error')).toBeInTheDocument();
        });
    });


    it('auto-selects interest based on bikeModel prop', () => {
        render(<LeadForm bikeModel="Yamaha R15 V4" />);
        const r15Checkbox = screen.getByDisplayValue("R15 Series") as HTMLInputElement;
        expect(r15Checkbox.checked).toBe(true);
    });
});
