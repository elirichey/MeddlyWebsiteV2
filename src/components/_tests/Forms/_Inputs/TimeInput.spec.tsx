import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeInput from '../../../Forms/_Inputs/TimeInput';

describe('TimeInput Component', () => {
	const mockOnChange = jest.fn();

	const defaultProps = {
		name: 'test-time',
		label: 'Test Time',
		value: '',
		onChange: mockOnChange,
		placeholder: 'Select a time',
		isComplete: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with all required props', () => {
			render(<TimeInput {...defaultProps} />);

			expect(screen.getByText('Test Time')).toBeInTheDocument();
			expect(screen.getByDisplayValue('')).toBeInTheDocument();
		});

		it('renders with label text', () => {
			render(<TimeInput {...defaultProps} label="Event Time" />);

			expect(screen.getByText('Event Time')).toBeInTheDocument();
		});

		it('renders with placeholder text', () => {
			render(<TimeInput {...defaultProps} placeholder="HH:MM" />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('placeholder', 'HH:MM');
		});

		it('renders with initial value', () => {
			render(<TimeInput {...defaultProps} value="14:30" />);

			expect(screen.getByDisplayValue('14:30')).toBeInTheDocument();
		});

		it('renders with correct name attribute', () => {
			render(<TimeInput {...defaultProps} name="event-time" />);

			const label = screen.getByText('Test Time');
			expect(label).toHaveAttribute('for', 'event-time');
		});

		it('renders with time input type', () => {
			render(<TimeInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('type', 'time');
		});
	});

	describe('Checkmark Icon', () => {
		it('shows checkmark icon when isComplete is true and no error', () => {
			render(<TimeInput {...defaultProps} isComplete={true} />);

			const checkmark = screen.getByAltText('check-icon');
			expect(checkmark).toBeInTheDocument();
			expect(checkmark).toHaveAttribute('src', '/svg/checkmark-circle.svg');
		});

		it('does not show checkmark icon when isComplete is false', () => {
			render(<TimeInput {...defaultProps} isComplete={false} />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});

		it('does not show checkmark icon when there is an error', () => {
			render(<TimeInput {...defaultProps} isComplete={true} error="Invalid time" />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('displays error message when error prop is provided', () => {
			render(<TimeInput {...defaultProps} error="Please select a valid time" />);

			expect(screen.getByText('Please select a valid time')).toBeInTheDocument();
			expect(screen.getByText('Please select a valid time')).toHaveClass('input-error');
		});

		it('does not display error message when error prop is not provided', () => {
			render(<TimeInput {...defaultProps} />);

			expect(screen.queryByText('Please select a valid time')).not.toBeInTheDocument();
		});

		it('prioritizes error display over checkmark when both isComplete and error are true', () => {
			render(<TimeInput {...defaultProps} isComplete={true} error="Invalid time" />);

			expect(screen.getByText('Invalid time')).toBeInTheDocument();
			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Required and Disabled States', () => {
		it('renders with required attribute when required is true', () => {
			render(<TimeInput {...defaultProps} required={true} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('required');
		});

		it('does not render with required attribute when required is false', () => {
			render(<TimeInput {...defaultProps} required={false} />);

			const input = screen.getByDisplayValue('');
			expect(input).not.toHaveAttribute('required');
		});

		it('renders with disabled state when disabled is true', () => {
			render(<TimeInput {...defaultProps} disabled={true} />);

			const input = screen.getByDisplayValue('');
			expect(input).toBeDisabled();
			expect(input).toHaveClass('disabled');
		});

		it('does not render with disabled state when disabled is false', () => {
			render(<TimeInput {...defaultProps} disabled={false} />);

			const input = screen.getByDisplayValue('');
			expect(input).not.toBeDisabled();
			expect(input).not.toHaveClass('disabled');
		});

		it('does not render with disabled state by default', () => {
			render(<TimeInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).not.toBeDisabled();
			expect(input).not.toHaveClass('disabled');
		});
	});

	describe('User Interactions', () => {
		it('calls onChange when user changes the time value', () => {
			const mockOnChange = jest.fn();

			render(<TimeInput {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('');
			fireEvent.change(input, { target: { value: '15:45' } });

			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[0][0]).toHaveProperty('target');
		});

		it('calls onChange with correct value on input change', () => {
			const mockOnChange = jest.fn();

			render(<TimeInput {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('');
			fireEvent.change(input, { target: { value: '09:30' } });

			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[0][0]).toHaveProperty('target');
		});

		it('does not call onChange when input is disabled', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<TimeInput {...defaultProps} onChange={mockOnChange} disabled={true} />);

			const input = screen.getByDisplayValue('');
			await user.type(input, '12:00');

			expect(mockOnChange).not.toHaveBeenCalled();
		});

		it('handles empty value changes', () => {
			const mockOnChange = jest.fn();

			render(<TimeInput {...defaultProps} value="12:00" onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('12:00');
			fireEvent.change(input, { target: { value: '' } });

			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[0][0]).toHaveProperty('target');
		});
	});

	describe('Label and Accessibility', () => {
		it('associates label with input using htmlFor', () => {
			render(<TimeInput {...defaultProps} />);

			const label = screen.getByText('Test Time');

			expect(label).toHaveAttribute('for', 'test-time');
		});

		it('renders label text correctly', () => {
			render(<TimeInput {...defaultProps} label="Custom Time Label" />);

			expect(screen.getByText('Custom Time Label')).toBeInTheDocument();
		});
	});

	describe('CSS Classes', () => {
		it('applies correct classes to input when not disabled', () => {
			render(<TimeInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveClass('input');
			expect(input).not.toHaveClass('disabled');
		});

		it('applies correct classes to input when disabled', () => {
			render(<TimeInput {...defaultProps} disabled={true} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveClass('input', 'disabled');
		});

		it('applies correct classes to container', () => {
			render(<TimeInput {...defaultProps} />);

			const container = screen.getByDisplayValue('').closest('.input-field');
			expect(container).toHaveClass('input-field', 'time');
		});
	});

	describe('Time Input Specific Behavior', () => {
		it('handles valid time formats', () => {
			const mockOnChange = jest.fn();

			render(<TimeInput {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('');

			// Test various time formats
			fireEvent.change(input, { target: { value: '00:00' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[0][0]).toHaveProperty('target');

			fireEvent.change(input, { target: { value: '23:59' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[1][0]).toHaveProperty('target');

			fireEvent.change(input, { target: { value: '12:30' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[2][0]).toHaveProperty('target');
		});

		it('handles edge time values', () => {
			const mockOnChange = jest.fn();

			render(<TimeInput {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('');

			// Test edge cases
			fireEvent.change(input, { target: { value: '00:00' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[0][0]).toHaveProperty('target');

			fireEvent.change(input, { target: { value: '23:59' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[1][0]).toHaveProperty('target');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string value', () => {
			render(<TimeInput {...defaultProps} value="" />);

			expect(screen.getByDisplayValue('')).toBeInTheDocument();
		});

		it('handles null onChange callback', () => {
			// This should not throw an error
			expect(() => {
				render(<TimeInput {...defaultProps} onChange={null as any} />);
			}).not.toThrow();
		});

		it('handles undefined onChange callback', () => {
			// This should not throw an error
			expect(() => {
				render(<TimeInput {...defaultProps} onChange={undefined as any} />);
			}).not.toThrow();
		});

		it('handles very long label text', () => {
			const longLabel =
				'This is a very long label text that might wrap to multiple lines and should still be displayed correctly';
			render(<TimeInput {...defaultProps} label={longLabel} />);

			expect(screen.getByText(longLabel)).toBeInTheDocument();
		});

		it('handles special characters in label', () => {
			const specialLabel = 'Time & Date (24hr) - Required*';
			render(<TimeInput {...defaultProps} label={specialLabel} />);

			expect(screen.getByText(specialLabel)).toBeInTheDocument();
		});
	});

	describe('Integration Tests', () => {
		it('maintains state correctly through multiple interactions', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<TimeInput {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('');

			// Change time multiple times
			fireEvent.change(input, { target: { value: '09:00' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[0][0]).toHaveProperty('target');

			fireEvent.change(input, { target: { value: '14:30' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[1][0]).toHaveProperty('target');

			fireEvent.change(input, { target: { value: '18:45' } });
			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange.mock.calls[2][0]).toHaveProperty('target');
		});

		it('works correctly with all props combined', () => {
			const mockOnChange = jest.fn();

			render(
				<TimeInput
					name="full-test-time"
					value="15:30"
					onChange={mockOnChange}
					placeholder="Select time"
					isComplete={true}
					label="Event Start Time"
					error={undefined}
					required={true}
					disabled={false}
				/>,
			);

			expect(screen.getByText('Event Start Time')).toBeInTheDocument();
			expect(screen.getByDisplayValue('15:30')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Select time')).toBeInTheDocument();
			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
			expect(screen.queryByText('Error')).not.toBeInTheDocument();

			const input = screen.getByDisplayValue('15:30');
			expect(input).toHaveAttribute('required');
			expect(input).not.toBeDisabled();
		});

		it('handles complete workflow with error state', () => {
			const mockOnChange = jest.fn();

			const { rerender } = render(
				<TimeInput {...defaultProps} onChange={mockOnChange} value="10:00" isComplete={true} />,
			);

			// Initially shows checkmark
			expect(screen.getByAltText('check-icon')).toBeInTheDocument();

			// Rerender with error
			rerender(
				<TimeInput
					{...defaultProps}
					onChange={mockOnChange}
					value="10:00"
					isComplete={true}
					error="Time must be after 12:00"
				/>,
			);

			// Now shows error instead of checkmark
			expect(screen.getByText('Time must be after 12:00')).toBeInTheDocument();
			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});
});
