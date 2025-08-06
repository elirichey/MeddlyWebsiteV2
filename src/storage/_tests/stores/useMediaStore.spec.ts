import { renderHook, act } from '@testing-library/react-hooks';
import { useMediaStore } from '../../stores/useMediaStore';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useMediaStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useMediaStore.setState({
				showDownloadScreen: false,
				file: null,
				jobId: null,
				downloadProgress: 0,
				error: null,
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
		it('should not log state when TestConfig.stores.media is false', () => {
			// TestConfig.stores.media is false by default
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setFile('test.mp4');
			});

			// Should not have logged anything since TestConfig.stores.media is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.media is true', () => {
			// Mock the TestConfig to enable media store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						media: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useMediaStore: freshUseMediaStore } = require('../../stores/useMediaStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseMediaStore.setState({ file: 'test.mp4' });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Media State:',
				expect.objectContaining({
					file: 'test.mp4',
					jobId: null,
					downloadProgress: 0,
					error: null,
					showDownloadScreen: false,
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with correct default values', () => {
			const { result } = renderHook(() => useMediaStore());

			expect(result.current.showDownloadScreen).toBe(false);
			expect(result.current.file).toBeNull();
			expect(result.current.jobId).toBeNull();
			expect(result.current.downloadProgress).toBe(0);
			expect(result.current.error).toBeNull();
		});
	});

	describe('download screen management', () => {
		it('should toggle download screen visibility', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setShowDownloadScreen(true);
			});
			expect(result.current.showDownloadScreen).toBe(true);

			act(() => {
				result.current.setShowDownloadScreen(false);
			});
			expect(result.current.showDownloadScreen).toBe(false);
		});

		it('should handle multiple rapid toggles', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setShowDownloadScreen(true);
				result.current.setShowDownloadScreen(false);
				result.current.setShowDownloadScreen(true);
			});
			expect(result.current.showDownloadScreen).toBe(true);
		});
	});

	describe('media file management', () => {
		it('should set and update file path', () => {
			const { result } = renderHook(() => useMediaStore());
			const testFile = 'test/path/file.mp4';

			act(() => {
				result.current.setFile(testFile);
			});
			expect(result.current.file).toBe(testFile);

			const newFile = 'new/path/file.mp4';
			act(() => {
				result.current.setFile(newFile);
			});
			expect(result.current.file).toBe(newFile);
		});

		it('should handle empty string file path', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setFile('');
			});
			expect(result.current.file).toBe('');
		});

		it('should handle special characters in file path', () => {
			const { result } = renderHook(() => useMediaStore());
			const specialFile = 'test/path/with spaces & symbols!@#.mp4';

			act(() => {
				result.current.setFile(specialFile);
			});
			expect(result.current.file).toBe(specialFile);
		});

		it('should set and update job ID', () => {
			const { result } = renderHook(() => useMediaStore());
			const testJobId = 123;

			act(() => {
				result.current.setJobId(testJobId);
			});
			expect(result.current.jobId).toBe(testJobId);

			const newJobId = 456;
			act(() => {
				result.current.setJobId(newJobId);
			});
			expect(result.current.jobId).toBe(newJobId);
		});

		it('should handle zero job ID', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setJobId(0);
			});
			expect(result.current.jobId).toBe(0);
		});

		it('should handle large job ID', () => {
			const { result } = renderHook(() => useMediaStore());
			const largeJobId = Number.MAX_SAFE_INTEGER;

			act(() => {
				result.current.setJobId(largeJobId);
			});
			expect(result.current.jobId).toBe(largeJobId);
		});

		it('should set and update download progress', () => {
			const { result } = renderHook(() => useMediaStore());
			const testProgress = 50;

			act(() => {
				result.current.setDownloadProgress(testProgress);
			});
			expect(result.current.downloadProgress).toBe(testProgress);

			const newProgress = 75;
			act(() => {
				result.current.setDownloadProgress(newProgress);
			});
			expect(result.current.downloadProgress).toBe(newProgress);
		});

		it('should handle zero download progress', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setDownloadProgress(0);
			});
			expect(result.current.downloadProgress).toBe(0);
		});

		it('should handle 100% download progress', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setDownloadProgress(100);
			});
			expect(result.current.downloadProgress).toBe(100);
		});

		it('should handle negative download progress', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setDownloadProgress(-10);
			});
			expect(result.current.downloadProgress).toBe(-10);
		});

		it('should handle decimal download progress', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setDownloadProgress(50.5);
			});
			expect(result.current.downloadProgress).toBe(50.5);
		});
	});

	describe('error handling', () => {
		it('should set and update error message', () => {
			const { result } = renderHook(() => useMediaStore());
			const testError = 'Test error message';

			act(() => {
				result.current.setError(testError);
			});
			expect(result.current.error).toBe(testError);

			const newError = 'New error message';
			act(() => {
				result.current.setError(newError);
			});
			expect(result.current.error).toBe(newError);
		});

		it('should clear error when set to empty string', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setError('Test error');
			});
			expect(result.current.error).toBe('Test error');

			act(() => {
				result.current.setError('');
			});
			expect(result.current.error).toBe('');
		});

		it('should handle long error messages', () => {
			const { result } = renderHook(() => useMediaStore());
			const longError = 'A'.repeat(1000);

			act(() => {
				result.current.setError(longError);
			});
			expect(result.current.error).toBe(longError);
		});

		it('should handle special characters in error messages', () => {
			const { result } = renderHook(() => useMediaStore());
			const specialError = 'Error with symbols: !@#$%^&*()_+-=[]{}|;:,.<>?';

			act(() => {
				result.current.setError(specialError);
			});
			expect(result.current.error).toBe(specialError);
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setFile('test.mp4');
				result.current.setJobId(123);
				result.current.setDownloadProgress(75);
				result.current.setError('Test error');
				result.current.setShowDownloadScreen(true);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useMediaStore());

			// The state should be persisted
			expect(newResult.current.file).toBe('test.mp4');
			expect(newResult.current.jobId).toBe(123);
			expect(newResult.current.downloadProgress).toBe(75);
			expect(newResult.current.error).toBe('Test error');
			expect(newResult.current.showDownloadScreen).toBe(true);
		});
	});

	describe('reset functionality', () => {
		it('should reset all media-related state to initial values', () => {
			const { result } = renderHook(() => useMediaStore());

			// Set all values to non-initial states
			act(() => {
				result.current.setFile('test.mp4');
				result.current.setJobId(123);
				result.current.setDownloadProgress(75);
				result.current.setError('Test error');
				result.current.setShowDownloadScreen(true);
			});

			// Verify values were set
			expect(result.current.file).toBe('test.mp4');
			expect(result.current.jobId).toBe(123);
			expect(result.current.downloadProgress).toBe(75);
			expect(result.current.error).toBe('Test error');
			expect(result.current.showDownloadScreen).toBe(true);

			// Reset the state
			act(() => {
				result.current.resetMedia();
			});

			// Verify all values were reset to initial state
			expect(result.current.file).toBeNull();
			expect(result.current.jobId).toBeNull();
			expect(result.current.downloadProgress).toBe(0);
			expect(result.current.error).toBeNull();
			// Note: resetMedia doesn't reset showDownloadScreen
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useMediaStore());

			// Verify initial state
			expect(result.current.file).toBeNull();
			expect(result.current.jobId).toBeNull();
			expect(result.current.downloadProgress).toBe(0);
			expect(result.current.error).toBeNull();

			// Reset the store
			act(() => {
				result.current.resetMedia();
			});

			// Verify state remains at initial values
			expect(result.current.file).toBeNull();
			expect(result.current.jobId).toBeNull();
			expect(result.current.downloadProgress).toBe(0);
			expect(result.current.error).toBeNull();
		});

		it('should not reset showDownloadScreen when resetting media', () => {
			const { result } = renderHook(() => useMediaStore());

			// Set showDownloadScreen to true
			act(() => {
				result.current.setShowDownloadScreen(true);
			});
			expect(result.current.showDownloadScreen).toBe(true);

			// Reset media state
			act(() => {
				result.current.resetMedia();
			});

			// showDownloadScreen should remain true
			expect(result.current.showDownloadScreen).toBe(true);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useMediaStore());

			expect(typeof result.current.setShowDownloadScreen).toBe('function');
			expect(typeof result.current.setFile).toBe('function');
			expect(typeof result.current.setJobId).toBe('function');
			expect(typeof result.current.setDownloadProgress).toBe('function');
			expect(typeof result.current.setError).toBe('function');
			expect(typeof result.current.resetMedia).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useMediaStore());

			expect(typeof result.current.showDownloadScreen).toBe('boolean');
			expect(typeof result.current.downloadProgress).toBe('number');
			// file, jobId, and error can be null or their respective types
			expect(result.current.file === null || typeof result.current.file === 'string').toBe(true);
			expect(result.current.jobId === null || typeof result.current.jobId === 'number').toBe(true);
			expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should handle null file path', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setFile(null as any);
			});

			expect(result.current.file).toBeNull();
		});

		it('should handle undefined file path', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setFile(undefined as any);
			});

			expect(result.current.file).toBeUndefined();
		});

		it('should handle null job ID', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setJobId(null as any);
			});

			expect(result.current.jobId).toBeNull();
		});

		it('should handle undefined job ID', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setJobId(undefined as any);
			});

			expect(result.current.jobId).toBeUndefined();
		});

		it('should handle null error', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setError(null as any);
			});

			expect(result.current.error).toBeNull();
		});

		it('should handle undefined error', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setError(undefined as any);
			});

			expect(result.current.error).toBeUndefined();
		});

		it('should handle very large numbers for job ID', () => {
			const { result } = renderHook(() => useMediaStore());
			const veryLargeJobId = 999999999999;

			act(() => {
				result.current.setJobId(veryLargeJobId);
			});

			expect(result.current.jobId).toBe(veryLargeJobId);
		});

		it('should handle very large numbers for download progress', () => {
			const { result } = renderHook(() => useMediaStore());
			const veryLargeProgress = 999999;

			act(() => {
				result.current.setDownloadProgress(veryLargeProgress);
			});

			expect(result.current.downloadProgress).toBe(veryLargeProgress);
		});

		it('should handle multiple rapid state changes', () => {
			const { result } = renderHook(() => useMediaStore());

			act(() => {
				result.current.setFile('file1.mp4');
				result.current.setJobId(1);
				result.current.setDownloadProgress(10);
				result.current.setError('error1');
				result.current.setFile('file2.mp4');
				result.current.setJobId(2);
				result.current.setDownloadProgress(20);
				result.current.setError('error2');
			});

			expect(result.current.file).toBe('file2.mp4');
			expect(result.current.jobId).toBe(2);
			expect(result.current.downloadProgress).toBe(20);
			expect(result.current.error).toBe('error2');
		});
	});
});
