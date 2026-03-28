import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SaleForm } from '@/components/features/SaleForm';

describe('SaleForm', () => {
    const mockBikes = [
        {
            _id: '1',
            name: 'R15 V4',
            colors: [
                { name: 'Racing Blue', stock: 5, price: '1,82,000' },
                { name: 'Metallic Red', stock: 2, price: '1,81,000' },
            ],
        },
    ];
    const mockOnSaleComplete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        window.alert = jest.fn();
    });

    it('renders the form correctly', () => {
        render(<SaleForm bikes={mockBikes} onSaleComplete={mockOnSaleComplete} />);
        expect(screen.getByText(/Record New/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter customer name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("10-digit Phone Number")).toBeInTheDocument();
    });

    it('updates form data on input change', () => {
        render(<SaleForm bikes={mockBikes} onSaleComplete={mockOnSaleComplete} />);

        const nameInput = screen.getByPlaceholderText("Enter customer name") as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(nameInput.value).toBe('John Doe');

        const phoneInput = screen.getByPlaceholderText("10-digit Phone Number") as HTMLInputElement;
        fireEvent.change(phoneInput, { target: { value: '1234567890' } });
        expect(phoneInput.value).toBe('1234567890');
    });

    it('populates price when a bike is selected', () => {
        render(<SaleForm bikes={mockBikes} onSaleComplete={mockOnSaleComplete} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1|Racing Blue' } });

        const priceInput = screen.getByPlaceholderText("0.00") as HTMLInputElement;
        expect(priceInput.value).toBe('182000');
    });

    it('submits the form successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        render(<SaleForm bikes={mockBikes} onSaleComplete={mockOnSaleComplete} />);

        fireEvent.change(screen.getByPlaceholderText("Enter customer name"), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText("10-digit Phone Number"), { target: { value: '9876543210' } });

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1|Racing Blue' } });

        const submitButton = screen.getByText("Confirm & Record Sale");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/sales",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        customerName: "John Doe",
                        customerPhone: "9876543210",
                        bikeId: "1",
                        variant: "Racing Blue",
                        salePrice: "182000",
                    }),
                })
            );
            expect(mockOnSaleComplete).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith("🎉 Sale recorded successfully! Inventory updated.");
        });
    });

    it('shows error message on failure', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue({ success: false, message: 'Internal Server Error' }),
        });

        render(<SaleForm bikes={mockBikes} onSaleComplete={mockOnSaleComplete} />);

        fireEvent.change(screen.getByPlaceholderText("Enter customer name"), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText("10-digit Phone Number"), { target: { value: '9876543210' } });

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1|Racing Blue' } });

        fireEvent.click(screen.getByText("Confirm & Record Sale"));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Error: Internal Server Error");
        });
    });
});
