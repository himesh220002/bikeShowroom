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
    });

    it('renders the form correctly', () => {
        render(<LeadForm />);
        expect(screen.getByPlaceholderText("Who's riding?")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Mobile number")).toBeInTheDocument();
        expect(screen.getByText("INITIATE INQUIRY")).toBeInTheDocument();
    });

    it('submits the form successfully without CAPTCHA', async () => {
        (submitLead as jest.Mock).mockResolvedValue({
            success: true,
            data: { score: 85 },
            message: 'Success'
        });

        render(<LeadForm />);

        fireEvent.change(screen.getByPlaceholderText("Who's riding?"), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText("Mobile number"), { target: { value: '9876543210' } });

        // Select an interest
        const r15Option = screen.getByText("R15 Series");
        fireEvent.click(r15Option);

        const submitButton = screen.getByText("INITIATE INQUIRY");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(submitLead).toHaveBeenCalled();
            expect(screen.getByText("Your Ride Awaits!")).toBeInTheDocument();
            // Verify connection buttons exist
            expect(screen.getByText("Get Directions")).toBeInTheDocument();
            expect(screen.getByText("Chat on WhatsApp")).toBeInTheDocument();
            expect(screen.getByText("Call Showroom")).toBeInTheDocument();
        });
    });

    it('shows a server error on submission failure', async () => {
        (submitLead as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Server side validation error'
        });

        render(<LeadForm />);

        fireEvent.change(screen.getByPlaceholderText("Who's riding?"), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText("Mobile number"), { target: { value: '9876543210' } });

        fireEvent.click(screen.getByText("R15 Series"));

        fireEvent.click(screen.getByText("INITIATE INQUIRY"));

        await waitFor(() => {
            expect(screen.getByText('Server side validation error')).toBeInTheDocument();
        });
    });

    it('auto-selects interest based on bikeModel prop', () => {
        render(<LeadForm bikeModel="Yamaha R15 V4" />);
        const r15Checkbox = screen.getByDisplayValue("R15 Series") as HTMLInputElement;
        expect(r15Checkbox.checked).toBe(true);
    });

    it('captures UTM parameters from URL', async () => {
        // Robust way to mock search params without triggering JSDOM navigation errors
        const mockSearchParams = new URLSearchParams("utm_source=test_source&utm_medium=test_medium");
        const getSpy = jest.spyOn(URLSearchParams.prototype, 'get');
        getSpy.mockImplementation((key) => mockSearchParams.get(key));

        render(<LeadForm />);

        // The UTM tags are in hidden inputs
        const sourceInput = document.querySelector('input[name="utm_source"]') as HTMLInputElement;
        const mediumInput = document.querySelector('input[name="utm_medium"]') as HTMLInputElement;

        expect(sourceInput?.value).toBe("test_source");
        expect(mediumInput?.value).toBe("test_medium");

        getSpy.mockRestore();
    });
});
