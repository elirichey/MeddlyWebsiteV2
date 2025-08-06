import { renderHook, act } from '@testing-library/react-hooks';
import { usePackagesStore } from '../../stores/usePackagesStore';
import type { PackageItem } from '../../../interfaces/Package';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('usePackagesStore', () => {
	const mockPackage: PackageItem = {
		id: '1',
		isDefault: true,
		priceAttendees: '100',
		priceNonAttendees: '200',
		title: 'Test Package',
		totalImages: 5,
		totalVideoDuration: 300,
		totalVideos: 2,
		type: 'standard',
		event: {
			id: 'event1',
			orgOwnerId: 'org1',
			title: 'Test Event',
		},
		published: true,
		packagePosts: [],
		created: new Date(),
		updated: new Date(),
	};

	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			usePackagesStore.setState({
				// Event Posts
				eventPosts: [],
				eventPostsCurrentPage: 0,
				eventTotalPosts: 0,
				loadingEventPosts: false,

				// Event Packages
				eventPackages: [],
				eventPackagesCurrentPage: 0,
				eventTotalPackages: 0,
				loadingEventPackages: false,

				// Package Posts
				packagePosts: [],
				packagePostsCurrentPage: 0,
				packageTotalPosts: 0,
				loadingPackagePosts: false,

				// View Package
				viewPackage: null,
				loadingPackage: false,

				// Error
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
		it('should not log state when TestConfig.stores.packages is false', () => {
			// TestConfig.stores.packages is false by default
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackages([mockPackage]);
			});

			// Should not have logged anything since TestConfig.stores.packages is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.packages is true', () => {
			// Mock the TestConfig to enable packages store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						packages: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { usePackagesStore: freshUsePackagesStore } = require('../../stores/usePackagesStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUsePackagesStore.setState({ eventPackages: [mockPackage] });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Packages State:',
				expect.objectContaining({
					eventPackages: [mockPackage],
				}),
			);
		});
	});

	describe('Event Posts', () => {
		it('should initialize with default event posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			expect(result.current.eventPosts).toEqual([]);
			expect(result.current.eventPostsCurrentPage).toBe(0);
			expect(result.current.eventTotalPosts).toBe(0);
			expect(result.current.loadingEventPosts).toBe(false);
		});

		it('should update event posts', () => {
			const { result } = renderHook(() => usePackagesStore());
			const newPosts = [mockPackage];

			act(() => {
				result.current.setEventPosts(newPosts);
			});

			expect(result.current.eventPosts).toEqual(newPosts);
		});

		it('should update event posts current page', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPostsCurrentPage(2);
			});

			expect(result.current.eventPostsCurrentPage).toBe(2);
		});

		it('should update event total posts', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventTotalPosts(10);
			});

			expect(result.current.eventTotalPosts).toBe(10);
		});

		it('should update loading event posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setLoadingEventPosts(true);
			});

			expect(result.current.loadingEventPosts).toBe(true);
		});

		it('should reset event posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPosts([mockPackage]);
				result.current.setEventPostsCurrentPage(2);
				result.current.setEventTotalPosts(10);
				result.current.setLoadingEventPosts(true);
				result.current.resetEventPosts();
			});

			expect(result.current.eventPosts).toEqual([]);
			expect(result.current.eventPostsCurrentPage).toBe(0);
			expect(result.current.eventTotalPosts).toBe(0);
			expect(result.current.loadingEventPosts).toBe(false);
		});

		it('should handle empty event posts array', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPosts([]);
			});

			expect(result.current.eventPosts).toEqual([]);
		});

		it('should handle single event post', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPosts([mockPackage]);
			});

			expect(result.current.eventPosts).toEqual([mockPackage]);
		});

		it('should replace existing event posts', () => {
			const { result } = renderHook(() => usePackagesStore());
			const secondPackage = { ...mockPackage, id: '2', title: 'Second Package' };

			// Set initial posts
			act(() => {
				result.current.setEventPosts([mockPackage]);
			});

			expect(result.current.eventPosts).toEqual([mockPackage]);

			// Replace with new posts
			act(() => {
				result.current.setEventPosts([secondPackage]);
			});

			expect(result.current.eventPosts).toEqual([secondPackage]);
		});

		it('should toggle loading event posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Start with false
			expect(result.current.loadingEventPosts).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingEventPosts(true);
			});

			expect(result.current.loadingEventPosts).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingEventPosts(false);
			});

			expect(result.current.loadingEventPosts).toBe(false);
		});
	});

	describe('Event Packages', () => {
		it('should initialize with default event packages state', () => {
			const { result } = renderHook(() => usePackagesStore());

			expect(result.current.eventPackages).toEqual([]);
			expect(result.current.eventPackagesCurrentPage).toBe(0);
			expect(result.current.eventTotalPackages).toBe(0);
			expect(result.current.loadingEventPackages).toBe(false);
		});

		it('should update event packages', () => {
			const { result } = renderHook(() => usePackagesStore());
			const newPackages = [mockPackage];

			act(() => {
				result.current.setEventPackages(newPackages);
			});

			expect(result.current.eventPackages).toEqual(newPackages);
		});

		it('should update event packages current page', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackagesCurrentPage(2);
			});

			expect(result.current.eventPackagesCurrentPage).toBe(2);
		});

		it('should update event total packages', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventTotalPackages(10);
			});

			expect(result.current.eventTotalPackages).toBe(10);
		});

		it('should update loading event packages state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setLoadingEventPackages(true);
			});

			expect(result.current.loadingEventPackages).toBe(true);
		});

		it('should reset event packages state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackages([mockPackage]);
				result.current.setEventPackagesCurrentPage(2);
				result.current.setEventTotalPackages(10);
				result.current.setLoadingEventPackages(true);
				result.current.resetEventPackages();
			});

			expect(result.current.eventPackages).toEqual([]);
			expect(result.current.eventPackagesCurrentPage).toBe(0);
			expect(result.current.eventTotalPackages).toBe(0);
			expect(result.current.loadingEventPackages).toBe(false);
		});

		it('should handle empty event packages array', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackages([]);
			});

			expect(result.current.eventPackages).toEqual([]);
		});

		it('should handle single event package', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackages([mockPackage]);
			});

			expect(result.current.eventPackages).toEqual([mockPackage]);
		});

		it('should replace existing event packages', () => {
			const { result } = renderHook(() => usePackagesStore());
			const secondPackage = { ...mockPackage, id: '2', title: 'Second Package' };

			// Set initial packages
			act(() => {
				result.current.setEventPackages([mockPackage]);
			});

			expect(result.current.eventPackages).toEqual([mockPackage]);

			// Replace with new packages
			act(() => {
				result.current.setEventPackages([secondPackage]);
			});

			expect(result.current.eventPackages).toEqual([secondPackage]);
		});

		it('should toggle loading event packages state', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Start with false
			expect(result.current.loadingEventPackages).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingEventPackages(true);
			});

			expect(result.current.loadingEventPackages).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingEventPackages(false);
			});

			expect(result.current.loadingEventPackages).toBe(false);
		});
	});

	describe('Package Posts', () => {
		it('should initialize with default package posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			expect(result.current.packagePosts).toEqual([]);
			expect(result.current.packagePostsCurrentPage).toBe(0);
			expect(result.current.packageTotalPosts).toBe(0);
			expect(result.current.loadingPackagePosts).toBe(false);
		});

		it('should update package posts', () => {
			const { result } = renderHook(() => usePackagesStore());
			const newPosts = [mockPackage];

			act(() => {
				result.current.setPackagePosts(newPosts);
			});

			expect(result.current.packagePosts).toEqual(newPosts);
		});

		it('should update package posts current page', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setPackagePostsCurrentPage(2);
			});

			expect(result.current.packagePostsCurrentPage).toBe(2);
		});

		it('should update package total posts', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setPackageTotalPosts(10);
			});

			expect(result.current.packageTotalPosts).toBe(10);
		});

		it('should update loading package posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setLoadingPackagePosts(true);
			});

			expect(result.current.loadingPackagePosts).toBe(true);
		});

		it('should reset package posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setPackagePosts([mockPackage]);
				result.current.setPackagePostsCurrentPage(2);
				result.current.setPackageTotalPosts(10);
				result.current.setLoadingPackagePosts(true);
				result.current.resetPackagePosts();
			});

			expect(result.current.packagePosts).toEqual([]);
			expect(result.current.packagePostsCurrentPage).toBe(0);
			expect(result.current.packageTotalPosts).toBe(0);
			expect(result.current.loadingPackagePosts).toBe(false);
		});

		it('should handle empty package posts array', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setPackagePosts([]);
			});

			expect(result.current.packagePosts).toEqual([]);
		});

		it('should handle single package post', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setPackagePosts([mockPackage]);
			});

			expect(result.current.packagePosts).toEqual([mockPackage]);
		});

		it('should replace existing package posts', () => {
			const { result } = renderHook(() => usePackagesStore());
			const secondPackage = { ...mockPackage, id: '2', title: 'Second Package' };

			// Set initial posts
			act(() => {
				result.current.setPackagePosts([mockPackage]);
			});

			expect(result.current.packagePosts).toEqual([mockPackage]);

			// Replace with new posts
			act(() => {
				result.current.setPackagePosts([secondPackage]);
			});

			expect(result.current.packagePosts).toEqual([secondPackage]);
		});

		it('should toggle loading package posts state', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Start with false
			expect(result.current.loadingPackagePosts).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingPackagePosts(true);
			});

			expect(result.current.loadingPackagePosts).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingPackagePosts(false);
			});

			expect(result.current.loadingPackagePosts).toBe(false);
		});
	});

	describe('View Package', () => {
		it('should initialize with null view package', () => {
			const { result } = renderHook(() => usePackagesStore());

			expect(result.current.viewPackage).toBeNull();
		});

		it('should initialize with false loading package', () => {
			const { result } = renderHook(() => usePackagesStore());

			expect(result.current.loadingPackage).toBe(false);
		});

		it('should update view package', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setViewPackage(mockPackage);
			});

			expect(result.current.viewPackage).toEqual(mockPackage);
		});

		it('should update loading package state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setLoadingPackage(true);
			});

			expect(result.current.loadingPackage).toBe(true);
		});

		it('should reset view package', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setViewPackage(mockPackage);
				result.current.resetViewPackage();
			});

			expect(result.current.viewPackage).toBeNull();
		});

		it('should set view package to null', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setViewPackage(mockPackage);
				result.current.setViewPackage(null);
			});

			expect(result.current.viewPackage).toBeNull();
		});

		it('should toggle loading package state', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Start with false
			expect(result.current.loadingPackage).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingPackage(true);
			});

			expect(result.current.loadingPackage).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingPackage(false);
			});

			expect(result.current.loadingPackage).toBe(false);
		});

		it('should reset view package when already null', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Verify initial state
			expect(result.current.viewPackage).toBeNull();

			// Reset the view package
			act(() => {
				result.current.resetViewPackage();
			});

			// Verify state remains null
			expect(result.current.viewPackage).toBeNull();
		});
	});

	describe('Error Handling', () => {
		it('should initialize with null error', () => {
			const { result } = renderHook(() => usePackagesStore());

			expect(result.current.error).toBeNull();
		});

		it('should update error state', () => {
			const { result } = renderHook(() => usePackagesStore());
			const error = new Error('Test error');

			act(() => {
				result.current.setError(error);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should handle string error', () => {
			const { result } = renderHook(() => usePackagesStore());
			const error = 'String error message';

			act(() => {
				result.current.setError(error);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should handle null error', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setError(null);
			});

			expect(result.current.error).toBeNull();
		});

		it('should handle undefined error', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setError(undefined);
			});

			expect(result.current.error).toBeUndefined();
		});
	});

	describe('Reset Packages', () => {
		it('should reset all package related state', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				// Set some state
				result.current.setEventPackages([mockPackage]);
				result.current.setEventPackagesCurrentPage(2);
				result.current.setEventTotalPackages(10);
				result.current.setLoadingEventPackages(true);
				result.current.setPackagePosts([mockPackage]);
				result.current.setPackagePostsCurrentPage(2);
				result.current.setPackageTotalPosts(10);
				result.current.setLoadingPackagePosts(true);
				result.current.setViewPackage(mockPackage);
				result.current.setLoadingPackage(true);
				result.current.setError(new Error('Test error'));

				// Reset everything
				result.current.resetPackages();
			});

			// These should be reset
			expect(result.current.eventPackages).toEqual([]);
			expect(result.current.loadingEventPackages).toBe(false);
			expect(result.current.packagePosts).toEqual([]);
			expect(result.current.loadingPackagePosts).toBe(false);
			expect(result.current.viewPackage).toBeNull();
			expect(result.current.error).toBeNull();

			// These should NOT be reset
			expect(result.current.eventPackagesCurrentPage).toBe(2);
			expect(result.current.eventTotalPackages).toBe(10);
			expect(result.current.packagePostsCurrentPage).toBe(2);
			expect(result.current.packageTotalPosts).toBe(10);
			expect(result.current.loadingPackage).toBe(true);
		});

		it('should reset packages when already at initial state', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Verify initial state
			expect(result.current.eventPackages).toEqual([]);
			expect(result.current.loadingEventPackages).toBe(false);
			expect(result.current.packagePosts).toEqual([]);
			expect(result.current.loadingPackagePosts).toBe(false);
			expect(result.current.viewPackage).toBeNull();
			expect(result.current.error).toBeNull();

			// Reset packages
			act(() => {
				result.current.resetPackages();
			});

			// Verify state remains at initial values
			expect(result.current.eventPackages).toEqual([]);
			expect(result.current.loadingEventPackages).toBe(false);
			expect(result.current.packagePosts).toEqual([]);
			expect(result.current.loadingPackagePosts).toBe(false);
			expect(result.current.viewPackage).toBeNull();
			expect(result.current.error).toBeNull();
		});
	});

	describe('State Persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackages([mockPackage]);
				result.current.setPackagePosts([mockPackage]);
				result.current.setViewPackage(mockPackage);
				result.current.setLoadingPackage(true);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => usePackagesStore());

			// State should be persisted
			expect(newResult.current.eventPackages).toEqual([mockPackage]);
			expect(newResult.current.packagePosts).toEqual([mockPackage]);
			expect(newResult.current.viewPackage).toEqual(mockPackage);
			expect(newResult.current.loadingPackage).toBe(true);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Event Posts methods
			expect(typeof result.current.setEventPosts).toBe('function');
			expect(typeof result.current.setEventPostsCurrentPage).toBe('function');
			expect(typeof result.current.setEventTotalPosts).toBe('function');
			expect(typeof result.current.setLoadingEventPosts).toBe('function');
			expect(typeof result.current.resetEventPosts).toBe('function');

			// Event Packages methods
			expect(typeof result.current.setEventPackages).toBe('function');
			expect(typeof result.current.setEventPackagesCurrentPage).toBe('function');
			expect(typeof result.current.setEventTotalPackages).toBe('function');
			expect(typeof result.current.setLoadingEventPackages).toBe('function');
			expect(typeof result.current.resetEventPackages).toBe('function');

			// Package Posts methods
			expect(typeof result.current.setPackagePosts).toBe('function');
			expect(typeof result.current.setPackagePostsCurrentPage).toBe('function');
			expect(typeof result.current.setPackageTotalPosts).toBe('function');
			expect(typeof result.current.setLoadingPackagePosts).toBe('function');
			expect(typeof result.current.resetPackagePosts).toBe('function');

			// View Package methods
			expect(typeof result.current.setViewPackage).toBe('function');
			expect(typeof result.current.setLoadingPackage).toBe('function');
			expect(typeof result.current.resetViewPackage).toBe('function');

			// Error methods
			expect(typeof result.current.setError).toBe('function');

			// Reset methods
			expect(typeof result.current.resetPackages).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => usePackagesStore());

			// Event Posts properties
			expect(Array.isArray(result.current.eventPosts)).toBe(true);
			expect(typeof result.current.eventPostsCurrentPage).toBe('number');
			expect(typeof result.current.eventTotalPosts).toBe('number');
			expect(typeof result.current.loadingEventPosts).toBe('boolean');

			// Event Packages properties
			expect(Array.isArray(result.current.eventPackages)).toBe(true);
			expect(typeof result.current.eventPackagesCurrentPage).toBe('number');
			expect(typeof result.current.eventTotalPackages).toBe('number');
			expect(typeof result.current.loadingEventPackages).toBe('boolean');

			// Package Posts properties
			expect(Array.isArray(result.current.packagePosts)).toBe(true);
			expect(typeof result.current.packagePostsCurrentPage).toBe('number');
			expect(typeof result.current.packageTotalPosts).toBe('number');
			expect(typeof result.current.loadingPackagePosts).toBe('boolean');

			// View Package properties
			expect(result.current.viewPackage === null || typeof result.current.viewPackage === 'object').toBe(true);
			expect(typeof result.current.loadingPackage).toBe('boolean');

			// Error properties
			expect(result.current.error === null || typeof result.current.error !== 'undefined').toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should handle null event posts', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPosts(null as any);
			});

			expect(result.current.eventPosts).toBeNull();
		});

		it('should handle undefined event posts', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPosts(undefined as any);
			});

			expect(result.current.eventPosts).toBeUndefined();
		});

		it('should handle null event packages', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackages(null as any);
			});

			expect(result.current.eventPackages).toBeNull();
		});

		it('should handle undefined event packages', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPackages(undefined as any);
			});

			expect(result.current.eventPackages).toBeUndefined();
		});

		it('should handle null package posts', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setPackagePosts(null as any);
			});

			expect(result.current.packagePosts).toBeNull();
		});

		it('should handle undefined package posts', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setPackagePosts(undefined as any);
			});

			expect(result.current.packagePosts).toBeUndefined();
		});

		it('should handle large arrays of event posts', () => {
			const { result } = renderHook(() => usePackagesStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				...mockPackage,
				id: `package-${index}`,
				title: `Package ${index}`,
			}));

			act(() => {
				result.current.setEventPosts(largeArray);
			});

			expect(result.current.eventPosts).toEqual(largeArray);
			expect(result.current.eventPosts).toHaveLength(1000);
		});

		it('should handle large arrays of event packages', () => {
			const { result } = renderHook(() => usePackagesStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				...mockPackage,
				id: `package-${index}`,
				title: `Package ${index}`,
			}));

			act(() => {
				result.current.setEventPackages(largeArray);
			});

			expect(result.current.eventPackages).toEqual(largeArray);
			expect(result.current.eventPackages).toHaveLength(1000);
		});

		it('should handle large arrays of package posts', () => {
			const { result } = renderHook(() => usePackagesStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				...mockPackage,
				id: `package-${index}`,
				title: `Package ${index}`,
			}));

			act(() => {
				result.current.setPackagePosts(largeArray);
			});

			expect(result.current.packagePosts).toEqual(largeArray);
			expect(result.current.packagePosts).toHaveLength(1000);
		});

		it('should handle negative page numbers', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPostsCurrentPage(-1);
				result.current.setEventPackagesCurrentPage(-5);
				result.current.setPackagePostsCurrentPage(-10);
			});

			expect(result.current.eventPostsCurrentPage).toBe(-1);
			expect(result.current.eventPackagesCurrentPage).toBe(-5);
			expect(result.current.packagePostsCurrentPage).toBe(-10);
		});

		it('should handle zero values', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventTotalPosts(0);
				result.current.setEventTotalPackages(0);
				result.current.setPackageTotalPosts(0);
			});

			expect(result.current.eventTotalPosts).toBe(0);
			expect(result.current.eventTotalPackages).toBe(0);
			expect(result.current.packageTotalPosts).toBe(0);
		});

		it('should handle very large numbers', () => {
			const { result } = renderHook(() => usePackagesStore());

			act(() => {
				result.current.setEventPostsCurrentPage(Number.MAX_SAFE_INTEGER);
				result.current.setEventTotalPosts(Number.MAX_SAFE_INTEGER);
			});

			expect(result.current.eventPostsCurrentPage).toBe(Number.MAX_SAFE_INTEGER);
			expect(result.current.eventTotalPosts).toBe(Number.MAX_SAFE_INTEGER);
		});
	});
});
