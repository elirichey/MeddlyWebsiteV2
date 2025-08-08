import { render, screen, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import Snackbar from '../../Notifications/Snackbar';
import { useSnackbarStore } from '@/storage/stores/useSnackbarStore';

// Mock the store for testing
jest.mock('@/storage/stores/useSnackbarStore', () => ({
	useSnackbarStore: jest.fn(),
}));

const mockUseSnackbarStore = useSnackbarStore as jest.MockedFunction<typeof useSnackbarStore>;

describe('Snackbar Component', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		// Reset the mock before each test
		mockUseSnackbarStore.mockReturnValue({
			snackbar: null,
			setSnackbar: jest.fn(),
		});
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('should not render when snackbar is null', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: null,
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
		});

		it('should not render when show is false', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Test message',
					description: 'Test description',
					type: 'general',
					duration: 3000,
					show: false,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
		});

		it('should render when show is true', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Test message',
					description: 'Test description',
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			expect(screen.getByText('Test message')).toBeInTheDocument();
			expect(screen.getByText('Test description')).toBeInTheDocument();
			expect(screen.getByTestId('snackbar')).toHaveAttribute('id', 'snackbar');
		});

		it('should render title in snackbar-text1 div', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Primary message',
					description: 'Secondary message',
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			const text1Element = screen.getByText('Primary message');
			expect(text1Element).toBeInTheDocument();
			expect(text1Element).toHaveAttribute('id', 'snackbar-text1');
		});

		it('should render description in snackbar-text2 div', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Primary message',
					description: 'Secondary message',
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			const text2Element = screen.getByText('Secondary message');
			expect(text2Element).toBeInTheDocument();
			expect(text2Element).toHaveAttribute('id', 'snackbar-text2');
		});

		it('should not render description when undefined', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Primary message',
					description: undefined as any,
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			expect(screen.getByText('Primary message')).toBeInTheDocument();
			expect(screen.queryByTestId('snackbar-text2')).not.toBeInTheDocument();
		});

		it('should have correct CSS classes and type', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Test message',
					description: 'Test description',
					type: 'success',
					duration: 3000,
					show: true,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			const snackbarElement = screen.getByTestId('snackbar');
			expect(snackbarElement).toHaveClass('show');
			expect(snackbarElement).toHaveClass('success');
		});

		it('should handle different types', () => {
			const types = ['success', 'error', 'warning', 'general'] as const;

			for (const type of types) {
				mockUseSnackbarStore.mockReturnValue({
					snackbar: {
						title: 'Test message',
						description: 'Test description',
						type,
						duration: 3000,
						show: true,
					},
					setSnackbar: jest.fn(),
				});

				const { unmount } = render(<Snackbar />);

				const snackbarElement = screen.getByTestId('snackbar');
				expect(snackbarElement).toHaveClass(type);

				unmount();
			}
		});
	});

	describe('Auto-hide functionality', () => {
		it('should auto-hide after default duration (3000ms)', async () => {
			const mockSetSnackbar = jest.fn();
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Test message',
					description: 'Test description',
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: mockSetSnackbar,
			});

			render(<Snackbar />);

			expect(screen.getByText('Test message')).toBeInTheDocument();

			// Fast-forward time by 3000ms
			act(() => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(mockSetSnackbar).toHaveBeenCalledWith(null);
			});
		});

		it('should auto-hide after custom duration', async () => {
			const mockSetSnackbar = jest.fn();
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Test message',
					description: 'Test description',
					type: 'general',
					duration: 5000,
					show: true,
				},
				setSnackbar: mockSetSnackbar,
			});

			render(<Snackbar />);

			expect(screen.getByText('Test message')).toBeInTheDocument();

			// Fast-forward time by 5000ms
			act(() => {
				jest.advanceTimersByTime(5000);
			});

			await waitFor(() => {
				expect(mockSetSnackbar).toHaveBeenCalledWith(null);
			});
		});

		it('should not auto-hide when show is false', async () => {
			const mockSetSnackbar = jest.fn();
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Test message',
					description: 'Test description',
					type: 'general',
					duration: 3000,
					show: false,
				},
				setSnackbar: mockSetSnackbar,
			});

			render(<Snackbar />);

			// Fast-forward time by 3000ms
			act(() => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(mockSetSnackbar).not.toHaveBeenCalled();
			});
		});

		it('should clear timer when component unmounts', () => {
			const mockSetSnackbar = jest.fn();
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Test message',
					description: 'Test description',
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: mockSetSnackbar,
			});

			const { unmount } = render(<Snackbar />);

			// Unmount before timer completes
			unmount();

			// Fast-forward time by 3000ms
			act(() => {
				jest.advanceTimersByTime(3000);
			});

			expect(mockSetSnackbar).not.toHaveBeenCalled();
		});
	});

	describe('Props validation', () => {
		it('should handle empty title', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: '',
					description: 'Test description',
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			const text1Element = screen.getByTestId('snackbar-text1');
			expect(text1Element).toBeInTheDocument();
			expect(text1Element).toHaveAttribute('id', 'snackbar-text1');
			expect(text1Element).toHaveTextContent('');
		});

		it('should handle empty description', () => {
			mockUseSnackbarStore.mockReturnValue({
				snackbar: {
					title: 'Primary message',
					description: '',
					type: 'general',
					duration: 3000,
					show: true,
				},
				setSnackbar: jest.fn(),
			});

			render(<Snackbar />);

			expect(screen.getByText('Primary message')).toBeInTheDocument();
			expect(screen.getByTestId('snackbar-text2')).toHaveAttribute('id', 'snackbar-text2');
			expect(screen.getByTestId('snackbar-text2')).toHaveTextContent('');
		});
	});
});

describe('useSnackbarStore Integration', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('should work with the store', () => {
		const mockSetSnackbar = jest.fn();
		mockUseSnackbarStore.mockReturnValue({
			snackbar: {
				title: 'Test message',
				description: 'Test description',
				type: 'success',
				duration: 2000,
				show: true,
			},
			setSnackbar: mockSetSnackbar,
		});

		render(<Snackbar />);

		expect(screen.getByText('Test message')).toBeInTheDocument();
		expect(screen.getByText('Test description')).toBeInTheDocument();
		expect(screen.getByTestId('snackbar')).toHaveClass('success');

		// Test auto-hide
		act(() => {
			jest.advanceTimersByTime(2000);
		});

		expect(mockSetSnackbar).toHaveBeenCalledWith(null);
	});

	it('should handle store state changes', () => {
		const mockSetSnackbar = jest.fn();

		// Initial state - no snackbar
		mockUseSnackbarStore.mockReturnValue({
			snackbar: null,
			setSnackbar: mockSetSnackbar,
		});

		const { rerender } = render(<Snackbar />);
		expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();

		// Change to show snackbar
		mockUseSnackbarStore.mockReturnValue({
			snackbar: {
				title: 'New message',
				description: 'New description',
				type: 'error',
				duration: 3000,
				show: true,
			},
			setSnackbar: mockSetSnackbar,
		});

		rerender(<Snackbar />);
		expect(screen.getByText('New message')).toBeInTheDocument();
		expect(screen.getByText('New description')).toBeInTheDocument();
		expect(screen.getByTestId('snackbar')).toHaveClass('error');
	});

	it('should auto-hide when used with store', () => {
		const mockSetSnackbar = jest.fn();
		mockUseSnackbarStore.mockReturnValue({
			snackbar: {
				title: 'Auto-hide message',
				description: 'Test description',
				type: 'general',
				duration: 1000,
				show: true,
			},
			setSnackbar: mockSetSnackbar,
		});

		render(<Snackbar />);

		expect(screen.getByText('Auto-hide message')).toBeInTheDocument();

		// Fast-forward time to trigger auto-hide
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(mockSetSnackbar).toHaveBeenCalledWith(null);
	});
});
