import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Password from '../../../Forms/_Inputs/Password';

describe('Password Component', () => {
	const defaultProps = {
		name: 'test-password',
		value: '',
		onChange: jest.fn(),
		type: 'password',
		placeholder: 'Enter password',
		isComplete: false,
		label: 'Password',
		error: null,
		hidePassword: true,
		toggleHidePassword: jest.fn(),
		showToggle: true,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with all required props', () => {
			render(<Password {...defaultProps} />);

			expect(screen.getByLabelText('Password')).toBeInTheDocument();
			expect(screen.getByDisplayValue('')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
		});

		it('renders with value', () => {
			render(<Password {...defaultProps} value="testpassword123" />);

			expect(screen.getByDisplayValue('testpassword123')).toBeInTheDocument();
		});

		it('renders with custom label', () => {
			render(<Password {...defaultProps} label="Confirm Password" />);

			expect(screen.getByText('Confirm Password')).toBeInTheDocument();
		});

		it('renders with custom placeholder', () => {
			render(<Password {...defaultProps} placeholder="Type your secret password" />);

			expect(screen.getByPlaceholderText('Type your secret password')).toBeInTheDocument();
		});
	});

	describe('Password Visibility Toggle', () => {
		it('shows toggle button when showToggle is true', () => {
			render(<Password {...defaultProps} showToggle={true} />);

			expect(screen.getByRole('button', { name: '[ SHOW ]' })).toBeInTheDocument();
		});

		it('hides toggle button when showToggle is false', () => {
			render(<Password {...defaultProps} showToggle={false} />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('shows [ SHOW ] text when password is hidden', () => {
			render(<Password {...defaultProps} hidePassword={true} showToggle={true} />);

			expect(screen.getByRole('button', { name: '[ SHOW ]' })).toBeInTheDocument();
		});

		it('shows [ HIDE ] text when password is visible', () => {
			render(<Password {...defaultProps} hidePassword={false} showToggle={true} />);

			expect(screen.getByRole('button', { name: '[ HIDE ]' })).toBeInTheDocument();
		});

		it('sets input type to password when hidePassword is true', () => {
			render(<Password {...defaultProps} hidePassword={true} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('type', 'password');
		});

		it('sets input type to text when hidePassword is false', () => {
			render(<Password {...defaultProps} hidePassword={false} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveAttribute('type', 'text');
		});
	});

	describe('Toggle Button Interactions', () => {
		it('calls toggleHidePassword when toggle button is clicked', async () => {
			const user = userEvent.setup();
			const mockToggleHidePassword = jest.fn();

			render(<Password {...defaultProps} toggleHidePassword={mockToggleHidePassword} showToggle={true} />);

			const toggleButton = screen.getByRole('button', { name: '[ SHOW ]' });
			await user.click(toggleButton);

			expect(mockToggleHidePassword).toHaveBeenCalledWith(false);
		});

		it('calls toggleHidePassword with correct value when hiding password', async () => {
			const user = userEvent.setup();
			const mockToggleHidePassword = jest.fn();

			render(
				<Password
					{...defaultProps}
					hidePassword={false}
					toggleHidePassword={mockToggleHidePassword}
					showToggle={true}
				/>,
			);

			const toggleButton = screen.getByRole('button', { name: '[ HIDE ]' });
			await user.click(toggleButton);

			expect(mockToggleHidePassword).toHaveBeenCalledWith(true);
		});

		it('handles Enter key press on toggle button', async () => {
			const user = userEvent.setup();
			const mockToggleHidePassword = jest.fn();

			render(<Password {...defaultProps} toggleHidePassword={mockToggleHidePassword} showToggle={true} />);

			const toggleButton = screen.getByRole('button', { name: '[ SHOW ]' });
			await user.click(toggleButton);
			await user.keyboard('{Enter}');

			expect(mockToggleHidePassword).toHaveBeenCalledWith(false);
		});

		it('handles Space key press on toggle button', async () => {
			const user = userEvent.setup();
			const mockToggleHidePassword = jest.fn();

			render(<Password {...defaultProps} toggleHidePassword={mockToggleHidePassword} showToggle={true} />);

			const toggleButton = screen.getByRole('button', { name: '[ SHOW ]' });
			await user.click(toggleButton);
			await user.keyboard(' ');

			expect(mockToggleHidePassword).toHaveBeenCalledWith(false);
		});
	});

	describe('Input Interactions', () => {
		it('calls onChange when user types', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();

			render(<Password {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('');
			await user.clear(input);
			await user.type(input, 'secret123');

			expect(mockOnChange).toHaveBeenCalled();
			expect(mockOnChange).toHaveBeenCalledWith('s');
			expect(mockOnChange).toHaveBeenCalledWith('e');
			expect(mockOnChange).toHaveBeenCalledWith('c');
			expect(mockOnChange).toHaveBeenCalledWith('r');
			expect(mockOnChange).toHaveBeenCalledWith('e');
			expect(mockOnChange).toHaveBeenCalledWith('t');
			expect(mockOnChange).toHaveBeenCalledWith('1');
			expect(mockOnChange).toHaveBeenCalledWith('2');
		});

		it('calls onChange with correct value on input change', () => {
			const mockOnChange = jest.fn();

			render(<Password {...defaultProps} onChange={mockOnChange} />);

			const input = screen.getByDisplayValue('');
			fireEvent.change(input, { target: { value: 'newpassword' } });

			expect(mockOnChange).toHaveBeenCalledWith('newpassword');
		});
	});

	describe('Label and Accessibility', () => {
		it('associates label with input using htmlFor and id', () => {
			render(<Password {...defaultProps} />);

			const label = screen.getByText('Password');
			const input = screen.getByDisplayValue('');

			expect(label).toHaveAttribute('for', 'test-password');
			expect(input).toHaveAttribute('id', 'test-password');
		});

		it('renders label text correctly', () => {
			render(<Password {...defaultProps} label="Custom Password Label" />);

			expect(screen.getByText('Custom Password Label')).toBeInTheDocument();
		});

		it('has proper button type for toggle button', () => {
			render(<Password {...defaultProps} showToggle={true} />);

			const toggleButton = screen.getByRole('button');
			expect(toggleButton).toHaveAttribute('type', 'button');
		});
	});

	describe('Checkmark Icon', () => {
		it('shows checkmark when isComplete is true and no error', () => {
			render(<Password {...defaultProps} isComplete={true} />);

			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is false', () => {
			render(<Password {...defaultProps} isComplete={false} />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is true but error exists', () => {
			render(<Password {...defaultProps} isComplete={true} error="Password is too short" />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('displays error message when error prop is provided', () => {
			render(<Password {...defaultProps} error="Password must be at least 8 characters" />);

			expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
			expect(screen.getByText('Password must be at least 8 characters')).toHaveClass('input-error');
		});

		it('does not display error message when error is null', () => {
			render(<Password {...defaultProps} error={null} />);

			expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
		});

		it('does not display error message when error is undefined', () => {
			render(<Password {...defaultProps} />);

			expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
		});
	});

	describe('Input Attributes', () => {
		it('sets correct name attribute', () => {
			render(<Password {...defaultProps} name="custom-password-name" />);

			expect(screen.getByDisplayValue('')).toHaveAttribute('name', 'custom-password-name');
		});

		it('sets correct id attribute', () => {
			render(<Password {...defaultProps} name="custom-password-name" />);

			expect(screen.getByDisplayValue('')).toHaveAttribute('id', 'custom-password-name');
		});

		it('sets placeholder attribute when provided', () => {
			render(<Password {...defaultProps} placeholder="Enter your secret password" />);

			expect(screen.getByPlaceholderText('Enter your secret password')).toBeInTheDocument();
		});
	});

	describe('CSS Classes', () => {
		it('applies correct classes to input', () => {
			render(<Password {...defaultProps} />);

			const input = screen.getByDisplayValue('');
			expect(input).toHaveClass('input');
		});

		it('applies correct classes to label', () => {
			render(<Password {...defaultProps} />);

			const label = screen.getByText('Password');
			expect(label).toHaveClass('label', 'mb-5');
		});

		it('applies correct classes to toggle button', () => {
			render(<Password {...defaultProps} showToggle={true} />);

			const toggleButton = screen.getByRole('button');
			expect(toggleButton).toHaveClass('show-hide');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string value', () => {
			render(<Password {...defaultProps} value="" />);

			expect(screen.getByDisplayValue('')).toBeInTheDocument();
		});

		it('handles special characters in password value', () => {
			render(<Password {...defaultProps} value="!@#$%^&*()_+-=[]{}|;:,.<>?" />);

			expect(screen.getByDisplayValue('!@#$%^&*()_+-=[]{}|;:,.<>?')).toBeInTheDocument();
		});

		it('handles very long password values', () => {
			const longPassword = 'a'.repeat(1000);
			render(<Password {...defaultProps} value={longPassword} />);

			expect(screen.getByDisplayValue(longPassword)).toBeInTheDocument();
		});

		it('handles numeric password values', () => {
			render(<Password {...defaultProps} value="123456789" />);

			expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
		});

		it('handles unicode characters in password', () => {
			render(<Password {...defaultProps} value="pässwörd123" />);

			expect(screen.getByDisplayValue('pässwörd123')).toBeInTheDocument();
		});
	});

	describe('Integration Tests', () => {
		it('maintains state correctly through multiple interactions', async () => {
			const user = userEvent.setup();
			const mockOnChange = jest.fn();
			const mockToggleHidePassword = jest.fn();

			render(
				<Password
					{...defaultProps}
					onChange={mockOnChange}
					toggleHidePassword={mockToggleHidePassword}
					showToggle={true}
				/>,
			);

			const input = screen.getByDisplayValue('');
			const toggleButton = screen.getByRole('button');

			// Type password
			await user.type(input, 'secret123');
			expect(mockOnChange).toHaveBeenLastCalledWith('3');

			// Toggle visibility
			await user.click(toggleButton);
			expect(mockToggleHidePassword).toHaveBeenCalledWith(false);

			// Clear and type again
			await user.clear(input);
			await user.type(input, 'newpassword');
			expect(mockOnChange).toHaveBeenLastCalledWith('d');
		});

		it('works correctly with all props combined', () => {
			const mockOnChange = jest.fn();
			const mockToggleHidePassword = jest.fn();

			render(
				<Password
					name="full-test-password"
					value="testpassword123"
					onChange={mockOnChange}
					type="password"
					placeholder="Enter your password"
					isComplete={true}
					label="Secure Password"
					error={null}
					hidePassword={true}
					toggleHidePassword={mockToggleHidePassword}
					showToggle={true}
				/>,
			);

			expect(screen.getByText('Secure Password')).toBeInTheDocument();
			expect(screen.getByDisplayValue('testpassword123')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: '[ SHOW ]' })).toBeInTheDocument();
			expect(screen.queryByText('Error')).not.toBeInTheDocument();
		});

		it('handles password visibility toggle with keyboard navigation', async () => {
			const user = userEvent.setup();
			const mockToggleHidePassword = jest.fn();

			render(<Password {...defaultProps} toggleHidePassword={mockToggleHidePassword} showToggle={true} />);

			const toggleButton = screen.getByRole('button', { name: '[ SHOW ]' });

			// Click to focus and then press Enter to toggle
			await user.click(toggleButton);
			await user.keyboard('{Enter}');
			expect(mockToggleHidePassword).toHaveBeenCalledWith(false);

			// Reset mock and test Space key
			mockToggleHidePassword.mockClear();
			await user.click(toggleButton);
			await user.keyboard(' ');
			expect(mockToggleHidePassword).toHaveBeenCalledWith(false);
		});
	});
});
