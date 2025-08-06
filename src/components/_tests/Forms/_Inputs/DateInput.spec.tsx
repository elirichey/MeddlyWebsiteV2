import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateInput from '../../../Forms/_Inputs/DateInput';

describe('DateInput', () => {
	const mockOnChange = jest.fn();

	const defaultProps = {
		name: 'test-date',
		label: 'Test Date',
		value: '',
		onChange: mockOnChange,
		placeholder: 'Select a date',
		isComplete: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with all required props', () => {
			render(<DateInput {...defaultProps} />);

			expect(screen.getByLabelText('Test Date')).toBeInTheDocument();
			expect(screen.getByDisplayValue('')).toBeInTheDocument();
		});

		it('renders with label text', () => {
			render(<DateInput {...defaultProps} label="Birth Date" />);

			expect(screen.getByLabelText('Birth Date')).toBeInTheDocument();
		});

		it('renders with placeholder text', () => {
			render(<DateInput {...defaultProps} placeholder="MM/DD/YYYY" />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY');
		});

		it('renders with initial value', () => {
			render(<DateInput {...defaultProps} value="2024-01-15" />);

			expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
		});

		it('renders with correct name attribute', () => {
			render(<DateInput {...defaultProps} name="event-date" />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('name', 'event-date');
		});
	});

	describe('Checkmark Icon', () => {
		it('shows checkmark icon when isComplete is true and no error', () => {
			render(<DateInput {...defaultProps} isComplete={true} />);

			const checkmark = screen.getByAltText('check-icon');
			expect(checkmark).toBeInTheDocument();
			expect(checkmark).toHaveAttribute('src', '/svg/checkmark-circle.svg');
		});

		it('does not show checkmark icon when isComplete is false', () => {
			render(<DateInput {...defaultProps} isComplete={false} />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});

		it('does not show checkmark icon when there is an error', () => {
			render(<DateInput {...defaultProps} isComplete={true} error="Invalid date" />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('displays error message when error prop is provided', () => {
			render(<DateInput {...defaultProps} error="Please select a valid date" />);

			expect(screen.getByText('Please select a valid date')).toBeInTheDocument();
			expect(screen.getByText('Please select a valid date')).toHaveClass('input-error');
		});

		it('does not display error message when error prop is not provided', () => {
			render(<DateInput {...defaultProps} />);

			expect(screen.queryByText('Please select a valid date')).not.toBeInTheDocument();
		});

		it('prioritizes error display over checkmark when both isComplete and error are true', () => {
			render(<DateInput {...defaultProps} isComplete={true} error="Invalid date" />);

			expect(screen.getByText('Invalid date')).toBeInTheDocument();
			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Required Field', () => {
		it('renders as required when required prop is true', () => {
			render(<DateInput {...defaultProps} required={true} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('required');
		});

		it('does not render as required when required prop is false', () => {
			render(<DateInput {...defaultProps} required={false} />);

			const input = screen.getByDisplayValue('');
			expect(input).not.toHaveAttribute('required');
		});

		it('does not render as required when required prop is not provided', () => {
			render(<DateInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).not.toHaveAttribute('required');
		});
	});

	describe('Disabled State', () => {
		it('renders as disabled when disabled prop is true', () => {
			render(<DateInput {...defaultProps} disabled={true} />);

			const input = screen.getByDisplayValue('');
			expect(input).toBeDisabled();
			expect(input).toHaveClass('input', 'disabled');
		});

		it('renders as enabled when disabled prop is false', () => {
			render(<DateInput {...defaultProps} disabled={false} />);

			const input = screen.getByDisplayValue('');
			expect(input).not.toBeDisabled();
			expect(input).toHaveClass('input');
			expect(input).not.toHaveClass('disabled');
		});

		it('renders as enabled when disabled prop is not provided', () => {
			render(<DateInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).not.toBeDisabled();
			expect(input).toHaveClass('input');
			expect(input).not.toHaveClass('disabled');
		});
	});

	describe('User Interactions', () => {
		it('calls onChange when user types in the input', async () => {
			const user = userEvent.setup();
			render(<DateInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			await user.type(input, '2024-01-15');

			expect(mockOnChange).toHaveBeenCalled();
		});

		it('calls onChange when user changes the date value', async () => {
			const user = userEvent.setup();
			render(<DateInput {...defaultProps} value="2024-01-15" />);

			const input = screen.getByDisplayValue('2024-01-15');
			await user.clear(input);
			await user.type(input, '2024-02-20');

			expect(mockOnChange).toHaveBeenCalled();
		});

		it('does not call onChange when input is disabled', async () => {
			const user = userEvent.setup();
			render(<DateInput {...defaultProps} disabled={true} />);

			const input = screen.getByDisplayValue('');
			await user.type(input, '2024-01-15');

			expect(mockOnChange).not.toHaveBeenCalled();
		});
	});

	describe('Input Type and Attributes', () => {
		it('renders as date input type', () => {
			render(<DateInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('type', 'date');
		});

		it('has correct for attribute in label', () => {
			render(<DateInput {...defaultProps} name="test-input" />);

			const label = screen.getByText('Test Date');
			expect(label).toHaveAttribute('for', 'test-input');
		});

		it('has correct id attribute in input', () => {
			render(<DateInput {...defaultProps} name="test-input" />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('id', 'test-input');
		});
	});

	describe('CSS Classes', () => {
		it('applies correct CSS classes to container', () => {
			render(<DateInput {...defaultProps} />);

			const container = screen.getByText('Test Date').closest('div');
			expect(container).toHaveClass('column', 'time');
		});

		it('applies correct CSS classes to label', () => {
			render(<DateInput {...defaultProps} />);

			const label = screen.getByText('Test Date');
			expect(label).toHaveClass('label', 'mb-5');
		});

		it('applies correct CSS classes to input when not disabled', () => {
			render(<DateInput {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveClass('input');
			expect(input).not.toHaveClass('disabled');
		});

		it('applies correct CSS classes to input when disabled', () => {
			render(<DateInput {...defaultProps} disabled={true} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveClass('input', 'disabled');
		});
	});

	describe('Accessibility', () => {
		it('has proper label association', () => {
			render(<DateInput {...defaultProps} />);

			const input = screen.getByLabelText('Test Date');
			expect(input).toBeInTheDocument();
		});

		it('has proper alt text for checkmark icon', () => {
			render(<DateInput {...defaultProps} isComplete={true} />);

			const checkmark = screen.getByAltText('check-icon');
			expect(checkmark).toBeInTheDocument();
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string value', () => {
			render(<DateInput {...defaultProps} value="" />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveValue('');
		});

		it('handles null value gracefully', () => {
			render(<DateInput {...defaultProps} value={null as any} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveValue('');
		});

		it('handles undefined value gracefully', () => {
			render(<DateInput {...defaultProps} value={undefined as any} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveValue('');
		});

		it('handles very long label text', () => {
			const longLabel =
				'This is a very long label text that should be handled properly by the component without breaking the layout or functionality';
			render(<DateInput {...defaultProps} label={longLabel} />);

			expect(screen.getByText(longLabel)).toBeInTheDocument();
		});

		it('handles very long error message', () => {
			const longError =
				'This is a very long error message that should be displayed properly without breaking the layout or functionality of the component';
			render(<DateInput {...defaultProps} error={longError} />);

			expect(screen.getByText(longError)).toBeInTheDocument();
		});
	});
});
