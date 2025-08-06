import { renderHook, act } from '@testing-library/react-hooks';
import { useCameraStore } from '../../stores/useCameraStore';
import { useUploadsStore } from '../../stores/useUploadsStore';
import type { UploadItem } from '../../../interfaces/Upload';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useCameraStore', () => {
	beforeEach(() => {
		const { result } = renderHook(() => useCameraStore());
		act(() => {
			result.current.resetCamera();
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
		it('should not log state when TestConfig.stores.camera is false', () => {
			// TestConfig.stores.camera is false by default
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setIsRecording(true);
			});

			// Should not have logged anything since TestConfig.stores.camera is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.camera is true', () => {
			// Mock the TestConfig to enable camera store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						camera: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useCameraStore: freshUseCameraStore } = require('../../stores/useCameraStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseCameraStore.setState({ isRecording: true });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Camera State:',
				expect.objectContaining({
					isRecording: true,
					mode: 'video',
					flash: 'off',
					frontCamera: true,
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useCameraStore());

			expect(result.current.isRecording).toBe(false);
			expect(result.current.mode).toBe('video');
			expect(result.current.frontCamera).toBe(true);
			expect(result.current.flash).toBe('off');
		});
	});

	describe('toggle functions', () => {
		it('should toggle recording state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setIsRecording(true);
			});
			expect(result.current.isRecording).toBe(true);

			act(() => {
				result.current.setIsRecording(false);
			});
			expect(result.current.isRecording).toBe(false);
		});

		it('should toggle camera mode between video and photo', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.toggleMode();
			});
			expect(result.current.mode).toBe('photo');

			act(() => {
				result.current.toggleMode();
			});
			expect(result.current.mode).toBe('video');
		});

		it('should maintain mode state after multiple toggles', () => {
			const { result } = renderHook(() => useCameraStore());

			// Toggle multiple times
			act(() => {
				result.current.toggleMode();
				result.current.toggleMode();
				result.current.toggleMode();
				result.current.toggleMode();
			});
			expect(result.current.mode).toBe('video');
		});

		it('should toggle flash through all states', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setFlash('auto');
			});
			expect(result.current.flash).toBe('auto');

			act(() => {
				result.current.setFlash('on');
			});
			expect(result.current.flash).toBe('on');

			act(() => {
				result.current.setFlash('off');
			});
			expect(result.current.flash).toBe('off');
		});

		it('should maintain flash state after multiple changes', () => {
			const { result } = renderHook(() => useCameraStore());

			// Set multiple times
			act(() => {
				result.current.setFlash('auto');
				result.current.setFlash('on');
				result.current.setFlash('off');
				result.current.setFlash('auto');
			});
			expect(result.current.flash).toBe('auto');
		});

		it('should handle rapid flash changes correctly', () => {
			const { result } = renderHook(() => useCameraStore());

			// Rapid changes
			act(() => {
				result.current.setFlash('auto');
				result.current.setFlash('on');
			});
			expect(result.current.flash).toBe('on');

			act(() => {
				result.current.setFlash('off');
				result.current.setFlash('auto');
			});
			expect(result.current.flash).toBe('auto');
		});

		it('should toggle flash using toggleFlash function', () => {
			const { result } = renderHook(() => useCameraStore());

			// Start with 'off', should go to 'auto'
			act(() => {
				result.current.toggleFlash();
			});
			expect(result.current.flash).toBe('auto');

			// From 'auto', should go to 'on'
			act(() => {
				result.current.toggleFlash();
			});
			expect(result.current.flash).toBe('on');

			// From 'on', should go back to 'off'
			act(() => {
				result.current.toggleFlash();
			});
			expect(result.current.flash).toBe('off');
		});

		it('should toggle front camera', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.toggleFrontCamera();
			});
			expect(result.current.frontCamera).toBe(false);

			act(() => {
				result.current.toggleFrontCamera();
			});
			expect(result.current.frontCamera).toBe(true);
		});

		it('should toggle viewport (front camera)', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.toggleViewport();
			});
			expect(result.current.frontCamera).toBe(false);

			act(() => {
				result.current.toggleViewport();
			});
			expect(result.current.frontCamera).toBe(true);
		});
	});

	describe('switches functionality', () => {
		it('should toggle startswitch state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setStartswitch(true);
			});
			expect(result.current.startswitch).toBe(true);

			act(() => {
				result.current.setStartswitch(false);
			});
			expect(result.current.startswitch).toBe(false);
		});

		it('should toggle killswitch state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setKillswitch(true);
			});
			expect(result.current.killswitch).toBe(true);

			act(() => {
				result.current.setKillswitch(false);
			});
			expect(result.current.killswitch).toBe(false);
		});

		it('should toggle hideStatusBar state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setHideStatusBar(true);
			});
			expect(result.current.hideStatusBar).toBe(true);

			act(() => {
				result.current.setHideStatusBar(false);
			});
			expect(result.current.hideStatusBar).toBe(false);
		});
	});

	describe('modals functionality', () => {
		it('should toggle showFlashOptions state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setShowFlashOptions(true);
			});
			expect(result.current.showFlashOptions).toBe(true);

			act(() => {
				result.current.setShowFlashOptions(false);
			});
			expect(result.current.showFlashOptions).toBe(false);
		});

		it('should toggle showEventOptions state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setShowEventOptions(true);
			});
			expect(result.current.showEventOptions).toBe(true);

			act(() => {
				result.current.setShowEventOptions(false);
			});
			expect(result.current.showEventOptions).toBe(false);
		});

		it('should toggle showDeviceInfo state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setShowDeviceInfo(true);
			});
			expect(result.current.showDeviceInfo).toBe(true);

			act(() => {
				result.current.setShowDeviceInfo(false);
			});
			expect(result.current.showDeviceInfo).toBe(false);
		});

		it('should toggle showMediaUploads state', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setShowMediaUploads(true);
			});
			expect(result.current.showMediaUploads).toBe(true);

			act(() => {
				result.current.setShowMediaUploads(false);
			});
			expect(result.current.showMediaUploads).toBe(false);
		});
	});

	describe('error handling', () => {
		it('should set and clear error state', () => {
			const { result } = renderHook(() => useCameraStore());
			const testError = new Error('Test error');

			act(() => {
				result.current.setError(testError);
			});
			expect(result.current.error).toBe(testError);

			act(() => {
				result.current.setError(null);
			});
			expect(result.current.error).toBe(null);
		});

		it('should handle undefined error', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setError(undefined);
			});
			expect(result.current.error).toBeUndefined();
		});

		it('should handle string error', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setError('String error message');
			});
			expect(result.current.error).toBe('String error message');
		});

		it('should handle object error', () => {
			const { result } = renderHook(() => useCameraStore());
			const objectError = { code: 'CAMERA_ERROR', message: 'Camera failed' };

			act(() => {
				result.current.setError(objectError);
			});
			expect(result.current.error).toEqual(objectError);
		});
	});

	describe('reset functionality', () => {
		it('should reset all state including switches, modals, and manager states', () => {
			const { result } = renderHook(() => useCameraStore());

			// Set all states to non-default values
			act(() => {
				result.current.setStartswitch(true);
				result.current.setKillswitch(true);
				result.current.setHideStatusBar(true);
				result.current.setShowFlashOptions(true);
				result.current.setShowEventOptions(true);
				result.current.setShowDeviceInfo(true);
				result.current.setShowMediaUploads(true);
				result.current.setError(new Error('Test error'));
			});

			// Reset all states
			act(() => {
				result.current.resetCamera();
			});

			// Verify all states are reset to default values
			expect(result.current.startswitch).toBe(false);
			expect(result.current.killswitch).toBe(false);
			expect(result.current.hideStatusBar).toBe(false);
			expect(result.current.showFlashOptions).toBe(false);
			expect(result.current.showEventOptions).toBe(false);
			expect(result.current.showDeviceInfo).toBe(false);
			expect(result.current.showMediaUploads).toBe(false);
			expect(result.current.error).toBe(null);
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useCameraStore());

			// Verify initial state
			expect(result.current.isRecording).toBe(false);
			expect(result.current.mode).toBe('video');
			expect(result.current.frontCamera).toBe(true);
			expect(result.current.flash).toBe('off');

			// Reset the store
			act(() => {
				result.current.resetCamera();
			});

			// Verify state remains at initial values
			expect(result.current.isRecording).toBe(false);
			expect(result.current.mode).toBe('video');
			expect(result.current.frontCamera).toBe(true);
			expect(result.current.flash).toBe('off');
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useCameraStore());

			act(() => {
				result.current.setIsRecording(true);
				result.current.setFlash('on');
				result.current.setStartswitch(true);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useCameraStore());

			// The state should be persisted
			expect(newResult.current.isRecording).toBe(true);
			expect(newResult.current.flash).toBe('on');
			expect(newResult.current.startswitch).toBe(true);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useCameraStore());

			expect(typeof result.current.toggleMode).toBe('function');
			expect(typeof result.current.setFlash).toBe('function');
			expect(typeof result.current.toggleFlash).toBe('function');
			expect(typeof result.current.toggleFrontCamera).toBe('function');
			expect(typeof result.current.setIsRecording).toBe('function');
			expect(typeof result.current.toggleViewport).toBe('function');
			expect(typeof result.current.setStartswitch).toBe('function');
			expect(typeof result.current.setKillswitch).toBe('function');
			expect(typeof result.current.setHideStatusBar).toBe('function');
			expect(typeof result.current.setShowFlashOptions).toBe('function');
			expect(typeof result.current.setShowEventOptions).toBe('function');
			expect(typeof result.current.setShowDeviceInfo).toBe('function');
			expect(typeof result.current.setShowMediaUploads).toBe('function');
			expect(typeof result.current.setError).toBe('function');
			expect(typeof result.current.resetCamera).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useCameraStore());

			expect(typeof result.current.mode).toBe('string');
			expect(typeof result.current.flash).toBe('string');
			expect(typeof result.current.isRecording).toBe('boolean');
			expect(typeof result.current.frontCamera).toBe('boolean');
			expect(typeof result.current.startswitch).toBe('boolean');
			expect(typeof result.current.killswitch).toBe('boolean');
			expect(typeof result.current.hideStatusBar).toBe('boolean');
			expect(typeof result.current.showFlashOptions).toBe('boolean');
			expect(typeof result.current.showEventOptions).toBe('boolean');
			expect(typeof result.current.showDeviceInfo).toBe('boolean');
			expect(typeof result.current.showMediaUploads).toBe('boolean');
			expect(result.current.error).toBeDefined();
		});
	});

	describe('edge cases', () => {
		it('should handle rapid state changes', () => {
			const { result } = renderHook(() => useCameraStore());

			// Rapid state changes
			act(() => {
				result.current.setIsRecording(true);
				result.current.setIsRecording(false);
				result.current.setIsRecording(true);
				result.current.toggleMode();
				result.current.toggleMode();
				result.current.toggleFrontCamera();
				result.current.toggleFrontCamera();
			});

			// Should end up in the expected final state
			expect(result.current.isRecording).toBe(true);
			expect(result.current.mode).toBe('video');
			expect(result.current.frontCamera).toBe(true);
		});

		it('should handle multiple flash toggle cycles', () => {
			const { result } = renderHook(() => useCameraStore());

			// Multiple flash toggle cycles
			for (let i = 0; i < 10; i++) {
				act(() => {
					result.current.toggleFlash();
				});
			}

			// After 10 toggles, should be back to 'off' (10 % 3 = 1, so 'auto')
			expect(result.current.flash).toBe('auto');
		});
	});
});

describe('useUploadsStore', () => {
	beforeEach(() => {
		const { result } = renderHook(() => useUploadsStore());
		act(() => {
			result.current.resetUploads();
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
		it('should not log state when TestConfig.stores.uploads is false', () => {
			// TestConfig.stores.uploads is false by default
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue([{ id: '1' } as UploadItem]);
			});

			// Should not have logged anything since TestConfig.stores.uploads is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.uploads is true', () => {
			// Mock the TestConfig to enable uploads store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						uploads: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useUploadsStore: freshUseUploadsStore } = require('../../stores/useUploadsStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseUploadsStore.setState({ uploadQueue: [{ id: '1' } as UploadItem] });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					uploadQueue: [{ id: '1' }],
					uploadProgressArray: [],
					uploadError: null,
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useUploadsStore());

			expect(result.current.uploadProgressArray).toEqual([]);
			expect(result.current.uploadQueue).toEqual([]);
			expect(result.current.uploadError).toBe(null);
			expect(result.current.packageUploadProgressArray).toEqual([]);
			expect(result.current.packageUploadQueue).toEqual([]);
			expect(result.current.packageUploadError).toBe(null);
		});
	});

	describe('upload queue management', () => {
		const mockUploadItem: UploadItem = {
			id: '1',
			eventId: 'event1',
			userId: 'user1',
			payload: {
				uri: 'test-uri',
				name: 'test.mp4',
				type: 'video/mp4',
				orientation: 'portrait',
				height: 1920,
				width: 1080,
				deviceName: 'test-device',
			},
			status: 0,
		};

		it('should add file to upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue([mockUploadItem]);
			});

			expect(result.current.uploadQueue).toHaveLength(1);
			expect(result.current.uploadQueue[0]).toEqual(mockUploadItem);
		});

		it('should clear upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue([mockUploadItem, mockUploadItem]);
			});

			expect(result.current.uploadQueue).toHaveLength(2);

			act(() => {
				result.current.clearUploadQueue();
			});

			expect(result.current.uploadQueue).toHaveLength(0);
		});

		it('should set upload progress array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([mockUploadItem]);
			});

			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadProgressArray[0]).toEqual(mockUploadItem);
		});

		it('should set upload error', () => {
			const { result } = renderHook(() => useUploadsStore());
			const testError = new Error('Upload failed');

			act(() => {
				result.current.setUploadError(testError);
			});

			expect(result.current.uploadError).toBe(testError);
		});

		it('should handle empty upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue([]);
			});

			expect(result.current.uploadQueue).toEqual([]);
		});

		it('should handle single upload item', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue([mockUploadItem]);
			});

			expect(result.current.uploadQueue).toEqual([mockUploadItem]);
		});

		it('should replace existing upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());
			const secondUploadItem: UploadItem = {
				...mockUploadItem,
				id: '2',
				eventId: 'event2',
			};

			// Set initial queue
			act(() => {
				result.current.setUploadQueue([mockUploadItem]);
			});

			expect(result.current.uploadQueue).toEqual([mockUploadItem]);

			// Replace with new queue
			act(() => {
				result.current.setUploadQueue([secondUploadItem]);
			});

			expect(result.current.uploadQueue).toEqual([secondUploadItem]);
		});
	});

	describe('package upload queue management', () => {
		const mockPackageUploadItem: UploadItem = {
			id: '2',
			eventId: 'event2',
			userId: 'user2',
			payload: {
				uri: 'package-test-uri',
				name: 'package-test.mp4',
				type: 'video/mp4',
				orientation: 'landscape',
				height: 1080,
				width: 1920,
				deviceName: 'package-test-device',
			},
			status: 0,
		};

		it('should add file to package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue([mockPackageUploadItem]);
			});

			expect(result.current.packageUploadQueue).toHaveLength(1);
			expect(result.current.packageUploadQueue[0]).toEqual(mockPackageUploadItem);
		});

		it('should clear package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue([mockPackageUploadItem, mockPackageUploadItem]);
			});

			expect(result.current.packageUploadQueue).toHaveLength(2);

			act(() => {
				result.current.clearPackageUploadQueue();
			});

			expect(result.current.packageUploadQueue).toHaveLength(0);
		});

		it('should set package upload progress array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadProgressArray([mockPackageUploadItem]);
			});

			expect(result.current.packageUploadProgressArray).toHaveLength(1);
			expect(result.current.packageUploadProgressArray[0]).toEqual(mockPackageUploadItem);
		});

		it('should set package upload error', () => {
			const { result } = renderHook(() => useUploadsStore());
			const testError = new Error('Package upload failed');

			act(() => {
				result.current.setPackageUploadError(testError);
			});

			expect(result.current.packageUploadError).toBe(testError);
		});

		it('should handle empty package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue([]);
			});

			expect(result.current.packageUploadQueue).toEqual([]);
		});

		it('should handle single package upload item', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue([mockPackageUploadItem]);
			});

			expect(result.current.packageUploadQueue).toEqual([mockPackageUploadItem]);
		});

		it('should replace existing package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());
			const secondPackageUploadItem: UploadItem = {
				...mockPackageUploadItem,
				id: '3',
				eventId: 'event3',
			};

			// Set initial queue
			act(() => {
				result.current.setPackageUploadQueue([mockPackageUploadItem]);
			});

			expect(result.current.packageUploadQueue).toEqual([mockPackageUploadItem]);

			// Replace with new queue
			act(() => {
				result.current.setPackageUploadQueue([secondPackageUploadItem]);
			});

			expect(result.current.packageUploadQueue).toEqual([secondPackageUploadItem]);
		});
	});

	describe('error handling', () => {
		it('should handle undefined upload error', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError(undefined);
			});

			expect(result.current.uploadError).toBeUndefined();
		});

		it('should handle string upload error', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError('String error message');
			});

			expect(result.current.uploadError).toBe('String error message');
		});

		it('should handle object upload error', () => {
			const { result } = renderHook(() => useUploadsStore());
			const objectError = { code: 'UPLOAD_ERROR', message: 'Upload failed' };

			act(() => {
				result.current.setUploadError(objectError);
			});

			expect(result.current.uploadError).toEqual(objectError);
		});

		it('should handle undefined package upload error', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError(undefined);
			});

			expect(result.current.packageUploadError).toBeUndefined();
		});

		it('should handle string package upload error', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError('Package string error message');
			});

			expect(result.current.packageUploadError).toBe('Package string error message');
		});

		it('should handle object package upload error', () => {
			const { result } = renderHook(() => useUploadsStore());
			const objectError = { code: 'PACKAGE_UPLOAD_ERROR', message: 'Package upload failed' };

			act(() => {
				result.current.setPackageUploadError(objectError);
			});

			expect(result.current.packageUploadError).toEqual(objectError);
		});
	});

	describe('reset functionality', () => {
		it('should reset all upload states to default values', () => {
			const { result } = renderHook(() => useUploadsStore());
			const mockUploadItem: UploadItem = {
				id: '1',
				eventId: 'event1',
				userId: 'user1',
				payload: {
					uri: 'test-uri',
					name: 'test.mp4',
					type: 'video/mp4',
					orientation: 'portrait',
					height: 1920,
					width: 1080,
					deviceName: 'test-device',
				},
				status: 0,
			};

			// Set all states to non-default values
			act(() => {
				result.current.setUploadQueue([mockUploadItem]);
				result.current.setUploadProgressArray([mockUploadItem]);
				result.current.setUploadError(new Error('Upload error'));
				result.current.setPackageUploadQueue([mockUploadItem]);
				result.current.setPackageUploadProgressArray([mockUploadItem]);
				result.current.setPackageUploadError(new Error('Package upload error'));
			});

			// Reset all states
			act(() => {
				result.current.resetUploads();
			});

			// Verify all states are reset to default values
			expect(result.current.uploadQueue).toEqual([]);
			expect(result.current.uploadProgressArray).toEqual([]);
			expect(result.current.uploadError).toBe(null);
			expect(result.current.packageUploadQueue).toEqual([]);
			expect(result.current.packageUploadProgressArray).toEqual([]);
			expect(result.current.packageUploadError).toBe(null);
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useUploadsStore());

			// Verify initial state
			expect(result.current.uploadQueue).toEqual([]);
			expect(result.current.uploadProgressArray).toEqual([]);
			expect(result.current.uploadError).toBe(null);
			expect(result.current.packageUploadQueue).toEqual([]);
			expect(result.current.packageUploadProgressArray).toEqual([]);
			expect(result.current.packageUploadError).toBe(null);

			// Reset the store
			act(() => {
				result.current.resetUploads();
			});

			// Verify state remains at initial values
			expect(result.current.uploadQueue).toEqual([]);
			expect(result.current.uploadProgressArray).toEqual([]);
			expect(result.current.uploadError).toBe(null);
			expect(result.current.packageUploadQueue).toEqual([]);
			expect(result.current.packageUploadProgressArray).toEqual([]);
			expect(result.current.packageUploadError).toBe(null);
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useUploadsStore());
			const mockUploadItem: UploadItem = {
				id: '1',
				eventId: 'event1',
				userId: 'user1',
				payload: {
					uri: 'test-uri',
					name: 'test.mp4',
					type: 'video/mp4',
					orientation: 'portrait',
					height: 1920,
					width: 1080,
					deviceName: 'test-device',
				},
				status: 0,
			};

			act(() => {
				result.current.setUploadQueue([mockUploadItem]);
				result.current.setUploadError(new Error('Test error'));
				result.current.setPackageUploadQueue([mockUploadItem]);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useUploadsStore());

			// The state should be persisted
			expect(newResult.current.uploadQueue).toEqual([mockUploadItem]);
			expect(newResult.current.uploadError).toEqual(new Error('Test error'));
			expect(newResult.current.packageUploadQueue).toEqual([mockUploadItem]);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useUploadsStore());

			expect(typeof result.current.setUploadProgressArray).toBe('function');
			expect(typeof result.current.setUploadQueue).toBe('function');
			expect(typeof result.current.clearUploadQueue).toBe('function');
			expect(typeof result.current.setUploadError).toBe('function');
			expect(typeof result.current.setPackageUploadProgressArray).toBe('function');
			expect(typeof result.current.setPackageUploadQueue).toBe('function');
			expect(typeof result.current.clearPackageUploadQueue).toBe('function');
			expect(typeof result.current.setPackageUploadError).toBe('function');
			expect(typeof result.current.resetUploads).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useUploadsStore());

			expect(Array.isArray(result.current.uploadProgressArray)).toBe(true);
			expect(Array.isArray(result.current.uploadQueue)).toBe(true);
			expect(result.current.uploadError).toBeDefined();
			expect(Array.isArray(result.current.packageUploadProgressArray)).toBe(true);
			expect(Array.isArray(result.current.packageUploadQueue)).toBe(true);
			expect(result.current.packageUploadError).toBeDefined();
		});
	});

	describe('edge cases', () => {
		it('should handle null upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue(null as any);
			});

			expect(result.current.uploadQueue).toBeNull();
		});

		it('should handle undefined upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue(undefined as any);
			});

			expect(result.current.uploadQueue).toBeUndefined();
		});

		it('should handle null package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue(null as any);
			});

			expect(result.current.packageUploadQueue).toBeNull();
		});

		it('should handle undefined package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue(undefined as any);
			});

			expect(result.current.packageUploadQueue).toBeUndefined();
		});

		it('should handle large arrays of upload items', () => {
			const { result } = renderHook(() => useUploadsStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				id: `upload-${index}`,
				eventId: `event-${index}`,
				userId: `user-${index}`,
				payload: {
					uri: `uri-${index}`,
					name: `file-${index}.mp4`,
					type: 'video/mp4',
					orientation: 'portrait',
					height: 1920,
					width: 1080,
					deviceName: `device-${index}`,
				},
				status: 0,
			}));

			act(() => {
				result.current.setUploadQueue(largeArray);
			});

			expect(result.current.uploadQueue).toEqual(largeArray);
			expect(result.current.uploadQueue).toHaveLength(1000);
		});

		it('should handle large arrays of package upload items', () => {
			const { result } = renderHook(() => useUploadsStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				id: `package-upload-${index}`,
				eventId: `event-${index}`,
				userId: `user-${index}`,
				payload: {
					uri: `package-uri-${index}`,
					name: `package-file-${index}.mp4`,
					type: 'video/mp4',
					orientation: 'landscape',
					height: 1080,
					width: 1920,
					deviceName: `package-device-${index}`,
				},
				status: 0,
			}));

			act(() => {
				result.current.setPackageUploadQueue(largeArray);
			});

			expect(result.current.packageUploadQueue).toEqual(largeArray);
			expect(result.current.packageUploadQueue).toHaveLength(1000);
		});
	});
});
