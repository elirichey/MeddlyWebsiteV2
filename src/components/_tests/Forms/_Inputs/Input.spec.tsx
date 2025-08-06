import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../../Forms/_Inputs/Input';

describe('Input Component', () => {
	const defaultProps = {
		name: 'test-input',
		value: '',
		onChange: jest.fn(),
		type: 'text',
		label: 'Test Label',
		isComplete: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with all required props', () => {
			render(<Input {...defaultProps} />);

			expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});

		it('renders with optional placeholder', () => {
			render(<Input {...defaultProps} placeholder="Enter text here" />);

			expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
		});

		it('renders with different input types', () => {
			const { rerender } = render(<Input {...defaultProps} type="email" />);
			expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

			rerender(<Input {...defaultProps} type="password" />);
			expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

			rerender(<Input {...defaultProps} type="number" />);
			expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'number');
		});

		it('renders with value', () => {
			render(<Input {...defaultProps} value="test value" />);

			expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
		});

		it('renders with disabled state', () => {
			render(<Input {...defaultProps} disabled={true} />);

			const input = screen.getByRole('textbox');
			expect(input).toBeDisabled();
			expect(input).toHaveClass('disabled');
		});

		it('renders without disabled state by default', () => {
			render(<Input {...defaultProps} />);

			const input = screen.getByRole('textbox');
			expect(input).not.toBeDisabled();
			expect(input).not.toHaveClass('disabled');
		});
	});

	describe('Label and Accessibility', () => {
		it('associates label with input using htmlFor and id', () => {
			render(<Input {...defaultProps} />);

			const label = screen.getByText('Test Label');
			const input = screen.getByRole('textbox');

			expect(label).toHaveAttribute('for', 'test-input');
			expect(input).toHaveAttribute('id', 'test-input');
		});

		it('renders label text correctly', () => {
			render(<Input {...defaultProps} label="Custom Label" />);

			expect(screen.getByText('Custom Label')).toBeInTheDocument();
		});
	});

	describe('Checkmark Icon', () => {
		it('shows checkmark when isComplete is true and no error', () => {
			render(<Input {...defaultProps} isComplete={true} />);

			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is false', () => {
			render(<Input {...defaultProps} isComplete={false} />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is true but error exists', () => {
			render(<Input {...defaultProps} isComplete={true} error="Error message" />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('displays error message when error prop is provided', () => {
			render(<Input {...defaultProps} error="This field is required" />);

			expect(screen.getByText('This field is required')).toBeInTheDocument();
			expect(screen.getByText('This field is required')).toHaveClass('input-error');
		});

		it('does not display error message when error is null', () => {
			render(<Input {...defaultProps} error={null} />);

			expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
		});

		it('does not display error message when error is undefined', () => {
			render(<Input {...defaultProps} />);

			expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
		});
	});

	describe('User Interactions', () => {
		it('calls onChange when user types', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<Input {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByRole('textbox');
			await user.type(input, 'hello');

			expect(mockOnChange).toHaveBeenCalledTimes(5);
			expect(mockOnChange).toHaveBeenNthCalledWith(1, 'h');
			expect(mockOnChange).toHaveBeenNthCalledWith(2, 'e');
			expect(mockOnChange).toHaveBeenNthCalledWith(3, 'l');
			expect(mockOnChange).toHaveBeenNthCalledWith(4, 'l');
			expect(mockOnChange).toHaveBeenNthCalledWith(5, 'o');
		});

		it('calls onChange with correct value on input change', () => {
			const mockOnChange = jest.fn();

			render(<Input {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: 'new value' } });

			expect(mockOnChange).toHaveBeenCalledWith('new value');
		});

		it('does not call onChange when input is disabled', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<Input {...defaultProps} onChange={mockOnChange} disabled={true} />);

			const input = screen.getByRole('textbox');
			await user.type(input, 'hello');

			expect(mockOnChange).not.toHaveBeenCalled();
		});
	});

	describe('Input Attributes', () => {
		it('sets correct name attribute', () => {
			render(<Input {...defaultProps} name="custom-name" />);

			expect(screen.getByRole('textbox')).toHaveAttribute('name', 'custom-name');
		});

		it('sets correct type attribute', () => {
			render(<Input {...defaultProps} type="tel" />);

			expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'tel');
		});

		it('defaults to text type when type is not provided', () => {
			render(<Input {...defaultProps} type="" />);

			expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
		});

		it('sets placeholder attribute when provided', () => {
			render(<Input {...defaultProps} placeholder="Enter your name" />);

			expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
		});
	});

	describe('CSS Classes', () => {
		it('applies correct classes to input when not disabled', () => {
			render(<Input {...defaultProps} />);

			const input = screen.getByRole('textbox');
			expect(input).toHaveClass('input');
			expect(input).not.toHaveClass('disabled');
		});

		it('applies correct classes to input when disabled', () => {
			render(<Input {...defaultProps} disabled={true} />);

			const input = screen.getByRole('textbox');
			expect(input).toHaveClass('input', 'disabled');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string value', () => {
			render(<Input {...defaultProps} value="" />);

			expect(screen.getByDisplayValue('')).toBeInTheDocument();
		});

		it('handles special characters in value', () => {
			render(<Input {...defaultProps} value="!@#$%^&*()" />);

			expect(screen.getByDisplayValue('!@#$%^&*()')).toBeInTheDocument();
		});

		it('handles very long values', () => {
			const longValue = 'a'.repeat(1000);
			render(<Input {...defaultProps} value={longValue} />);

			expect(screen.getByDisplayValue(longValue)).toBeInTheDocument();
		});

		it('handles numeric values as strings', () => {
			render(<Input {...defaultProps} value="123" />);

			expect(screen.getByDisplayValue('123')).toBeInTheDocument();
		});
	});

	describe('Integration Tests', () => {
		it('maintains state correctly through multiple interactions', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<Input {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByRole('textbox');

			// Type some text
			await user.type(input, 'hello');
			expect(mockOnChange).toHaveBeenLastCalledWith('o');

			// Clear using backspace and type again
			await user.clear(input);
			await user.type(input, 'world');
			expect(mockOnChange).toHaveBeenLastCalledWith('d');
		});

		it('works correctly with all props combined', () => {
			const mockOnChange = jest.fn();

			render(
				<Input
					name="full-test"
					value="test value"
					onChange={mockOnChange}
					type="email"
					placeholder="Enter email"
					isComplete={true}
					label="Email Address"
					error={null}
					disabled={false}
				/>,
			);

			expect(screen.getByText('Email Address')).toBeInTheDocument();
			expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
			expect(screen.queryByText('Error')).not.toBeInTheDocument();
		});
	});
});
