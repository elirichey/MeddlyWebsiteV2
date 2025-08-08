import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import Snackbar, { useSnackbar } from '../../Notifications/Snackbar';

describe('Snackbar Component', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	describe('Rendering', () => {
		it('should render when show is true', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} />);

			expect(screen.getByText('Test message')).toBeInTheDocument();
			expect(screen.getByTestId('snackbar')).toHaveAttribute('id', 'snackbar');
		});

		it('should not render when show is false', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={false} onClose={mockOnClose} />);

			expect(screen.queryByText('Test message')).not.toBeInTheDocument();
			expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
		});

		it('should render text1 in snackbar-text1 div', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Primary message" show={true} onClose={mockOnClose} />);

			const text1Element = screen.getByText('Primary message');
			expect(text1Element).toBeInTheDocument();
			expect(text1Element).toHaveAttribute('id', 'snackbar-text1');
		});

		it('should render text2 when provided', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Primary message" text2="Secondary message" show={true} onClose={mockOnClose} />);

			expect(screen.getByText('Primary message')).toBeInTheDocument();
			expect(screen.getByText('Secondary message')).toBeInTheDocument();
			expect(screen.getByText('Secondary message')).toHaveAttribute('id', 'snackbar-text2');
		});

		it('should not render text2 when not provided', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Primary message" show={true} onClose={mockOnClose} />);

			expect(screen.getByText('Primary message')).toBeInTheDocument();
			expect(screen.queryByText('Secondary message')).not.toBeInTheDocument();
		});

		it('should have correct CSS classes and styles', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} />);

			const snackbarElement = screen.getByTestId('snackbar');
			expect(snackbarElement).toHaveClass('show');
			expect(snackbarElement).toHaveStyle({
				opacity: '1',
				transition: 'opacity 0.3s ease-in-out',
			});
		});
	});

	describe('Auto-hide functionality', () => {
		it('should auto-hide after default duration (3000ms)', async () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} />);

			expect(screen.getByText('Test message')).toBeInTheDocument();

			// Fast-forward time by 3000ms
			act(() => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(mockOnClose).toHaveBeenCalledTimes(1);
			});
		});

		it('should auto-hide after custom duration', async () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} duration={5000} />);

			expect(screen.getByText('Test message')).toBeInTheDocument();

			// Fast-forward time by 5000ms
			act(() => {
				jest.advanceTimersByTime(5000);
			});

			await waitFor(() => {
				expect(mockOnClose).toHaveBeenCalledTimes(1);
			});
		});

		it('should not auto-hide when duration is 0', async () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} duration={0} />);

			expect(screen.getByText('Test message')).toBeInTheDocument();

			// Fast-forward time by 10000ms
			act(() => {
				jest.advanceTimersByTime(10000);
			});

			await waitFor(() => {
				expect(mockOnClose).not.toHaveBeenCalled();
			});
		});

		it('should not auto-hide when show is false', async () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={false} onClose={mockOnClose} />);

			// Fast-forward time by 3000ms
			act(() => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(mockOnClose).not.toHaveBeenCalled();
			});
		});

		it('should clear timer when component unmounts', () => {
			const mockOnClose = jest.fn();
			const { unmount } = render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} />);

			// Unmount before timer completes
			unmount();

			// Fast-forward time by 3000ms
			act(() => {
				jest.advanceTimersByTime(3000);
			});

			expect(mockOnClose).not.toHaveBeenCalled();
		});

		it('should reset timer when show prop changes', async () => {
			const mockOnClose = jest.fn();
			const { rerender } = render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} />);

			// Fast-forward time by 1500ms (half of 3000ms)
			act(() => {
				jest.advanceTimersByTime(1500);
			});

			// Change show to false and back to true
			rerender(<Snackbar text1="Test message" show={false} onClose={mockOnClose} />);

			rerender(<Snackbar text1="Test message" show={true} onClose={mockOnClose} />);

			// Fast-forward time by 1500ms again
			act(() => {
				jest.advanceTimersByTime(1500);
			});

			// Should not have called onClose yet
			expect(mockOnClose).not.toHaveBeenCalled();

			// Fast-forward time by another 1500ms to complete the new timer
			act(() => {
				jest.advanceTimersByTime(1500);
			});

			await waitFor(() => {
				expect(mockOnClose).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Props validation', () => {
		it('should handle empty text1', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="" show={true} onClose={mockOnClose} />);

			const text1Element = screen.getByTestId('snackbar-text1');
			expect(text1Element).toBeInTheDocument();
			expect(text1Element).toHaveAttribute('id', 'snackbar-text1');
		});

		it('should handle empty text2', () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Primary message" text2="" show={true} onClose={mockOnClose} />);

			expect(screen.getByText('Primary message')).toBeInTheDocument();
			expect(screen.getByTestId('snackbar-text2')).toHaveAttribute('id', 'snackbar-text2');
			expect(screen.getByTestId('snackbar-text2')).toHaveTextContent('');
		});

		it('should handle negative duration', async () => {
			const mockOnClose = jest.fn();
			render(<Snackbar text1="Test message" show={true} onClose={mockOnClose} duration={-1000} />);

			// Should not auto-hide with negative duration
			act(() => {
				jest.advanceTimersByTime(5000);
			});

			await waitFor(() => {
				expect(mockOnClose).not.toHaveBeenCalled();
			});
		});
	});
});

describe('useSnackbar Hook', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('should initialize with default values', () => {
		const { result } = renderHook(() => useSnackbar());

		expect(result.current.snackbar).toEqual({
			show: false,
			text1: '',
			text2: '',
			duration: 3000,
		});
	});

	it('should show snackbar with text1 only', () => {
		const { result } = renderHook(() => useSnackbar());

		act(() => {
			result.current.showSnackbar('Test message');
		});

		expect(result.current.snackbar).toEqual({
			show: true,
			text1: 'Test message',
			text2: '',
			duration: 3000,
		});
	});

	it('should show snackbar with text1 and text2', () => {
		const { result } = renderHook(() => useSnackbar());

		act(() => {
			result.current.showSnackbar('Primary message', 'Secondary message');
		});

		expect(result.current.snackbar).toEqual({
			show: true,
			text1: 'Primary message',
			text2: 'Secondary message',
			duration: 3000,
		});
	});

	it('should show snackbar with custom duration', () => {
		const { result } = renderHook(() => useSnackbar());

		act(() => {
			result.current.showSnackbar('Test message', undefined, 5000);
		});

		expect(result.current.snackbar).toEqual({
			show: true,
			text1: 'Test message',
			text2: '',
			duration: 5000,
		});
	});

	it('should show snackbar with text1, text2, and custom duration', () => {
		const { result } = renderHook(() => useSnackbar());

		act(() => {
			result.current.showSnackbar('Primary message', 'Secondary message', 7000);
		});

		expect(result.current.snackbar).toEqual({
			show: true,
			text1: 'Primary message',
			text2: 'Secondary message',
			duration: 7000,
		});
	});

	it('should hide snackbar', () => {
		const { result } = renderHook(() => useSnackbar());

		// First show the snackbar
		act(() => {
			result.current.showSnackbar('Test message');
		});

		expect(result.current.snackbar.show).toBe(true);

		// Then hide it
		act(() => {
			result.current.hideSnackbar();
		});

		expect(result.current.snackbar.show).toBe(false);
		expect(result.current.snackbar.text1).toBe('Test message');
		expect(result.current.snackbar.text2).toBe('');
		expect(result.current.snackbar.duration).toBe(3000);
	});

	it('should handle multiple show/hide operations', () => {
		const { result } = renderHook(() => useSnackbar());

		// Show first message
		act(() => {
			result.current.showSnackbar('First message');
		});

		expect(result.current.snackbar.text1).toBe('First message');
		expect(result.current.snackbar.show).toBe(true);

		// Hide
		act(() => {
			result.current.hideSnackbar();
		});

		expect(result.current.snackbar.show).toBe(false);

		// Show second message
		act(() => {
			result.current.showSnackbar('Second message', 'Subtitle', 5000);
		});

		expect(result.current.snackbar.text1).toBe('Second message');
		expect(result.current.snackbar.text2).toBe('Subtitle');
		expect(result.current.snackbar.duration).toBe(5000);
		expect(result.current.snackbar.show).toBe(true);
	});

	it('should handle empty strings', () => {
		const { result } = renderHook(() => useSnackbar());

		act(() => {
			result.current.showSnackbar('', '', 2000);
		});

		expect(result.current.snackbar).toEqual({
			show: true,
			text1: '',
			text2: '',
			duration: 2000,
		});
	});

	it('should handle undefined text2 parameter', () => {
		const { result } = renderHook(() => useSnackbar());

		act(() => {
			result.current.showSnackbar('Test message', undefined, 4000);
		});

		expect(result.current.snackbar).toEqual({
			show: true,
			text1: 'Test message',
			text2: '',
			duration: 4000,
		});
	});
});

describe('Integration: Snackbar with useSnackbar', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('should work together in a component', () => {
		const { result } = renderHook(() => useSnackbar());

		// Initially no snackbar should be visible
		expect(result.current.snackbar.show).toBe(false);

		// Show snackbar
		act(() => {
			result.current.showSnackbar('Test message', 'Subtitle', 2000);
		});

		expect(result.current.snackbar.show).toBe(true);
		expect(result.current.snackbar.text1).toBe('Test message');
		expect(result.current.snackbar.text2).toBe('Subtitle');
		expect(result.current.snackbar.duration).toBe(2000);

		// Hide snackbar
		act(() => {
			result.current.hideSnackbar();
		});

		expect(result.current.snackbar.show).toBe(false);
	});

	it('should auto-hide when used together', () => {
		const { result } = renderHook(() => useSnackbar());
		const mockOnClose = jest.fn();

		// Show snackbar
		act(() => {
			result.current.showSnackbar('Auto-hide message', undefined, 1000);
		});

		expect(result.current.snackbar.show).toBe(true);
		expect(result.current.snackbar.text1).toBe('Auto-hide message');

		// Render the snackbar component
		render(
			<Snackbar
				text1={result.current.snackbar.text1}
				text2={result.current.snackbar.text2}
				show={result.current.snackbar.show}
				onClose={mockOnClose}
				duration={result.current.snackbar.duration}
			/>,
		);

		expect(screen.getByText('Auto-hide message')).toBeInTheDocument();

		// Fast-forward time to trigger auto-hide
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});
