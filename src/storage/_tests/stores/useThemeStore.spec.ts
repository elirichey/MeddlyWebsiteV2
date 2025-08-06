import { renderHook, act } from '@testing-library/react-hooks';
import { useThemeStore } from '../../stores/useThemeStore';
import TestConfig from '../../../config/testing';

// Mock console.log to test the subscription logging
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('useThemeStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		useThemeStore.setState({ darkMode: false });
		// Clear mock calls
		mockConsoleLog.mockClear();
	});

	afterAll(() => {
		mockConsoleLog.mockRestore();
	});

	it('should initialize with darkMode set to false', () => {
		const { result } = renderHook(() => useThemeStore());
		expect(result.current.darkMode).toBe(false);
	});

	it('should toggle darkMode when toggleDarkMode is called', () => {
		const { result } = renderHook(() => useThemeStore());

		// Initial state
		expect(result.current.darkMode).toBe(false);

		// Toggle to true
		act(() => {
			result.current.toggleDarkMode();
		});
		expect(result.current.darkMode).toBe(true);

		// Toggle back to false
		act(() => {
			result.current.toggleDarkMode();
		});
		expect(result.current.darkMode).toBe(false);
	});

	it('should persist state changes', () => {
		const { result } = renderHook(() => useThemeStore());

		// Toggle dark mode
		act(() => {
			result.current.toggleDarkMode();
		});

		// Create a new instance of the store
		const { result: newResult } = renderHook(() => useThemeStore());

		// State should be persisted
		expect(newResult.current.darkMode).toBe(true);
	});

	it('should reset theme state when resetTheme is called', () => {
		const { result } = renderHook(() => useThemeStore());

		// First toggle dark mode to true
		act(() => {
			result.current.toggleDarkMode();
		});
		expect(result.current.darkMode).toBe(true);

		// Reset the theme
		act(() => {
			result.current.resetTheme();
		});
		expect(result.current.darkMode).toBe(false);

		// Verify the reset persists
		const { result: newResult } = renderHook(() => useThemeStore());
		expect(newResult.current.darkMode).toBe(false);
	});

	it('should handle multiple rapid toggles correctly', () => {
		const { result } = renderHook(() => useThemeStore());

		// Perform multiple rapid toggles
		act(() => {
			result.current.toggleDarkMode();
			result.current.toggleDarkMode();
			result.current.toggleDarkMode();
		});

		// Should end up in the correct state (true after 3 toggles from false)
		expect(result.current.darkMode).toBe(true);
	});

	it('should maintain state across multiple hook instances', () => {
		const { result: result1 } = renderHook(() => useThemeStore());
		const { result: result2 } = renderHook(() => useThemeStore());

		// Both should have the same initial state
		expect(result1.current.darkMode).toBe(false);
		expect(result2.current.darkMode).toBe(false);

		// Toggle using first instance
		act(() => {
			result1.current.toggleDarkMode();
		});

		// Both instances should reflect the change
		expect(result1.current.darkMode).toBe(true);
		expect(result2.current.darkMode).toBe(true);
	});

	it('should reset to false even when already false', () => {
		const { result } = renderHook(() => useThemeStore());

		// Ensure we start with false
		expect(result.current.darkMode).toBe(false);

		// Reset when already false
		act(() => {
			result.current.resetTheme();
		});

		// Should still be false
		expect(result.current.darkMode).toBe(false);
	});

	it('should handle toggleDarkMode when called multiple times in sequence', () => {
		const { result } = renderHook(() => useThemeStore());

		// Call toggleDarkMode multiple times in sequence
		act(() => {
			result.current.toggleDarkMode();
			result.current.toggleDarkMode();
		});

		// Should end up back at false (false -> true -> false)
		expect(result.current.darkMode).toBe(false);
	});

	describe('conditional subscription logging', () => {
		it('should not log when TestConfig.stores.theme is false', () => {
			// Ensure TestConfig.stores.theme is false (default)
			expect(TestConfig.stores.theme).toBe(false);

			const { result } = renderHook(() => useThemeStore());

			// Perform an action that would trigger the subscription
			act(() => {
				result.current.toggleDarkMode();
			});

			// Should not have logged anything
			expect(mockConsoleLog).not.toHaveBeenCalled();
		});

		it('should log state changes when TestConfig.stores.theme is true', () => {
			// Use jest.isolateModules to reload the module with modified config
			jest.isolateModules(() => {
				// Mock the TestConfig to return true for theme
				jest.doMock('../../../config/testing', () => ({
					__esModule: true,
					default: {
						stores: {
							camera: false,
							device: false,
							event: false,
							media: false,
							org: false,
							packages: false,
							roles: false,
							sequences: false,
							server: false,
							socket: false,
							support: false,
							theme: true, // Set to true to trigger the subscription
							uploads: false,
							user: false,
							venue: false,
						},
						components: {
							camera: false,
						},
					},
				}));

				// Import the store in the isolated module context
				const { useThemeStore: isolatedUseThemeStore } = require('../../stores/useThemeStore');

				// Test the store with logging enabled by directly calling the store
				// instead of using renderHook inside isolateModules
				const store = isolatedUseThemeStore.getState();

				// Perform an action that should trigger logging
				isolatedUseThemeStore.getState().toggleDarkMode();

				// Verify that logging occurred
				expect(mockConsoleLog).toHaveBeenCalledWith(
					'Theme State:',
					expect.objectContaining({
						darkMode: true,
						toggleDarkMode: expect.any(Function),
						resetTheme: expect.any(Function),
					}),
				);
			});
		});
	});

	describe('store interface', () => {
		it('should expose the correct interface', () => {
			const { result } = renderHook(() => useThemeStore());

			// Check that all expected properties and methods exist
			expect(typeof result.current.darkMode).toBe('boolean');
			expect(typeof result.current.toggleDarkMode).toBe('function');
			expect(typeof result.current.resetTheme).toBe('function');

			// Verify no unexpected properties
			const keys = Object.keys(result.current);
			expect(keys).toHaveLength(3);
			expect(keys).toContain('darkMode');
			expect(keys).toContain('toggleDarkMode');
			expect(keys).toContain('resetTheme');
		});
	});
});
