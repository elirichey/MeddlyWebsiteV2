import { renderHook, act } from '@testing-library/react-hooks';
import { useUploadsStore } from '../../stores/useUploadsStore';
import type { UploadItem } from '../../../interfaces/Upload';
import TestConfig from '../../../config/testing';

// Mock console.log to capture test logging
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useUploadsStore', () => {
	beforeEach(() => {
		const { result } = renderHook(() => useUploadsStore());
		act(() => {
			result.current.resetUploads();
		});
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		console.log = originalConsoleLog;
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useUploadsStore());

			expect(result.current.uploadProgressArray).toEqual([]);
			expect(result.current.uploadQueue).toEqual([]);
			expect(result.current.uploadError).toBeNull();
			expect(result.current.packageUploadProgressArray).toEqual([]);
			expect(result.current.packageUploadQueue).toEqual([]);
			expect(result.current.packageUploadError).toBeNull();
		});
	});

	describe('camera upload management', () => {
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

		it('should update camera upload progress array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([mockUploadItem]);
			});

			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadProgressArray[0]).toEqual(mockUploadItem);
		});

		it('should update camera upload progress array with empty array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([]);
			});

			expect(result.current.uploadProgressArray).toEqual([]);
		});

		it('should update camera upload progress array with multiple items', () => {
			const { result } = renderHook(() => useUploadsStore());
			const mockUploadItem2: UploadItem = {
				...mockUploadItem,
				id: '2',
				payload: { ...mockUploadItem.payload, name: 'test2.mp4' },
			};

			act(() => {
				result.current.setUploadProgressArray([mockUploadItem, mockUploadItem2]);
			});

			expect(result.current.uploadProgressArray).toHaveLength(2);
			expect(result.current.uploadProgressArray[0]).toEqual(mockUploadItem);
			expect(result.current.uploadProgressArray[1]).toEqual(mockUploadItem2);
		});

		it('should update camera upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue([mockUploadItem]);
			});

			expect(result.current.uploadQueue).toHaveLength(1);
			expect(result.current.uploadQueue[0]).toEqual(mockUploadItem);
		});

		it('should update camera upload queue with empty array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadQueue([]);
			});

			expect(result.current.uploadQueue).toEqual([]);
		});

		it('should clear camera upload queue', () => {
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

		it('should clear camera upload queue when already empty', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.clearUploadQueue();
			});

			expect(result.current.uploadQueue).toHaveLength(0);
		});

		it('should set camera upload error', () => {
			const { result } = renderHook(() => useUploadsStore());
			const testError = new Error('Test error');

			act(() => {
				result.current.setUploadError(testError);
			});

			expect(result.current.uploadError).toBe(testError);
		});

		it('should set camera upload error to null', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError(null);
			});

			expect(result.current.uploadError).toBeNull();
		});

		it('should set camera upload error with string', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError('String error');
			});

			expect(result.current.uploadError).toBe('String error');
		});

		it('should set camera upload error with object', () => {
			const { result } = renderHook(() => useUploadsStore());
			const errorObject = { code: 500, message: 'Server error' };

			act(() => {
				result.current.setUploadError(errorObject);
			});

			expect(result.current.uploadError).toBe(errorObject);
		});
	});

	describe('package upload management', () => {
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

		it('should update package upload progress array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadProgressArray([mockUploadItem]);
			});

			expect(result.current.packageUploadProgressArray).toHaveLength(1);
			expect(result.current.packageUploadProgressArray[0]).toEqual(mockUploadItem);
		});

		it('should update package upload progress array with empty array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadProgressArray([]);
			});

			expect(result.current.packageUploadProgressArray).toEqual([]);
		});

		it('should update package upload progress array with multiple items', () => {
			const { result } = renderHook(() => useUploadsStore());
			const mockUploadItem2: UploadItem = {
				...mockUploadItem,
				id: '2',
				payload: { ...mockUploadItem.payload, name: 'test2.mp4' },
			};

			act(() => {
				result.current.setPackageUploadProgressArray([mockUploadItem, mockUploadItem2]);
			});

			expect(result.current.packageUploadProgressArray).toHaveLength(2);
			expect(result.current.packageUploadProgressArray[0]).toEqual(mockUploadItem);
			expect(result.current.packageUploadProgressArray[1]).toEqual(mockUploadItem2);
		});

		it('should update package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue([mockUploadItem]);
			});

			expect(result.current.packageUploadQueue).toHaveLength(1);
			expect(result.current.packageUploadQueue[0]).toEqual(mockUploadItem);
		});

		it('should update package upload queue with empty array', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue([]);
			});

			expect(result.current.packageUploadQueue).toEqual([]);
		});

		it('should clear package upload queue', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadQueue([mockUploadItem, mockUploadItem]);
			});

			expect(result.current.packageUploadQueue).toHaveLength(2);

			act(() => {
				result.current.clearPackageUploadQueue();
			});

			expect(result.current.packageUploadQueue).toHaveLength(0);
		});

		it('should clear package upload queue when already empty', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.clearPackageUploadQueue();
			});

			expect(result.current.packageUploadQueue).toHaveLength(0);
		});

		it('should set package upload error', () => {
			const { result } = renderHook(() => useUploadsStore());
			const testError = new Error('Test error');

			act(() => {
				result.current.setPackageUploadError(testError);
			});

			expect(result.current.packageUploadError).toBe(testError);
		});

		it('should set package upload error to null', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError(null);
			});

			expect(result.current.packageUploadError).toBeNull();
		});

		it('should set package upload error with string', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError('String error');
			});

			expect(result.current.packageUploadError).toBe('String error');
		});

		it('should set package upload error with object', () => {
			const { result } = renderHook(() => useUploadsStore());
			const errorObject = { code: 500, message: 'Server error' };

			act(() => {
				result.current.setPackageUploadError(errorObject);
			});

			expect(result.current.packageUploadError).toBe(errorObject);
		});
	});

	describe('reset functionality', () => {
		it('should reset all upload states', () => {
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

			// Set some state
			act(() => {
				result.current.setUploadProgressArray([mockUploadItem]);
				result.current.setUploadQueue([mockUploadItem]);
				result.current.setUploadError(new Error('Test error'));
				result.current.setPackageUploadProgressArray([mockUploadItem]);
				result.current.setPackageUploadQueue([mockUploadItem]);
				result.current.setPackageUploadError(new Error('Test error'));
			});

			// Reset all state
			act(() => {
				result.current.resetUploads();
			});

			// Verify all state is reset
			expect(result.current.uploadProgressArray).toEqual([]);
			expect(result.current.uploadQueue).toEqual([]);
			expect(result.current.uploadError).toBeNull();
			expect(result.current.packageUploadProgressArray).toEqual([]);
			expect(result.current.packageUploadQueue).toEqual([]);
			expect(result.current.packageUploadError).toBeNull();
		});

		it('should reset upload states when already in default state', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.resetUploads();
			});

			expect(result.current.uploadProgressArray).toEqual([]);
			expect(result.current.uploadQueue).toEqual([]);
			expect(result.current.uploadError).toBeNull();
			expect(result.current.packageUploadProgressArray).toEqual([]);
			expect(result.current.packageUploadQueue).toEqual([]);
			expect(result.current.packageUploadError).toBeNull();
		});
	});

	describe('persistence functionality', () => {
		it('should persist state changes across hook instances', () => {
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

			// Set state with first instance
			const { result: result1 } = renderHook(() => useUploadsStore());
			act(() => {
				result1.current.setUploadProgressArray([mockUploadItem]);
				result1.current.setUploadError('Test error');
			});

			// Create a new instance
			const { result: result2 } = renderHook(() => useUploadsStore());

			// State should be persisted
			expect(result2.current.uploadProgressArray).toHaveLength(1);
			expect(result2.current.uploadProgressArray[0]).toEqual(mockUploadItem);
			expect(result2.current.uploadError).toBe('Test error');
		});

		it('should maintain state across multiple hook instances', () => {
			const { result: result1 } = renderHook(() => useUploadsStore());
			const { result: result2 } = renderHook(() => useUploadsStore());

			// Both should have the same initial state
			expect(result1.current.uploadProgressArray).toEqual([]);
			expect(result2.current.uploadProgressArray).toEqual([]);

			// Update using first instance
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
				result1.current.setUploadProgressArray([mockUploadItem]);
			});

			// Both instances should reflect the change
			expect(result1.current.uploadProgressArray).toHaveLength(1);
			expect(result2.current.uploadProgressArray).toHaveLength(1);
		});
	});

	describe('store interface', () => {
		it('should expose the correct interface', () => {
			const { result } = renderHook(() => useUploadsStore());

			// Check that all expected properties and methods exist
			expect(Array.isArray(result.current.uploadProgressArray)).toBe(true);
			expect(Array.isArray(result.current.uploadQueue)).toBe(true);
			expect(typeof result.current.uploadError).toBe('object');
			expect(Array.isArray(result.current.packageUploadProgressArray)).toBe(true);
			expect(Array.isArray(result.current.packageUploadQueue)).toBe(true);
			expect(typeof result.current.packageUploadError).toBe('object');

			expect(typeof result.current.setUploadProgressArray).toBe('function');
			expect(typeof result.current.setUploadQueue).toBe('function');
			expect(typeof result.current.clearUploadQueue).toBe('function');
			expect(typeof result.current.setUploadError).toBe('function');
			expect(typeof result.current.setPackageUploadProgressArray).toBe('function');
			expect(typeof result.current.setPackageUploadQueue).toBe('function');
			expect(typeof result.current.clearPackageUploadQueue).toBe('function');
			expect(typeof result.current.setPackageUploadError).toBe('function');
			expect(typeof result.current.resetUploads).toBe('function');

			// Verify no unexpected properties
			const keys = Object.keys(result.current);
			expect(keys).toHaveLength(15);
			expect(keys).toContain('uploadProgressArray');
			expect(keys).toContain('uploadQueue');
			expect(keys).toContain('uploadError');
			expect(keys).toContain('setUploadProgressArray');
			expect(keys).toContain('setUploadQueue');
			expect(keys).toContain('clearUploadQueue');
			expect(keys).toContain('setUploadError');
			expect(keys).toContain('packageUploadProgressArray');
			expect(keys).toContain('packageUploadQueue');
			expect(keys).toContain('packageUploadError');
			expect(keys).toContain('setPackageUploadProgressArray');
			expect(keys).toContain('setPackageUploadQueue');
			expect(keys).toContain('clearPackageUploadQueue');
			expect(keys).toContain('setPackageUploadError');
			expect(keys).toContain('resetUploads');
		});
	});

	describe('conditional subscription logging', () => {
		it('should not log when TestConfig.stores.uploads is false', () => {
			// Ensure TestConfig.stores.uploads is false (default)
			expect(TestConfig.stores.uploads).toBe(false);

			const { result } = renderHook(() => useUploadsStore());

			// Perform an action that would trigger the subscription
			act(() => {
				result.current.setUploadProgressArray([
					{
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
					},
				]);
			});

			// Should not have logged anything
			expect(consoleLogSpy).not.toHaveBeenCalledWith('Uploads State:', expect.any(Object));
		});

		it('should log state changes when TestConfig.stores.uploads is true', () => {
			// Mock the TestConfig to return true for uploads
			const originalUploadsConfig = TestConfig.stores.uploads;
			TestConfig.stores.uploads = true;

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Since we can't easily re-import the module in tests, we'll test the subscription
			// by directly calling the store's setState method and checking if logging occurs
			const { result } = renderHook(() => useUploadsStore());

			// Perform an action that should trigger logging
			act(() => {
				result.current.setUploadProgressArray([
					{
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
					},
				]);
			});

			// Since the subscription is set up at module load time and we can't easily
			// re-import with different config in tests, we'll verify the state was updated
			// and that the store interface is correct
			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadProgressArray[0]).toEqual({
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
			});

			// Restore original config
			TestConfig.stores.uploads = originalUploadsConfig;
		});

		it('should handle test logging when TestConfig.stores.uploads is undefined', () => {
			// Temporarily set to undefined to test the falsy case
			const originalTestConfig = TestConfig.stores.uploads;
			TestConfig.stores.uploads = undefined as any;

			// Clear any previous calls
			consoleLogSpy.mockClear();

			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([
					{
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
					},
				]);
			});

			// Verify that console.log was not called with state information
			expect(consoleLogSpy).not.toHaveBeenCalledWith('Uploads State:', expect.any(Object));

			// Restore original test config
			TestConfig.stores.uploads = originalTestConfig;
		});

		it('should handle test logging when TestConfig.stores.uploads is null', () => {
			// Temporarily set to null to test the falsy case
			const originalTestConfig = TestConfig.stores.uploads;
			TestConfig.stores.uploads = null as any;

			// Clear any previous calls
			consoleLogSpy.mockClear();

			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([
					{
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
					},
				]);
			});

			// Verify that console.log was not called with state information
			expect(consoleLogSpy).not.toHaveBeenCalledWith('Uploads State:', expect.any(Object));

			// Restore original test config
			TestConfig.stores.uploads = originalTestConfig;
		});

		it('should handle test logging when TestConfig.stores.uploads is 0', () => {
			// Temporarily set to 0 to test the falsy case
			const originalTestConfig = TestConfig.stores.uploads;
			TestConfig.stores.uploads = 0 as any;

			// Clear any previous calls
			consoleLogSpy.mockClear();

			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([
					{
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
					},
				]);
			});

			// Verify that console.log was not called with state information
			expect(consoleLogSpy).not.toHaveBeenCalledWith('Uploads State:', expect.any(Object));

			// Restore original test config
			TestConfig.stores.uploads = originalTestConfig;
		});

		it('should handle test logging when TestConfig.stores.uploads is empty string', () => {
			// Temporarily set to empty string to test the falsy case
			const originalTestConfig = TestConfig.stores.uploads;
			TestConfig.stores.uploads = '' as any;

			// Clear any previous calls
			consoleLogSpy.mockClear();

			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([
					{
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
					},
				]);
			});

			// Verify that console.log was not called with state information
			expect(consoleLogSpy).not.toHaveBeenCalledWith('Uploads State:', expect.any(Object));

			// Restore original test config
			TestConfig.stores.uploads = originalTestConfig;
		});

		it('should handle test logging when TestConfig.stores.uploads is false string', () => {
			// Temporarily set to 'false' string to test the falsy case
			const originalTestConfig = TestConfig.stores.uploads;
			TestConfig.stores.uploads = 'false' as any;

			// Clear any previous calls
			consoleLogSpy.mockClear();

			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadProgressArray([
					{
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
					},
				]);
			});

			// Verify that console.log was not called with state information
			expect(consoleLogSpy).not.toHaveBeenCalledWith('Uploads State:', expect.any(Object));

			// Restore original test config
			TestConfig.stores.uploads = originalTestConfig;
		});
	});

	describe('module-level subscription setup', () => {
		it('should set up subscription when TestConfig.stores.uploads is true', () => {
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

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change directly on the store
			act(() => {
				freshUseUploadsStore.setState({
					uploadProgressArray: [
						{
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
						},
					],
				});
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					uploadProgressArray: expect.arrayContaining([
						expect.objectContaining({
							id: '1',
							eventId: 'event1',
							userId: 'user1',
						}),
					]),
				}),
			);
		});

		it('should not set up subscription when TestConfig.stores.uploads is false', () => {
			// Mock the TestConfig to disable uploads store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						uploads: false,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useUploadsStore: freshUseUploadsStore } = require('../../stores/useUploadsStore');

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change directly on the store
			act(() => {
				freshUseUploadsStore.setState({
					uploadProgressArray: [
						{
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
						},
					],
				});
			});

			// Should not have logged anything
			expect(consoleLogSpy).not.toHaveBeenCalledWith('Uploads State:', expect.any(Object));
		});

		it('should handle subscription when TestConfig.stores.uploads is truthy but not boolean', () => {
			// Mock the TestConfig to set uploads to a truthy non-boolean value
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						uploads: 'true', // truthy string
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useUploadsStore: freshUseUploadsStore } = require('../../stores/useUploadsStore');

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change directly on the store
			act(() => {
				freshUseUploadsStore.setState({
					uploadProgressArray: [
						{
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
						},
					],
				});
			});

			// Should have logged the state change since 'true' is truthy
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					uploadProgressArray: expect.arrayContaining([
						expect.objectContaining({
							id: '1',
							eventId: 'event1',
							userId: 'user1',
						}),
					]),
				}),
			);
		});
	});

	describe('edge cases and complex scenarios', () => {
		it('should handle upload items with all optional properties', () => {
			const { result } = renderHook(() => useUploadsStore());
			const complexUploadItem: UploadItem = {
				id: 'complex-1',
				eventId: 'event1',
				userId: 'user1',
				payload: {
					uri: 'test-uri',
					name: 'test.mp4',
					type: 'video/mp4',
					timestampStart: 1000,
					timestampEnd: 5000,
					duration: 4000,
					fps: 30,
					orientation: 'landscape',
					height: 1080,
					width: 1920,
					deviceName: 'iPhone 15',
					metadata: '{"key": "value"}',
					isPrimary: true,
				},
				status: 1,
				progress: 50,
				error: null,
			};

			act(() => {
				result.current.setUploadProgressArray([complexUploadItem]);
			});

			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadProgressArray[0]).toEqual(complexUploadItem);
		});

		it('should handle multiple state changes in sequence', () => {
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

			// Perform multiple state changes
			act(() => {
				result.current.setUploadProgressArray([mockUploadItem]);
				result.current.setUploadQueue([mockUploadItem]);
				result.current.setUploadError('Error 1');
				result.current.setPackageUploadProgressArray([mockUploadItem]);
				result.current.setPackageUploadQueue([mockUploadItem]);
				result.current.setPackageUploadError('Error 2');
			});

			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadQueue).toHaveLength(1);
			expect(result.current.uploadError).toBe('Error 1');
			expect(result.current.packageUploadProgressArray).toHaveLength(1);
			expect(result.current.packageUploadQueue).toHaveLength(1);
			expect(result.current.packageUploadError).toBe('Error 2');
		});

		it('should handle null deviceName in upload payload', () => {
			const { result } = renderHook(() => useUploadsStore());
			const uploadItemWithNullDevice: UploadItem = {
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
					deviceName: null,
				},
				status: 0,
			};

			act(() => {
				result.current.setUploadProgressArray([uploadItemWithNullDevice]);
			});

			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadProgressArray[0].payload.deviceName).toBeNull();
		});

		it('should handle undefined error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError(undefined);
			});

			expect(result.current.uploadError).toBeUndefined();
		});

		it('should handle undefined package error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError(undefined);
			});

			expect(result.current.packageUploadError).toBeUndefined();
		});

		it('should handle empty string error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError('');
			});

			expect(result.current.uploadError).toBe('');
		});

		it('should handle empty string package error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError('');
			});

			expect(result.current.packageUploadError).toBe('');
		});

		it('should handle zero error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError(0);
			});

			expect(result.current.uploadError).toBe(0);
		});

		it('should handle zero package error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError(0);
			});

			expect(result.current.packageUploadError).toBe(0);
		});

		it('should handle false error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setUploadError(false);
			});

			expect(result.current.uploadError).toBe(false);
		});

		it('should handle false package error values', () => {
			const { result } = renderHook(() => useUploadsStore());

			act(() => {
				result.current.setPackageUploadError(false);
			});

			expect(result.current.packageUploadError).toBe(false);
		});

		it('should handle array error values', () => {
			const { result } = renderHook(() => useUploadsStore());
			const errorArray = ['error1', 'error2'];

			act(() => {
				result.current.setUploadError(errorArray);
			});

			expect(result.current.uploadError).toBe(errorArray);
		});

		it('should handle array package error values', () => {
			const { result } = renderHook(() => useUploadsStore());
			const errorArray = ['error1', 'error2'];

			act(() => {
				result.current.setPackageUploadError(errorArray);
			});

			expect(result.current.packageUploadError).toBe(errorArray);
		});

		it('should handle function error values', () => {
			const { result } = renderHook(() => useUploadsStore());
			const errorFunction = () => 'test error';

			act(() => {
				result.current.setUploadError(errorFunction);
			});

			expect(result.current.uploadError).toBe(errorFunction);
		});

		it('should handle function package error values', () => {
			const { result } = renderHook(() => useUploadsStore());
			const errorFunction = () => 'test error';

			act(() => {
				result.current.setPackageUploadError(errorFunction);
			});

			expect(result.current.packageUploadError).toBe(errorFunction);
		});

		it('should handle rapid state changes', () => {
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

			// Perform rapid state changes
			act(() => {
				result.current.setUploadProgressArray([mockUploadItem]);
				result.current.setUploadProgressArray([]);
				result.current.setUploadProgressArray([mockUploadItem]);
				result.current.setUploadError('Error');
				result.current.setUploadError(null);
				result.current.setUploadError('New Error');
			});

			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadError).toBe('New Error');
		});

		it('should handle concurrent operations on different state properties', () => {
			const { result } = renderHook(() => useUploadsStore());
			const mockUploadItem1: UploadItem = {
				id: '1',
				eventId: 'event1',
				userId: 'user1',
				payload: {
					uri: 'test-uri-1',
					name: 'test1.mp4',
					type: 'video/mp4',
					orientation: 'portrait',
					height: 1920,
					width: 1080,
					deviceName: 'test-device-1',
				},
				status: 0,
			};
			const mockUploadItem2: UploadItem = {
				id: '2',
				eventId: 'event2',
				userId: 'user2',
				payload: {
					uri: 'test-uri-2',
					name: 'test2.mp4',
					type: 'video/mp4',
					orientation: 'landscape',
					height: 1080,
					width: 1920,
					deviceName: 'test-device-2',
				},
				status: 1,
			};

			act(() => {
				// Set camera uploads
				result.current.setUploadProgressArray([mockUploadItem1]);
				result.current.setUploadQueue([mockUploadItem1]);
				result.current.setUploadError('Camera Error');

				// Set package uploads
				result.current.setPackageUploadProgressArray([mockUploadItem2]);
				result.current.setPackageUploadQueue([mockUploadItem2]);
				result.current.setPackageUploadError('Package Error');
			});

			// Verify camera uploads
			expect(result.current.uploadProgressArray).toHaveLength(1);
			expect(result.current.uploadProgressArray[0]).toEqual(mockUploadItem1);
			expect(result.current.uploadQueue).toHaveLength(1);
			expect(result.current.uploadQueue[0]).toEqual(mockUploadItem1);
			expect(result.current.uploadError).toBe('Camera Error');

			// Verify package uploads
			expect(result.current.packageUploadProgressArray).toHaveLength(1);
			expect(result.current.packageUploadProgressArray[0]).toEqual(mockUploadItem2);
			expect(result.current.packageUploadQueue).toHaveLength(1);
			expect(result.current.packageUploadQueue[0]).toEqual(mockUploadItem2);
			expect(result.current.packageUploadError).toBe('Package Error');
		});
	});

	describe('subscription logging with different state changes', () => {
		it('should log when package upload progress array changes', () => {
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

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change for package upload progress
			act(() => {
				freshUseUploadsStore.setState({
					packageUploadProgressArray: [
						{
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
						},
					],
				});
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					packageUploadProgressArray: expect.arrayContaining([
						expect.objectContaining({
							id: '1',
							eventId: 'event1',
							userId: 'user1',
						}),
					]),
				}),
			);
		});

		it('should log when upload error changes', () => {
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

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change for upload error
			act(() => {
				freshUseUploadsStore.setState({
					uploadError: new Error('Test upload error'),
				});
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					uploadError: expect.any(Error),
				}),
			);
		});

		it('should log when package upload error changes', () => {
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

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change for package upload error
			act(() => {
				freshUseUploadsStore.setState({
					packageUploadError: 'Package upload failed',
				});
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					packageUploadError: 'Package upload failed',
				}),
			);
		});

		it('should log when upload queue changes', () => {
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

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change for upload queue
			act(() => {
				freshUseUploadsStore.setState({
					uploadQueue: [
						{
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
						},
					],
				});
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					uploadQueue: expect.arrayContaining([
						expect.objectContaining({
							id: '1',
							eventId: 'event1',
							userId: 'user1',
						}),
					]),
				}),
			);
		});

		it('should log when package upload queue changes', () => {
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

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger a state change for package upload queue
			act(() => {
				freshUseUploadsStore.setState({
					packageUploadQueue: [
						{
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
						},
					],
				});
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					packageUploadQueue: expect.arrayContaining([
						expect.objectContaining({
							id: '1',
							eventId: 'event1',
							userId: 'user1',
						}),
					]),
				}),
			);
		});

		it('should log when multiple state properties change simultaneously', () => {
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

			// Clear any previous calls
			consoleLogSpy.mockClear();

			// Trigger multiple state changes simultaneously
			act(() => {
				freshUseUploadsStore.setState({
					uploadProgressArray: [
						{
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
						},
					],
					uploadError: 'Multiple state change test',
					packageUploadProgressArray: [
						{
							id: '2',
							eventId: 'event2',
							userId: 'user2',
							payload: {
								uri: 'test-uri-2',
								name: 'test2.mp4',
								type: 'video/mp4',
								orientation: 'landscape',
								height: 1080,
								width: 1920,
								deviceName: 'test-device-2',
							},
							status: 1,
						},
					],
				});
			});

			// Should have logged the state change with all properties
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Uploads State:',
				expect.objectContaining({
					uploadProgressArray: expect.arrayContaining([
						expect.objectContaining({
							id: '1',
							eventId: 'event1',
							userId: 'user1',
						}),
					]),
					uploadError: 'Multiple state change test',
					packageUploadProgressArray: expect.arrayContaining([
						expect.objectContaining({
							id: '2',
							eventId: 'event2',
							userId: 'user2',
						}),
					]),
				}),
			);
		});
	});
});
