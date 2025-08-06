import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FullUser } from '@/interfaces/User';
import SelectUser from '../../../Forms/_Inputs/SelectUser';

// Mock the UserTicket component
jest.mock('../../../Tickets/UserTicket', () => {
	return function MockUserTicket({ user, children }: { user: FullUser; children?: React.ReactNode }) {
		if (!user) {
			return (
				<>
					<p className="low-opacity-text">( Select User )</p>
					{children}
				</>
			);
		}
		return (
			<div className="user-ticket">
				<div className="avatar">
					<img src={user.avatar || '/image/webp/placeholders/avatar.webp'} height={40} width={40} alt="avatar" />
				</div>
				<div className="select-user-body">
					{user.name && <span className="title">{user.name}</span>}
					<span className="secondary">{user.email}</span>
				</div>
				{children}
			</div>
		);
	};
});

describe('SelectUser Component', () => {
	const mockUser: FullUser = {
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		username: 'johndoe',
		avatar: '/avatar.jpg',
		cloudServices: [],
		type: 'user',
		userRoles: [],
		created: new Date(),
		updated: new Date(),
	};

	const mockOptions = [
		{ user: mockUser },
		{
			user: {
				id: '2',
				name: 'Jane Smith',
				email: 'jane@example.com',
				username: 'janesmith',
				avatar: '/avatar2.jpg',
				cloudServices: [],
				type: 'user',
				userRoles: [],
				created: new Date(),
				updated: new Date(),
			},
		},
	];

	const defaultProps = {
		name: 'test-select-user',
		label: 'Select User',
		user: null,
		isComplete: false,
		options: mockOptions,
		showOptions: false,
		setShowOptions: jest.fn(),
		setSelected: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with all required props', () => {
			render(<SelectUser {...defaultProps} />);

			expect(screen.getByText('Select User')).toBeInTheDocument();
			expect(screen.getByText('( Select User )')).toBeInTheDocument();
		});

		it('renders with selected user', () => {
			render(<SelectUser {...defaultProps} user={mockUser} />);

			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('john@example.com')).toBeInTheDocument();
		});

		it('renders with custom label', () => {
			render(<SelectUser {...defaultProps} label="Choose User" />);

			expect(screen.getByText('Choose User')).toBeInTheDocument();
		});

		it('renders with disabled state', () => {
			render(<SelectUser {...defaultProps} disabled={true} />);

			const button = screen.getByRole('button', { name: /select user/i });
			expect(button).toHaveClass('disabled');
		});

		it('renders without disabled state by default', () => {
			render(<SelectUser {...defaultProps} />);

			const button = screen.getByRole('button', { name: /select user/i });
			expect(button).not.toHaveClass('disabled');
		});
	});

	describe('Label and Accessibility', () => {
		it('associates label with input using htmlFor and name', () => {
			render(<SelectUser {...defaultProps} />);

			const label = screen.getByText('Select User');
			expect(label).toHaveAttribute('for', 'test-select-user');
		});

		it('renders label text correctly', () => {
			render(<SelectUser {...defaultProps} label="Custom Label" />);

			expect(screen.getByText('Custom Label')).toBeInTheDocument();
		});
	});

	describe('Checkmark Icon', () => {
		it('shows checkmark when isComplete is true and no error', () => {
			render(<SelectUser {...defaultProps} isComplete={true} />);

			expect(screen.getByAltText('check-icon')).toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is false', () => {
			render(<SelectUser {...defaultProps} isComplete={false} />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});

		it('does not show checkmark when isComplete is true but error exists', () => {
			render(<SelectUser {...defaultProps} isComplete={true} error="Error message" />);

			expect(screen.queryByAltText('check-icon')).not.toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('displays error message when error prop is provided', () => {
			render(<SelectUser {...defaultProps} error="This field is required" />);

			expect(screen.getByText('This field is required')).toBeInTheDocument();
			expect(screen.getByText('This field is required')).toHaveClass('input-error');
		});

		it('does not display error message when error prop is not provided', () => {
			render(<SelectUser {...defaultProps} />);

			expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
		});
	});

	describe('User Interactions', () => {
		it('calls setShowOptions when button is clicked and not disabled', async () => {
			const user = userEvent.setup();
			const setShowOptions = jest.fn();
			render(<SelectUser {...defaultProps} setShowOptions={setShowOptions} />);

			const button = screen.getByRole('button', { name: /select user/i });
			await user.click(button);

			expect(setShowOptions).toHaveBeenCalledWith(true);
		});

		it('does not call setShowOptions when button is clicked and disabled', async () => {
			const user = userEvent.setup();
			const setShowOptions = jest.fn();
			render(<SelectUser {...defaultProps} setShowOptions={setShowOptions} disabled={true} />);

			const button = screen.getByRole('button', { name: /select user/i });
			await user.click(button);

			expect(setShowOptions).not.toHaveBeenCalled();
		});

		it('toggles showOptions when button is clicked and options are already shown', async () => {
			const user = userEvent.setup();
			const setShowOptions = jest.fn();
			render(<SelectUser {...defaultProps} setShowOptions={setShowOptions} showOptions={true} />);

			const button = screen.getByRole('button', { name: /select user/i });
			await user.click(button);

			expect(setShowOptions).toHaveBeenCalledWith(false);
		});
	});

	describe('Options Display', () => {
		it('shows options list when showOptions is true', () => {
			render(<SelectUser {...defaultProps} showOptions={true} />);

			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('Jane Smith')).toBeInTheDocument();
			expect(screen.getByText('john@example.com')).toBeInTheDocument();
			expect(screen.getByText('jane@example.com')).toBeInTheDocument();
		});

		it('does not show options list when showOptions is false', () => {
			render(<SelectUser {...defaultProps} showOptions={false} />);

			expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
			expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
		});

		it('renders all options in the list', () => {
			render(<SelectUser {...defaultProps} showOptions={true} />);

			const listItems = screen.getAllByRole('listitem');
			expect(listItems).toHaveLength(2);
		});

		it('highlights selected user in options list', () => {
			render(<SelectUser {...defaultProps} showOptions={true} user={mockUser} />);

			const listItems = screen.getAllByRole('listitem');
			const selectedOption = listItems.find((item) => item.querySelector('.selected'));
			expect(selectedOption).toHaveClass('active');
		});

		it('does not highlight any option when no user is selected', () => {
			render(<SelectUser {...defaultProps} showOptions={true} user={null} />);

			const listItems = screen.getAllByRole('listitem');
			listItems.forEach((item) => {
				expect(item).not.toHaveClass('active');
			});
		});
	});

	describe('Option Selection', () => {
		it('calls setSelected when an option is clicked', async () => {
			const user = userEvent.setup();
			const setSelected = jest.fn();
			render(<SelectUser {...defaultProps} showOptions={true} setSelected={setSelected} />);

			const optionButton = screen.getByText('Jane Smith').closest('button');
			await user.click(optionButton!);

			expect(setSelected).toHaveBeenCalledWith(mockOptions[1]);
		});

		it('calls setSelected with correct user data when option is clicked', async () => {
			const user = userEvent.setup();
			const setSelected = jest.fn();
			render(<SelectUser {...defaultProps} showOptions={true} setSelected={setSelected} />);

			const optionButton = screen.getByText('John Doe').closest('button');
			await user.click(optionButton!);

			expect(setSelected).toHaveBeenCalledWith(mockOptions[0]);
		});
	});

	describe('External Click Listener', () => {
		it('renders external click listener when showOptions is true', () => {
			render(<SelectUser {...defaultProps} showOptions={true} />);

			const externalListener = screen.getByRole('button', { name: '' });
			expect(externalListener).toHaveClass('select-external-listener');
		});

		it('does not render external click listener when showOptions is false', () => {
			render(<SelectUser {...defaultProps} showOptions={false} />);

			expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument();
		});

		it('calls setShowOptions with false when external listener is clicked', async () => {
			const user = userEvent.setup();
			const setShowOptions = jest.fn();
			render(<SelectUser {...defaultProps} showOptions={true} setShowOptions={setShowOptions} />);

			const externalListener = screen.getByRole('button', { name: '' });
			await user.click(externalListener);

			expect(setShowOptions).toHaveBeenCalledWith(false);
		});
	});

	describe('CSS Classes', () => {
		it('applies correct classes when user is selected and options are shown', () => {
			render(<SelectUser {...defaultProps} user={mockUser} showOptions={true} />);

			const buttons = screen.getAllByRole('button');
			const mainButton = buttons.find((button) => button.classList.contains('select-input'));
			expect(mainButton).toHaveClass('select-input', 'clickable-div', 'mt-5', 'user', 'open');
		});

		it('applies correct classes when user is selected and options are not shown', () => {
			render(<SelectUser {...defaultProps} user={mockUser} showOptions={false} />);

			const button = screen.getByRole('button', { name: /john doe/i });
			expect(button).toHaveClass('select-input', 'clickable-div', 'mt-5', 'user');
			expect(button).not.toHaveClass('open');
		});

		it('applies correct classes when no user is selected and options are shown', () => {
			render(<SelectUser {...defaultProps} user={null} showOptions={true} />);

			const button = screen.getByRole('button', { name: /select user/i });
			expect(button).toHaveClass('select-input', 'clickable-div', 'mt-5', 'user', 'open', 'light');
		});

		it('applies correct classes when no user is selected and options are not shown', () => {
			render(<SelectUser {...defaultProps} user={null} showOptions={false} />);

			const button = screen.getByRole('button', { name: /select user/i });
			expect(button).toHaveClass('select-input', 'clickable-div', 'mt-5', 'user', 'light');
			expect(button).not.toHaveClass('open');
		});

		it('applies disabled classes when disabled is true', () => {
			render(<SelectUser {...defaultProps} user={mockUser} disabled={true} showOptions={true} />);

			const buttons = screen.getAllByRole('button');
			const mainButton = buttons.find((button) => button.classList.contains('select-input'));
			expect(mainButton).toHaveClass('select-input', 'clickable-div', 'mt-5', 'user', 'open', 'disabled');
		});

		it('applies disabled classes when disabled is true and no user selected', () => {
			render(<SelectUser {...defaultProps} user={null} disabled={true} showOptions={true} />);

			const button = screen.getByRole('button', { name: /select user/i });
			expect(button).toHaveClass('select-input', 'clickable-div', 'mt-5', 'user', 'open', 'light', 'disabled');
		});
	});

	describe('Indicator Arrow', () => {
		it('shows indicator arrow when not disabled', () => {
			render(<SelectUser {...defaultProps} />);

			expect(screen.getByText('«')).toBeInTheDocument();
		});

		it('does not show indicator arrow when disabled', () => {
			render(<SelectUser {...defaultProps} disabled={true} />);

			expect(screen.queryByText('«')).not.toBeInTheDocument();
		});

		it('applies correct indicator classes when options are shown', () => {
			render(<SelectUser {...defaultProps} showOptions={true} />);

			const indicator = screen.getByText('«');
			expect(indicator).toHaveClass('indicator', 'open');
		});

		it('applies correct indicator classes when options are not shown', () => {
			render(<SelectUser {...defaultProps} showOptions={false} />);

			const indicator = screen.getByText('«');
			expect(indicator).toHaveClass('indicator');
			expect(indicator).not.toHaveClass('open');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty options array', () => {
			render(<SelectUser {...defaultProps} options={[]} showOptions={true} />);

			const listItems = screen.queryAllByRole('listitem');
			expect(listItems).toHaveLength(0);
		});

		it('handles user without avatar', () => {
			const userWithoutAvatar = { ...mockUser, avatar: undefined };
			render(<SelectUser {...defaultProps} user={userWithoutAvatar} />);

			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('john@example.com')).toBeInTheDocument();
		});

		it('handles user without name', () => {
			const userWithoutName = { ...mockUser, name: undefined };
			render(<SelectUser {...defaultProps} user={userWithoutName} />);

			expect(screen.getByText('john@example.com')).toBeInTheDocument();
			expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
		});

		it('handles null user gracefully', () => {
			render(<SelectUser {...defaultProps} user={null} />);

			expect(screen.getByText('( Select User )')).toBeInTheDocument();
		});
	});

	describe('Container Structure', () => {
		it('renders with correct container classes', () => {
			render(<SelectUser {...defaultProps} />);

			const container = screen.getByText('Select User').closest('.select-input-container');
			expect(container).toHaveClass('select-input-container', 'select-user-dropdown');
		});

		it('renders input field with correct classes', () => {
			render(<SelectUser {...defaultProps} />);

			const inputField = screen.getByText('Select User').closest('.input-field');
			expect(inputField).toHaveClass('input-field');
		});

		it('applies relative-index class when options are shown', () => {
			render(<SelectUser {...defaultProps} showOptions={true} />);

			const inputField = screen.getByText('Select User').closest('.input-field');
			expect(inputField).toHaveClass('input-field', 'relative-index');
		});

		it('does not apply relative-index class when options are not shown', () => {
			render(<SelectUser {...defaultProps} showOptions={false} />);

			const inputField = screen.getByText('Select User').closest('.input-field');
			expect(inputField).toHaveClass('input-field');
			expect(inputField).not.toHaveClass('relative-index');
		});
	});
});
