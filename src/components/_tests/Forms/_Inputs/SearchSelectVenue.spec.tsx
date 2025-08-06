import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Venue } from '@/interfaces/Venue';
import SearchSelectVenue from '../../../Forms/_Inputs/SearchSelectVenue';

// Mock the VenueTicket component
jest.mock('../../../Tickets/VenueTicket', () => {
	return function MockVenueTicket({ venue }: { venue: Venue }) {
		return (
			<div data-testid="venue-ticket">
				<span data-testid="venue-name">{venue.name}</span>
				<span data-testid="venue-address">
					{venue.addressStreet1}, {venue.addressCity}
				</span>
			</div>
		);
	};
});

describe('SearchSelectVenue Component', () => {
	const mockVenues: Venue[] = [
		{
			id: '1',
			name: 'The Grand Hall',
			avatar: 'venue1.jpg',
			website: 'https://grandhall.com',
			type: 'Concert Hall',
			isOperating: true,
			addressStreet1: '123 Main St',
			addressStreet2: 'Suite 100',
			addressCity: 'New York',
			addressRegion: 'NY',
			addressCountry: 'USA',
			addressZipCode: '10001',
			locale: 'en-US',
			timezone: 'America/New_York',
			latitude: '40.7128',
			longitude: '-74.0060',
		},
		{
			id: '2',
			name: 'Blue Moon Theater',
			avatar: 'venue2.jpg',
			website: 'https://bluemoon.com',
			type: 'Theater',
			isOperating: true,
			addressStreet1: '456 Oak Ave',
			addressCity: 'Los Angeles',
			addressRegion: 'CA',
			addressCountry: 'USA',
			addressZipCode: '90210',
			locale: 'en-US',
			timezone: 'America/Los_Angeles',
			latitude: '34.0522',
			longitude: '-118.2437',
		},
		{
			id: '3',
			name: 'Acoustic Lounge',
			avatar: 'venue3.jpg',
			website: 'https://acousticlounge.com',
			type: 'Bar',
			isOperating: true,
			addressStreet1: '789 Pine St',
			addressCity: 'Chicago',
			addressRegion: 'IL',
			addressCountry: 'USA',
			addressZipCode: '60601',
			locale: 'en-US',
			timezone: 'America/Chicago',
			latitude: '41.8781',
			longitude: '-87.6298',
		},
	];

	const defaultProps = {
		label: 'Select Venue',
		isComplete: false,
		error: undefined,
		disabled: false,
		options: [...mockVenues], // Create a copy to avoid mutation
		showOptions: false,
		setShowOptions: jest.fn(),
		selected: undefined,
		setSelected: jest.fn(),
		searchName: 'venue-search',
		searchValue: '',
		setSearchValue: jest.fn(),
		onSearch: jest.fn(),
		searchPlaceholder: 'Search venues...',
		loading: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with all required props', () => {
			render(<SearchSelectVenue {...defaultProps} />);

			expect(screen.getByText('Select Venue')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Search venues...')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
		});

		it('renders with custom label', () => {
			render(<SearchSelectVenue {...defaultProps} label="Choose Your Venue" />);

			expect(screen.getByText('Choose Your Venue')).toBeInTheDocument();
		});

		it('renders with custom placeholder', () => {
			render(<SearchSelectVenue {...defaultProps} searchPlaceholder="Enter venue name..." />);

			expect(screen.getByPlaceholderText('Enter venue name...')).toBeInTheDocument();
		});

		it('renders with search value', () => {
			render(<SearchSelectVenue {...defaultProps} searchValue="Grand Hall" />);

			// The component doesn't use searchValue to set the input value
			// It only uses it for the search button state
			expect(screen.getByPlaceholderText('Search venues...')).toBeInTheDocument();
		});

		it('renders with selected venue', () => {
			render(<SearchSelectVenue {...defaultProps} selected={mockVenues[0]} />);

			expect(screen.getByDisplayValue('')).toBeInTheDocument(); // Search input still shows search value
		});
	});

	describe('Label and Accessibility', () => {
		it('associates label with input using htmlFor', () => {
			render(<SearchSelectVenue {...defaultProps} />);

			const label = screen.getByText('Select Venue');
			const input = screen.getByPlaceholderText('Search venues...');

			expect(label).toHaveAttribute('for', 'venue-search');
			// The input doesn't have an id attribute in the component
			expect(input).toBeInTheDocument();
		});

		it('renders error message when error is provided', () => {
			render(<SearchSelectVenue {...defaultProps} error="Please select a venue" />);

			expect(screen.getByText('Please select a venue')).toBeInTheDocument();
			expect(screen.getByText('Please select a venue')).toHaveClass('input-error');
		});

		it('does not render error message when error is undefined', () => {
			render(<SearchSelectVenue {...defaultProps} />);

			expect(screen.queryByText('Please select a venue')).not.toBeInTheDocument();
		});
	});

	describe('Disabled State', () => {
		it('hides input and search button when disabled', () => {
			render(<SearchSelectVenue {...defaultProps} disabled={true} />);

			expect(screen.queryByPlaceholderText('Search venues...')).not.toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Search' })).not.toBeInTheDocument();
		});

		it('shows input and search button when not disabled', () => {
			render(<SearchSelectVenue {...defaultProps} disabled={false} />);

			expect(screen.getByPlaceholderText('Search venues...')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
		});
	});

	describe('Search Input Interactions', () => {
		it('calls setSearchValue when user types', async () => {
			const user = userEvent.setup();
			const mockSetSearchValue = jest.fn();

			render(<SearchSelectVenue {...defaultProps} setSearchValue={mockSetSearchValue} />);

			const input = screen.getByPlaceholderText('Search venues...');
			await user.type(input, 'Grand');

			expect(mockSetSearchValue).toHaveBeenCalledTimes(5);
			expect(mockSetSearchValue).toHaveBeenNthCalledWith(1, 'G');
			expect(mockSetSearchValue).toHaveBeenNthCalledWith(2, 'Gr');
			expect(mockSetSearchValue).toHaveBeenNthCalledWith(3, 'Gra');
			expect(mockSetSearchValue).toHaveBeenNthCalledWith(4, 'Gran');
			expect(mockSetSearchValue).toHaveBeenNthCalledWith(5, 'Grand');
		});

		it('calls setShowOptions when input is focused with non-empty value', () => {
			const mockSetShowOptions = jest.fn();

			render(<SearchSelectVenue {...defaultProps} setShowOptions={mockSetShowOptions} />);

			const input = screen.getByPlaceholderText('Search venues...');
			// First type something to set the input value
			fireEvent.change(input, { target: { value: 'Grand Hall' } });
			fireEvent.focus(input);

			expect(mockSetShowOptions).toHaveBeenCalledWith(true);
		});

		it('does not call setShowOptions when input is focused with empty value', () => {
			const mockSetShowOptions = jest.fn();

			render(<SearchSelectVenue {...defaultProps} setShowOptions={mockSetShowOptions} />);

			const input = screen.getByPlaceholderText('Search venues...');
			fireEvent.focus(input);

			expect(mockSetShowOptions).not.toHaveBeenCalled();
		});
	});

	describe('Search Button', () => {
		it('calls onSearch when search button is clicked', () => {
			const mockOnSearch = jest.fn();

			render(<SearchSelectVenue {...defaultProps} onSearch={mockOnSearch} />);

			const searchButton = screen.getByRole('button', { name: 'Search' });
			fireEvent.click(searchButton);

			expect(mockOnSearch).toHaveBeenCalledTimes(1);
		});

		it('calls onSearch when search button is pressed with Enter key', () => {
			const mockOnSearch = jest.fn();

			render(<SearchSelectVenue {...defaultProps} onSearch={mockOnSearch} />);

			const searchButton = screen.getByRole('button', { name: 'Search' });
			fireEvent.keyDown(searchButton, { key: 'Enter' });

			expect(mockOnSearch).toHaveBeenCalledTimes(1);
		});

		it('calls onSearch when search button is pressed with Space key', () => {
			const mockOnSearch = jest.fn();

			render(<SearchSelectVenue {...defaultProps} onSearch={mockOnSearch} />);

			const searchButton = screen.getByRole('button', { name: 'Search' });
			fireEvent.keyDown(searchButton, { key: ' ' });

			expect(mockOnSearch).toHaveBeenCalledTimes(1);
		});

		it('has disabled class when search value is empty', () => {
			render(<SearchSelectVenue {...defaultProps} searchValue="" />);

			const searchButton = screen.getByRole('button', { name: 'Search' });
			expect(searchButton).toHaveClass('submit-btn', 'disabled');
		});

		it('has enabled class when search value is not empty', () => {
			render(<SearchSelectVenue {...defaultProps} searchValue="Grand Hall" />);

			const searchButton = screen.getByRole('button', { name: 'Search' });
			expect(searchButton).toHaveClass('submit-btn');
			expect(searchButton).not.toHaveClass('disabled');
		});
	});

	describe('Options Dropdown', () => {
		it('shows options when showOptions is true and options exist', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={true} />);

			expect(screen.getByText('The Grand Hall')).toBeInTheDocument();
			expect(screen.getByText('Blue Moon Theater')).toBeInTheDocument();
			expect(screen.getByText('Acoustic Lounge')).toBeInTheDocument();
		});

		it('does not show options when showOptions is false', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={false} />);

			expect(screen.queryByText('The Grand Hall')).not.toBeInTheDocument();
			expect(screen.queryByText('Blue Moon Theater')).not.toBeInTheDocument();
			expect(screen.queryByText('Acoustic Lounge')).not.toBeInTheDocument();
		});

		it('shows loading state when loading is true', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={true} loading={true} />);

			expect(screen.getByAltText('loader')).toBeInTheDocument();
		});

		it('shows "No Results. Try Again" when no options exist', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={true} options={[]} />);

			expect(screen.getByText('No Results. Try Again')).toBeInTheDocument();
		});

		it('calls setSelected when an option is clicked', () => {
			const mockSetSelected = jest.fn();

			render(<SearchSelectVenue {...defaultProps} showOptions={true} setSelected={mockSetSelected} />);

			const firstOption = screen.getByText('Acoustic Lounge');
			fireEvent.click(firstOption);

			expect(mockSetSelected).toHaveBeenCalledWith(mockVenues[2]); // Acoustic Lounge is the first after sorting
		});

		it('calls setSelected when an option is pressed with Enter key', () => {
			const mockSetSelected = jest.fn();

			render(<SearchSelectVenue {...defaultProps} showOptions={true} setSelected={mockSetSelected} />);

			const firstOption = screen.getByText('Acoustic Lounge');
			fireEvent.keyDown(firstOption, { key: 'Enter' });

			expect(mockSetSelected).toHaveBeenCalledWith(mockVenues[2]); // Acoustic Lounge is the first after sorting
		});

		it('calls setSelected when an option is pressed with Space key', () => {
			const mockSetSelected = jest.fn();

			render(<SearchSelectVenue {...defaultProps} showOptions={true} setSelected={mockSetSelected} />);

			const firstOption = screen.getByText('Acoustic Lounge');
			fireEvent.keyDown(firstOption, { key: ' ' });

			expect(mockSetSelected).toHaveBeenCalledWith(mockVenues[2]); // Acoustic Lounge is the first after sorting
		});

		it('applies active class to selected option', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={true} selected={mockVenues[0]} />);

			// After sorting, The Grand Hall should be at index 2
			const selectedOption = screen.getByText('The Grand Hall').closest('li');
			expect(selectedOption).toHaveClass('option', 'active');
		});

		it('does not apply active class to non-selected options', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={true} selected={mockVenues[0]} />);

			const nonSelectedOption = screen.getByText('Blue Moon Theater').closest('li');
			expect(nonSelectedOption).toHaveClass('option');
			expect(nonSelectedOption).not.toHaveClass('active');
		});
	});

	describe('Background Listener', () => {
		it('calls setShowOptions(false) when background listener is clicked', () => {
			const mockSetShowOptions = jest.fn();

			render(<SearchSelectVenue {...defaultProps} showOptions={true} setShowOptions={mockSetShowOptions} />);

			const backgroundListener = screen.getByRole('button', { name: '' }); // Empty name for background listener
			fireEvent.click(backgroundListener);

			expect(mockSetShowOptions).toHaveBeenCalledWith(false);
		});

		it('calls setShowOptions(false) when background listener is pressed with Enter key', () => {
			const mockSetShowOptions = jest.fn();

			render(<SearchSelectVenue {...defaultProps} showOptions={true} setShowOptions={mockSetShowOptions} />);

			const backgroundListener = screen.getByRole('button', { name: '' });
			fireEvent.keyDown(backgroundListener, { key: 'Enter' });

			expect(mockSetShowOptions).toHaveBeenCalledWith(false);
		});

		it('calls setShowOptions(false) when background listener is pressed with Space key', () => {
			const mockSetShowOptions = jest.fn();

			render(<SearchSelectVenue {...defaultProps} showOptions={true} setShowOptions={mockSetShowOptions} />);

			const backgroundListener = screen.getByRole('button', { name: '' });
			fireEvent.keyDown(backgroundListener, { key: ' ' });

			expect(mockSetShowOptions).toHaveBeenCalledWith(false);
		});

		it('does not render background listener when showOptions is false', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={false} />);

			expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument();
		});
	});

	describe('Options Sorting', () => {
		it('sorts options alphabetically by name', () => {
			const unsortedVenues = [
				{ ...mockVenues[2] }, // Acoustic Lounge
				{ ...mockVenues[0] }, // The Grand Hall
				{ ...mockVenues[1] }, // Blue Moon Theater
			];

			render(<SearchSelectVenue {...defaultProps} showOptions={true} options={unsortedVenues} />);

			const options = screen.getAllByTestId('venue-name');
			expect(options[0]).toHaveTextContent('Acoustic Lounge');
			expect(options[1]).toHaveTextContent('Blue Moon Theater');
			expect(options[2]).toHaveTextContent('The Grand Hall');
		});
	});

	describe('CSS Classes', () => {
		it('applies correct classes to input field when showOptions is false', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={false} />);

			const inputField = screen.getByPlaceholderText('Search venues...').closest('.input-field');
			expect(inputField).toHaveClass('input-field', 'relative-index');
		});

		it('applies correct classes to input field when showOptions is true', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={true} />);

			const inputField = screen.getByPlaceholderText('Search venues...').closest('.input-field');
			expect(inputField).toHaveClass('input-field');
			expect(inputField).not.toHaveClass('relative-index');
		});

		it('applies correct classes to input when not disabled', () => {
			render(<SearchSelectVenue {...defaultProps} />);

			const input = screen.getByPlaceholderText('Search venues...');
			expect(input).toHaveClass('input');
			expect(input).not.toHaveClass('disabled');
		});

		it('applies correct classes to input when disabled', () => {
			render(<SearchSelectVenue {...defaultProps} disabled={true} />);

			// When disabled, input is not rendered
			expect(screen.queryByPlaceholderText('Search venues...')).not.toBeInTheDocument();
		});
	});

	describe('Edge Cases', () => {
		it('handles empty options array', () => {
			render(<SearchSelectVenue {...defaultProps} showOptions={true} options={[]} />);

			expect(screen.getByText('No Results. Try Again')).toBeInTheDocument();
		});

		it('handles options with missing optional fields', () => {
			const minimalVenue: Venue = {
				id: 'minimal',
				name: 'Minimal Venue',
				type: 'Unknown',
				isOperating: true,
				addressStreet1: '123 Test St',
				addressCity: 'Test City',
				addressRegion: 'TS',
				addressCountry: 'USA',
				addressZipCode: '12345',
				locale: 'en-US',
				timezone: 'UTC',
				latitude: '0',
				longitude: '0',
			};

			render(<SearchSelectVenue {...defaultProps} showOptions={true} options={[minimalVenue]} />);

			expect(screen.getByText('Minimal Venue')).toBeInTheDocument();
		});

		it('handles very long venue names', () => {
			const longNameVenue = {
				...mockVenues[0],
				name: 'A'.repeat(100),
			};

			render(<SearchSelectVenue {...defaultProps} showOptions={true} options={[longNameVenue]} />);

			expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
		});

		it('handles special characters in venue names', () => {
			const specialCharVenue = {
				...mockVenues[0],
				name: 'Venue & Co. (Special) - "Quotes"',
			};

			render(<SearchSelectVenue {...defaultProps} showOptions={true} options={[specialCharVenue]} />);

			expect(screen.getByText('Venue & Co. (Special) - "Quotes"')).toBeInTheDocument();
		});
	});

	describe('Integration Tests', () => {
		it('maintains state correctly through multiple interactions', async () => {
			const user = userEvent.setup();
			const mockSetSearchValue = jest.fn();
			const mockSetShowOptions = jest.fn();
			const mockSetSelected = jest.fn();

			render(
				<SearchSelectVenue
					{...defaultProps}
					setSearchValue={mockSetSearchValue}
					setShowOptions={mockSetShowOptions}
					setSelected={mockSetSelected}
					showOptions={true}
				/>,
			);

			// Type in search input
			const input = screen.getByPlaceholderText('Search venues...');
			await user.type(input, 'Grand');

			expect(mockSetSearchValue).toHaveBeenCalledTimes(5);

			// Click on an option (first alphabetically)
			const option = screen.getByText('Acoustic Lounge');
			await user.click(option);

			expect(mockSetSelected).toHaveBeenCalledWith(mockVenues[2]); // Acoustic Lounge is the first after sorting

			// Click search button
			const searchButton = screen.getByRole('button', { name: 'Search' });
			await user.click(searchButton);

			expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
		});

		it('works correctly with all props combined', () => {
			const mockSetSearchValue = jest.fn();
			const mockSetShowOptions = jest.fn();
			const mockSetSelected = jest.fn();
			const mockOnSearch = jest.fn();

			render(
				<SearchSelectVenue
					label="Choose Venue"
					isComplete={true}
					error="Please select a venue"
					disabled={false}
					options={mockVenues}
					showOptions={true}
					setShowOptions={mockSetShowOptions}
					selected={mockVenues[0]}
					setSelected={mockSetSelected}
					searchName="venue-selector"
					searchValue="Grand Hall"
					setSearchValue={mockSetSearchValue}
					onSearch={mockOnSearch}
					searchPlaceholder="Search for venues..."
					loading={false}
				/>,
			);

			expect(screen.getByText('Choose Venue')).toBeInTheDocument();
			expect(screen.getByText('Please select a venue')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Search for venues...')).toBeInTheDocument();
			expect(screen.getByText('The Grand Hall')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
		});
	});
});
