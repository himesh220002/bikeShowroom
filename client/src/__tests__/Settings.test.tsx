import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPage from '@/app/admin/settings/page';
import { act } from 'react';
import { API_URL } from '@/lib/config';

describe('SettingsPage', () => {
    const mockSettings = {
        success: true,
        data: {
            showroomPhone: '+91 91223 45678',
            showroomEmail: 'contact@test.com',
            showroomAddress: 'Test Address',
            showroomMap: 'https://maps.test.com',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('renders loading state initially', async () => {
        (global.fetch as jest.Mock).mockReturnValue(new Promise(() => { })); // Never resolves
        render(<SettingsPage />);
        expect(screen.getByText(/Loading Configuration.../i)).toBeInTheDocument();
    });

    it('renders settings after fetching', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockSettings),
        });

        await act(async () => {
            render(<SettingsPage />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('+91 91223 45678')).toBeInTheDocument();
            expect(screen.getByDisplayValue('contact@test.com')).toBeInTheDocument();
        });
    });

    it('updates settings on input change', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockSettings),
        });

        await act(async () => {
            render(<SettingsPage />);
        });

        const emailInput = screen.getByDisplayValue('contact@test.com') as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
        expect(emailInput.value).toBe('new@test.com');
    });

    it('saves settings successfully', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockSettings),
            })
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({ success: true }),
            });

        await act(async () => {
            render(<SettingsPage />);
        });

        const saveButton = screen.getByText('Save Settings');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `${API_URL}/config`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        settings: {
                            showroomPhone: '+91 91223 45678',
                            showroomEmail: 'contact@test.com',
                            showroomAddress: 'Test Address',
                            showroomMap: 'https://maps.test.com',
                        }
                    }),
                })
            );
            expect(screen.getByText('Saved Successfully')).toBeInTheDocument();
        });
    });
});
