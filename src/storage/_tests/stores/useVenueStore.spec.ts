import { renderHook, act } from '@testing-library/react-hooks';
import { useVenueStore } from '../../stores/useVenueStore';
import type { Venue } from '../../../interfaces/Venue';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

// Mock TestConfig to test the conditional branch
jest.mock('../../../config/testing', () => ({
	__esModule: true,
	default: {
		stores: {
			venue: true, // Enable venue store testing
		},
	},
}));

// Mock venue data for testing
const mockVenues: Venue[] = [
	{
		id: '1',
		name: 'Test Venue 1',
		avatar: 'https://example.com/avatar1.jpg',
		website: 'https://venue1.com',
		type: 'Restaurant',
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
		name: 'Test Venue 2',
		type: 'Bar',
		isOperating: false,
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
];

describe('useVenueStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		useVenueStore.setState({
			searchVenues: [],
			loadingVenues: false,
			venuesError: null,
		});

		// Setup console.log spy
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		// Restore console.log
		consoleLogSpy.mockRestore();
	});

	afterAll(() => {
		// Restore original console.log
		console.log = originalConsoleLog;
	});

	describe('Initial State', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useVenueStore());

			expect(result.current.searchVenues).toEqual([]);
			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe(null);
		});

		it('should have all required methods available', () => {
			const { result } = renderHook(() => useVenueStore());

			expect(typeof result.current.setSearchVenues).toBe('function');
			expect(typeof result.current.setLoadingVenues).toBe('function');
			expect(typeof result.current.setVenuesError).toBe('function');
			expect(typeof result.current.resetVenues).toBe('function');
		});
	});

	describe('setSearchVenues', () => {
		it('should set search venues correctly', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setSearchVenues(mockVenues);
			});

			expect(result.current.searchVenues).toEqual(mockVenues);
			expect(result.current.searchVenues).toHaveLength(2);
		});

		it('should replace existing search venues', () => {
			const { result } = renderHook(() => useVenueStore());

			// Set initial venues
			act(() => {
				result.current.setSearchVenues([mockVenues[0]]);
			});
			expect(result.current.searchVenues).toHaveLength(1);

			// Replace with new venues
			act(() => {
				result.current.setSearchVenues([mockVenues[1]]);
			});
			expect(result.current.searchVenues).toEqual([mockVenues[1]]);
			expect(result.current.searchVenues).toHaveLength(1);
		});

		it('should handle empty array', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setSearchVenues([]);
			});

			expect(result.current.searchVenues).toEqual([]);
			expect(result.current.searchVenues).toHaveLength(0);
		});

		it('should handle null venues array', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setSearchVenues(null as any);
			});

			expect(result.current.searchVenues).toBeNull();
		});

		it('should handle undefined venues array', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setSearchVenues(undefined as any);
			});

			expect(result.current.searchVenues).toBeUndefined();
		});
	});

	describe('setLoadingVenues', () => {
		it('should set loading state to true', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setLoadingVenues(true);
			});

			expect(result.current.loadingVenues).toBe(true);
		});

		it('should set loading state to false', () => {
			const { result } = renderHook(() => useVenueStore());

			// Set to true first
			act(() => {
				result.current.setLoadingVenues(true);
			});
			expect(result.current.loadingVenues).toBe(true);

			// Set to false
			act(() => {
				result.current.setLoadingVenues(false);
			});
			expect(result.current.loadingVenues).toBe(false);
		});

		it('should handle non-boolean values', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setLoadingVenues(1 as any);
			});
			expect(result.current.loadingVenues).toBe(1);

			act(() => {
				result.current.setLoadingVenues('true' as any);
			});
			expect(result.current.loadingVenues).toBe('true');
		});
	});

	describe('setVenuesError', () => {
		it('should set error message', () => {
			const { result } = renderHook(() => useVenueStore());
			const errorMessage = 'Failed to fetch venues';

			act(() => {
				result.current.setVenuesError(errorMessage);
			});

			expect(result.current.venuesError).toBe(errorMessage);
		});

		it('should clear error when set to null', () => {
			const { result } = renderHook(() => useVenueStore());

			// Set error first
			act(() => {
				result.current.setVenuesError('Some error');
			});
			expect(result.current.venuesError).toBe('Some error');

			// Clear error
			act(() => {
				result.current.setVenuesError(null);
			});
			expect(result.current.venuesError).toBe(null);
		});

		it('should handle empty string error', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setVenuesError('');
			});

			expect(result.current.venuesError).toBe('');
		});

		it('should handle undefined error', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setVenuesError(undefined as any);
			});

			expect(result.current.venuesError).toBeUndefined();
		});

		it('should handle non-string error types', () => {
			const { result } = renderHook(() => useVenueStore());

			act(() => {
				result.current.setVenuesError(123 as any);
			});
			expect(result.current.venuesError).toBe(123);

			act(() => {
				result.current.setVenuesError({ message: 'error' } as any);
			});
			expect(result.current.venuesError).toEqual({ message: 'error' });
		});
	});

	describe('resetVenues', () => {
		it('should reset all venue state to initial values', () => {
			const { result } = renderHook(() => useVenueStore());

			// Set some state first
			act(() => {
				result.current.setSearchVenues(mockVenues);
				result.current.setLoadingVenues(true);
				result.current.setVenuesError('Some error');
			});

			// Verify state was set
			expect(result.current.searchVenues).toEqual(mockVenues);
			expect(result.current.loadingVenues).toBe(true);
			expect(result.current.venuesError).toBe('Some error');

			// Reset the state
			act(() => {
				result.current.resetVenues();
			});

			// Verify state was reset
			expect(result.current.searchVenues).toEqual([]);
			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe(null);
		});

		it('should reset state even when already in initial state', () => {
			const { result } = renderHook(() => useVenueStore());

			// Verify initial state
			expect(result.current.searchVenues).toEqual([]);
			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe(null);

			// Reset (should not cause issues)
			act(() => {
				result.current.resetVenues();
			});

			// Verify state remains reset
			expect(result.current.searchVenues).toEqual([]);
			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe(null);
		});

		it('should reset state with partial data', () => {
			const { result } = renderHook(() => useVenueStore());

			// Set only some state
			act(() => {
				result.current.setSearchVenues(mockVenues);
				// Don't set loading or error
			});

			// Reset the state
			act(() => {
				result.current.resetVenues();
			});

			// Verify all state was reset
			expect(result.current.searchVenues).toEqual([]);
			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe(null);
		});
	});

	describe('State Persistence', () => {
		it('should persist state changes across store instances', () => {
			const { result } = renderHook(() => useVenueStore());

			// Set some state
			act(() => {
				result.current.setSearchVenues(mockVenues);
				result.current.setLoadingVenues(true);
				result.current.setVenuesError('Test error');
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useVenueStore());

			// State should be persisted
			expect(newResult.current.searchVenues).toEqual(mockVenues);
			expect(newResult.current.loadingVenues).toBe(true);
			expect(newResult.current.venuesError).toBe('Test error');
		});
	});

	describe('Store Subscription and Logging', () => {
		it('should log state changes when test config is enabled', () => {
			// The mock already enables venue testing, so subscription should be active
			const { result } = renderHook(() => useVenueStore());

			// Trigger a state change
			act(() => {
				result.current.setSearchVenues(mockVenues);
			});

			// Verify that console.log was called with state information
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Venue State:',
				expect.objectContaining({
					searchVenues: mockVenues,
					loadingVenues: false,
					venuesError: null,
				}),
			);
		});

		it('should log multiple state changes', () => {
			const { result } = renderHook(() => useVenueStore());

			// Trigger multiple state changes
			act(() => {
				result.current.setLoadingVenues(true);
			});

			act(() => {
				result.current.setSearchVenues(mockVenues);
			});

			act(() => {
				result.current.setVenuesError('Test error');
			});

			// Verify multiple log calls
			expect(consoleLogSpy).toHaveBeenCalledTimes(3);
		});
	});

	describe('Complex Scenarios', () => {
		it('should handle multiple state changes in sequence', () => {
			const { result } = renderHook(() => useVenueStore());

			// Simulate a loading sequence
			act(() => {
				result.current.setLoadingVenues(true);
				result.current.setVenuesError(null);
			});
			expect(result.current.loadingVenues).toBe(true);
			expect(result.current.venuesError).toBe(null);

			// Simulate successful data fetch
			act(() => {
				result.current.setSearchVenues(mockVenues);
				result.current.setLoadingVenues(false);
			});
			expect(result.current.searchVenues).toEqual(mockVenues);
			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe(null);
		});

		it('should handle error scenario', () => {
			const { result } = renderHook(() => useVenueStore());

			// Simulate loading
			act(() => {
				result.current.setLoadingVenues(true);
			});

			// Simulate error
			act(() => {
				result.current.setVenuesError('Network error');
				result.current.setLoadingVenues(false);
			});

			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe('Network error');
			expect(result.current.searchVenues).toEqual([]);
		});

		it('should handle rapid state changes', () => {
			const { result } = renderHook(() => useVenueStore());

			// Rapidly change state multiple times
			act(() => {
				result.current.setLoadingVenues(true);
				result.current.setSearchVenues([mockVenues[0]]);
				result.current.setVenuesError('Error 1');
				result.current.setLoadingVenues(false);
				result.current.setSearchVenues([mockVenues[1]]);
				result.current.setVenuesError('Error 2');
				result.current.setSearchVenues(mockVenues);
				result.current.setVenuesError(null);
			});

			// Verify final state
			expect(result.current.searchVenues).toEqual(mockVenues);
			expect(result.current.loadingVenues).toBe(false);
			expect(result.current.venuesError).toBe(null);
		});

		it('should handle concurrent state updates', () => {
			const { result } = renderHook(() => useVenueStore());

			// Simulate concurrent updates
			act(() => {
				// These should all be applied in the order they're called
				result.current.setLoadingVenues(true);
				result.current.setSearchVenues([mockVenues[0]]);
				result.current.setVenuesError('Concurrent error');
			});

			expect(result.current.loadingVenues).toBe(true);
			expect(result.current.searchVenues).toEqual([mockVenues[0]]);
			expect(result.current.venuesError).toBe('Concurrent error');
		});
	});

	describe('Edge Cases', () => {
		it('should handle very large venue arrays', () => {
			const { result } = renderHook(() => useVenueStore());
			const largeVenueArray = Array.from({ length: 1000 }, (_, i) => ({
				...mockVenues[0],
				id: i.toString(),
				name: `Venue ${i}`,
			}));

			act(() => {
				result.current.setSearchVenues(largeVenueArray);
			});

			expect(result.current.searchVenues).toEqual(largeVenueArray);
			expect(result.current.searchVenues).toHaveLength(1000);
		});

		it('should handle venues with missing optional properties', () => {
			const { result } = renderHook(() => useVenueStore());
			const minimalVenue: Venue = {
				id: 'minimal',
				name: 'Minimal Venue',
				type: 'Restaurant',
				isOperating: true,
				addressStreet1: '123 Main St',
				addressCity: 'New York',
				addressRegion: 'NY',
				addressCountry: 'USA',
				addressZipCode: '10001',
				locale: 'en-US',
				timezone: 'America/New_York',
				latitude: '40.7128',
				longitude: '-74.0060',
			};

			act(() => {
				result.current.setSearchVenues([minimalVenue]);
			});

			expect(result.current.searchVenues).toEqual([minimalVenue]);
		});

		it('should handle empty string values in venue properties', () => {
			const { result } = renderHook(() => useVenueStore());
			const venueWithEmptyStrings: Venue = {
				...mockVenues[0],
				name: '',
				website: '',
				addressStreet2: '',
			};

			act(() => {
				result.current.setSearchVenues([venueWithEmptyStrings]);
			});

			expect(result.current.searchVenues).toEqual([venueWithEmptyStrings]);
		});
	});
});
