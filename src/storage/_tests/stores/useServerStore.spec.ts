import { renderHook, act } from '@testing-library/react-hooks';
import { useServerStore } from '../../stores/useServerStore';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useServerStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useServerStore.setState({
				startingServer: false,
			});
		});

		// Setup console.log spy
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		// Restore console.log
		consoleLogSpy.mockRestore();
	});

	afterAll(() => {
		console.log = originalConsoleLog;
	});

	describe('test configuration', () => {
		it('should not log state when TestConfig.stores.server is false', () => {
			// TestConfig.stores.server is false by default
			const { result } = renderHook(() => useServerStore());

			act(() => {
				result.current.toggleStartingServer();
			});

			// Should not have logged anything since TestConfig.stores.server is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.server is true', () => {
			// Mock the TestConfig to enable server store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						server: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useServerStore: freshUseServerStore } = require('../../stores/useServerStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseServerStore.setState({ startingServer: true });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Server State:',
				expect.objectContaining({
					startingServer: true,
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useServerStore());

			expect(result.current.startingServer).toBe(false);
		});

		it('should have correct initial state', () => {
			const { result } = renderHook(() => useServerStore());

			expect(result.current.startingServer).toBe(false);
		});
	});

	describe('server state management', () => {
		it('should toggle startingServer state from false to true', () => {
			const { result } = renderHook(() => useServerStore());

			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(true);
		});

		it('should toggle startingServer state from true to false', () => {
			const { result } = renderHook(() => useServerStore());

			// First set to true
			act(() => {
				result.current.toggleStartingServer();
			});

			// Then toggle back to false
			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(false);
		});

		it('should maintain state between renders', () => {
			const { result, rerender } = renderHook(() => useServerStore());

			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(true);

			// Rerender the hook
			rerender();

			// State should be maintained
			expect(result.current.startingServer).toBe(true);
		});

		it('should handle multiple rapid toggles', () => {
			const { result } = renderHook(() => useServerStore());

			// Perform multiple rapid toggles
			act(() => {
				result.current.toggleStartingServer(); // false -> true
				result.current.toggleStartingServer(); // true -> false
				result.current.toggleStartingServer(); // false -> true
			});

			expect(result.current.startingServer).toBe(true);
		});

		it('should handle toggle when already in desired state', () => {
			const { result } = renderHook(() => useServerStore());

			// Start with false, toggle to true
			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(true);

			// Toggle again while already true
			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(false);
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useServerStore());

			act(() => {
				result.current.toggleStartingServer();
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useServerStore());

			// The state should be persisted
			expect(newResult.current.startingServer).toBe(true);
		});

		it('should persist false state', () => {
			const { result } = renderHook(() => useServerStore());

			// Ensure state is false
			act(() => {
				useServerStore.setState({ startingServer: false });
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useServerStore());

			// The state should be persisted as false
			expect(newResult.current.startingServer).toBe(false);
		});
	});

	describe('reset functionality', () => {
		it('should reset startingServer state to false', () => {
			const { result } = renderHook(() => useServerStore());

			// First set to true
			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(true);

			// Then reset
			act(() => {
				result.current.resetServer();
			});

			expect(result.current.startingServer).toBe(false);
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useServerStore());

			// Verify initial state
			expect(result.current.startingServer).toBe(false);

			// Reset the store
			act(() => {
				result.current.resetServer();
			});

			// Verify state remains at initial values
			expect(result.current.startingServer).toBe(false);
		});

		it('should reset multiple times without issues', () => {
			const { result } = renderHook(() => useServerStore());

			// Set to true
			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(true);

			// Reset multiple times
			act(() => {
				result.current.resetServer();
				result.current.resetServer();
				result.current.resetServer();
			});

			expect(result.current.startingServer).toBe(false);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useServerStore());

			expect(typeof result.current.toggleStartingServer).toBe('function');
			expect(typeof result.current.resetServer).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useServerStore());

			expect(typeof result.current.startingServer).toBe('boolean');
		});

		it('should have correct method signatures', () => {
			const { result } = renderHook(() => useServerStore());

			// Test that methods can be called without parameters
			expect(() => result.current.toggleStartingServer()).not.toThrow();
			expect(() => result.current.resetServer()).not.toThrow();
		});
	});

	describe('edge cases', () => {
		it('should handle rapid state changes', () => {
			const { result } = renderHook(() => useServerStore());

			// Perform rapid state changes
			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.toggleStartingServer();
				}
			});

			// After 10 toggles, should be back to false (even number of toggles)
			expect(result.current.startingServer).toBe(false);
		});

		it('should handle state changes in different render cycles', () => {
			const { result, rerender } = renderHook(() => useServerStore());

			// Change state in first render
			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(true);

			// Rerender and change state again
			rerender();

			act(() => {
				result.current.toggleStartingServer();
			});

			expect(result.current.startingServer).toBe(false);
		});

		it('should handle multiple store instances', () => {
			const { result: result1 } = renderHook(() => useServerStore());
			const { result: result2 } = renderHook(() => useServerStore());

			// Change state in first instance
			act(() => {
				result1.current.toggleStartingServer();
			});

			// Both instances should reflect the same state
			expect(result1.current.startingServer).toBe(true);
			expect(result2.current.startingServer).toBe(true);
		});

		it('should handle reset after multiple state changes', () => {
			const { result } = renderHook(() => useServerStore());

			// Perform multiple state changes
			act(() => {
				result.current.toggleStartingServer(); // false -> true
				result.current.toggleStartingServer(); // true -> false
				result.current.toggleStartingServer(); // false -> true
				result.current.toggleStartingServer(); // true -> false
				result.current.toggleStartingServer(); // false -> true
			});

			expect(result.current.startingServer).toBe(true);

			// Reset should work regardless of current state
			act(() => {
				result.current.resetServer();
			});

			expect(result.current.startingServer).toBe(false);
		});
	});

	describe('integration scenarios', () => {
		it('should handle complete server lifecycle', () => {
			const { result } = renderHook(() => useServerStore());

			// Start server
			act(() => {
				result.current.toggleStartingServer();
			});
			expect(result.current.startingServer).toBe(true);

			// Stop server
			act(() => {
				result.current.toggleStartingServer();
			});
			expect(result.current.startingServer).toBe(false);

			// Reset to ensure clean state
			act(() => {
				result.current.resetServer();
			});
			expect(result.current.startingServer).toBe(false);
		});

		it('should maintain state across component unmounts and remounts', () => {
			const { result, unmount } = renderHook(() => useServerStore());

			// Set state
			act(() => {
				result.current.toggleStartingServer();
			});
			expect(result.current.startingServer).toBe(true);

			// Unmount
			unmount();

			// Remount
			const { result: newResult } = renderHook(() => useServerStore());

			// State should be preserved
			expect(newResult.current.startingServer).toBe(true);
		});
	});
});
