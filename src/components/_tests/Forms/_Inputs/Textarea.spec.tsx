import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from '../../../Forms/_Inputs/Textarea';

describe('Textarea Component', () => {
	const defaultProps = {
		name: 'test-textarea',
		value: '',
		onChange: jest.fn(),
		label: 'Test Label',
		isComplete: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with all required props', () => {
			render(<Textarea {...defaultProps} />);

			expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});

		it('renders with optional placeholder', () => {
			render(<Textarea {...defaultProps} placeholder="Enter text here" />);

			expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
		});

		it('renders with value', () => {
			render(<Textarea {...defaultProps} value="test value" />);

			expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
		});

		it('renders with disabled state', () => {
			render(<Textarea {...defaultProps} disabled={true} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).toBeDisabled();
			expect(textarea).toHaveClass('disabled');
		});

		it('renders without disabled state by default', () => {
			render(<Textarea {...defaultProps} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).not.toBeDisabled();
			expect(textarea).not.toHaveClass('disabled');
		});

		it('renders with custom rows', () => {
			render(<Textarea {...defaultProps} rows={6} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).toHaveAttribute('rows', '6');
		});

		it('defaults to 4 rows when rows prop is not provided', () => {
			render(<Textarea {...defaultProps} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).toHaveAttribute('rows', '4');
		});
	});

	describe('Label and Accessibility', () => {
		it('associates label with textarea using htmlFor and id', () => {
			render(<Textarea {...defaultProps} />);

			const label = screen.getByText('Test Label');
			const textarea = screen.getByRole('textbox');

			expect(label).toHaveAttribute('for', 'test-textarea');
			expect(textarea).toHaveAttribute('id', 'test-textarea');
		});

		it('renders label text correctly', () => {
			render(<Textarea {...defaultProps} label="Custom Label" />);

			expect(screen.getByText('Custom Label')).toBeInTheDocument();
		});
	});

	describe('Checkmark Icon', () => {
		it('shows checkmark when isComplete is true and no error', () => {
			render(<Textarea {...defaultProps} isComplete={true} />);

			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is false', () => {
			render(<Textarea {...defaultProps} isComplete={false} />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is true but error exists', () => {
			render(<Textarea {...defaultProps} isComplete={true} error="Error message" />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('displays error message when error prop is provided', () => {
			render(<Textarea {...defaultProps} error="This field is required" />);

			expect(screen.getByText('This field is required')).toBeInTheDocument();
			expect(screen.getByText('This field is required')).toHaveClass('input-error');
		});

		it('does not display error message when error is null', () => {
			render(<Textarea {...defaultProps} error={null} />);

			expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
		});

		it('does not display error message when error is undefined', () => {
			render(<Textarea {...defaultProps} />);

			expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
		});
	});

	describe('User Interactions', () => {
		it('calls onChange when user types', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<Textarea {...defaultProps} onChange={mockOnChange} />);

			const textarea = screen.getByRole('textbox');
			await user.type(textarea, 'hello');

			expect(mockOnChange).toHaveBeenCalledTimes(5);
			expect(mockOnChange).toHaveBeenNthCalledWith(1, 'h');
			expect(mockOnChange).toHaveBeenNthCalledWith(2, 'e');
			expect(mockOnChange).toHaveBeenNthCalledWith(3, 'l');
			expect(mockOnChange).toHaveBeenNthCalledWith(4, 'l');
			expect(mockOnChange).toHaveBeenNthCalledWith(5, 'o');
		});

		it('calls onChange with correct value on textarea change', () => {
			const mockOnChange = jest.fn();

			render(<Textarea {...defaultProps} onChange={mockOnChange} />);

			const textarea = screen.getByRole('textbox');
			fireEvent.change(textarea, { target: { value: 'new value' } });

			expect(mockOnChange).toHaveBeenCalledWith('new value');
		});

		it('does not call onChange when textarea is disabled', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<Textarea {...defaultProps} onChange={mockOnChange} disabled={true} />);

			const textarea = screen.getByRole('textbox');
			await user.type(textarea, 'hello');

			expect(mockOnChange).not.toHaveBeenCalled();
		});

		it('handles multiline text input', () => {
			const mockOnChange = jest.fn();

			render(<Textarea {...defaultProps} onChange={mockOnChange} />);

			const textarea = screen.getByRole('textbox');
			fireEvent.change(textarea, { target: { value: 'line 1\nline 2' } });

			expect(mockOnChange).toHaveBeenCalledWith('line 1\nline 2');
		});
	});

	describe('Textarea Attributes', () => {
		it('sets correct name attribute', () => {
			render(<Textarea {...defaultProps} name="custom-name" />);

			expect(screen.getByRole('textbox')).toHaveAttribute('name', 'custom-name');
		});

		it('sets placeholder attribute when provided', () => {
			render(<Textarea {...defaultProps} placeholder="Enter your message" />);

			expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
		});

		it('sets rows attribute correctly', () => {
			render(<Textarea {...defaultProps} rows={8} />);

			expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
		});
	});

	describe('CSS Classes', () => {
		it('applies correct classes to textarea when not disabled', () => {
			render(<Textarea {...defaultProps} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).toHaveClass('input', 'text-area');
			expect(textarea).not.toHaveClass('disabled');
		});

		it('applies correct classes to textarea when disabled', () => {
			render(<Textarea {...defaultProps} disabled={true} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).toHaveClass('input', 'text-area', 'disabled');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string value', () => {
			render(<Textarea {...defaultProps} value="" />);

			expect(screen.getByDisplayValue('')).toBeInTheDocument();
		});

		it('handles special characters in value', () => {
			render(<Textarea {...defaultProps} value="!@#$%^&*()" />);

			expect(screen.getByDisplayValue('!@#$%^&*()')).toBeInTheDocument();
		});

		it('handles very long values', () => {
			const longValue = 'a'.repeat(1000);
			render(<Textarea {...defaultProps} value={longValue} />);

			expect(screen.getByDisplayValue(longValue)).toBeInTheDocument();
		});

		it('handles numeric values as strings', () => {
			render(<Textarea {...defaultProps} value="123" />);

			expect(screen.getByDisplayValue('123')).toBeInTheDocument();
		});

		it('handles multiline values', () => {
			const multilineValue = 'line 1\nline 2\nline 3';
			render(<Textarea {...defaultProps} value={multilineValue} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).toHaveValue(multilineValue);
		});

		it('handles zero rows value', () => {
			render(<Textarea {...defaultProps} rows={0} />);

			const textarea = screen.getByRole('textbox');
			// When rows is 0, it's falsy so it defaults to 4
			expect(textarea).toHaveAttribute('rows', '4');
		});

		it('handles very large rows value', () => {
			render(<Textarea {...defaultProps} rows={100} />);

			const textarea = screen.getByRole('textbox');
			expect(textarea).toHaveAttribute('rows', '100');
		});
	});

	describe('Integration Tests', () => {
		it('maintains state correctly through multiple interactions', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<Textarea {...defaultProps} onChange={mockOnChange} />);

			const textarea = screen.getByRole('textbox');

			// Type some text
			await user.type(textarea, 'hello');
			expect(mockOnChange).toHaveBeenLastCalledWith('o');

			// Clear using backspace and type again
			await user.clear(textarea);
			await user.type(textarea, 'world');
			expect(mockOnChange).toHaveBeenLastCalledWith('d');
		});

		it('works correctly with all props combined', () => {
			const mockOnChange = jest.fn();

			render(
				<Textarea
					name="full-test"
					value="test value"
					onChange={mockOnChange}
					placeholder="Enter message"
					isComplete={true}
					label="Message"
					rows={6}
					error={null}
					disabled={false}
				/>,
			);

			expect(screen.getByText('Message')).toBeInTheDocument();
			expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
			expect(screen.queryByText('Error')).not.toBeInTheDocument();
			expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
		});

		it('handles complex multiline interactions', () => {
			const mockOnChange = jest.fn();

			render(<Textarea {...defaultProps} onChange={mockOnChange} />);

			const textarea = screen.getByRole('textbox');

			// Simulate multiline content input
			fireEvent.change(textarea, { target: { value: 'First line\nSecond line\nThird line' } });

			expect(mockOnChange).toHaveBeenCalledWith('First line\nSecond line\nThird line');
		});

		it('handles copy and paste operations', () => {
			const mockOnChange = jest.fn();

			render(<Textarea {...defaultProps} onChange={mockOnChange} />);

			const textarea = screen.getByRole('textbox');

			// Simulate pasting content
			fireEvent.change(textarea, { target: { value: 'pasted content' } });

			expect(mockOnChange).toHaveBeenCalledWith('pasted content');
		});
	});
});
