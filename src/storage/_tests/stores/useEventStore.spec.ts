import { renderHook, act } from '@testing-library/react-hooks';
import { useEventStore } from '../../stores/useEventStore';
import type { MeddlyEvent } from '../../../interfaces/Event';
import type { Venue } from '../../../interfaces/Venue';
import type { Organization } from '../../../interfaces/Organization';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useEventStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useEventStore.getState().resetEvents();
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
		it('should not log state when TestConfig.stores.event is false', () => {
			// TestConfig.stores.event is false by default
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setViewEvent(mockEvent);
			});

			// Should not have logged anything since TestConfig.stores.event is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.event is true', () => {
			// Mock the TestConfig to enable event store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						event: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useEventStore: freshUseEventStore } = require('../../stores/useEventStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseEventStore.setState({ viewEvent: mockEvent });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Event State:',
				expect.objectContaining({
					viewEvent: mockEvent,
				}),
			);
		});
	});

	const mockVenue: Venue = {
		id: '1',
		name: 'Test Venue',
		type: 'venue',
		isOperating: true,
		addressStreet1: '123 Test St',
		addressCity: 'Test City',
		addressRegion: 'Test Region',
		addressCountry: 'Test Country',
		addressZipCode: '12345',
		locale: 'en-US',
		timezone: 'UTC',
		latitude: '0',
		longitude: '0',
	};

	const mockOrganization: Organization = {
		id: '1',
		name: 'Test Org',
	};

	const mockEvent: MeddlyEvent = {
		id: '1',
		title: 'Test Event',
		status: 'active',
		dateTime: Date.now(),
		type: 'test',
		venue: mockVenue,
		orgOwner: mockOrganization,
		manager: {
			id: '1',
			username: 'testmanager',
		},
		updated: new Date(),
		created: new Date(),
	};

	describe('view event management', () => {
		it('should initialize with null view event', () => {
			const { result } = renderHook(() => useEventStore());
			expect(result.current.viewEvent).toBeNull();
			expect(result.current.loadingViewEvent).toBe(false);
		});

		it('should set view event', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setViewEvent(mockEvent);
			});

			expect(result.current.viewEvent).toEqual(mockEvent);
		});

		it('should set view event to null', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setViewEvent(null);
			});

			expect(result.current.viewEvent).toBeNull();
		});

		it('should update loading view event state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setLoadingViewEvent(true);
			});

			expect(result.current.loadingViewEvent).toBe(true);

			act(() => {
				result.current.setLoadingViewEvent(false);
			});

			expect(result.current.loadingViewEvent).toBe(false);
		});
	});

	describe('camera events management', () => {
		it('should initialize with empty camera events', () => {
			const { result } = renderHook(() => useEventStore());
			expect(result.current.cameraEvents).toEqual([]);
			expect(result.current.cameraEventsTotal).toBe(0);
			expect(result.current.loadingCameraEvents).toBe(false);
		});

		it('should set camera events', () => {
			const { result } = renderHook(() => useEventStore());
			const events = [mockEvent];

			act(() => {
				result.current.setCameraEvents(events);
			});

			expect(result.current.cameraEvents).toEqual(events);
		});

		it('should set camera events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setCameraEventsTotal(50);
			});

			expect(result.current.cameraEventsTotal).toBe(50);
		});

		it('should update loading camera events state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setLoadingCameraEvents(true);
			});

			expect(result.current.loadingCameraEvents).toBe(true);

			act(() => {
				result.current.setLoadingCameraEvents(false);
			});

			expect(result.current.loadingCameraEvents).toBe(false);
		});
	});

	describe('org events management', () => {
		it('should initialize with default org events state', () => {
			const { result } = renderHook(() => useEventStore());
			expect(result.current.orgEventsCurrentTab).toBe('All');
			expect(result.current.orgEventsStatuses).toEqual([]);
			expect(result.current.orgEvents).toEqual([]);
			expect(result.current.orgEventsCurrentPage).toBe(0);
			expect(result.current.orgEventsTotal).toBe(0);
			expect(result.current.loadingOrgEvents).toBe(false);
		});

		it('should update org events tab', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgEventsCurrentTab('Upcoming');
			});

			expect(result.current.orgEventsCurrentTab).toBe('Upcoming');
		});

		it('should update org events statuses', () => {
			const { result } = renderHook(() => useEventStore());
			const statuses = ['active', 'completed'];

			act(() => {
				result.current.setOrgEventsStatuses(statuses);
			});

			expect(result.current.orgEventsStatuses).toEqual(statuses);
		});

		it('should update org events', () => {
			const { result } = renderHook(() => useEventStore());
			const events = [mockEvent];

			act(() => {
				result.current.setOrgEvents(events);
			});

			expect(result.current.orgEvents).toEqual(events);
		});

		it('should update org events pagination', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgEventsCurrentPage(2);
				result.current.setOrgEventsTotal(50);
			});

			expect(result.current.orgEventsCurrentPage).toBe(2);
			expect(result.current.orgEventsTotal).toBe(50);
		});

		it('should update org events loading state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setLoadingOrgEvents(true);
			});

			expect(result.current.loadingOrgEvents).toBe(true);

			act(() => {
				result.current.setLoadingOrgEvents(false);
			});

			expect(result.current.loadingOrgEvents).toBe(false);
		});
	});

	describe('org completed events management', () => {
		it('should initialize with default org completed events state', () => {
			const { result } = renderHook(() => useEventStore());
			expect(result.current.orgCompletedEvents).toEqual([]);
			expect(result.current.orgCompletedEventsCurrentPage).toBe(0);
			expect(result.current.orgCompletedEventsTotal).toBe(0);
			expect(result.current.loadingOrgCompletedEvents).toBe(false);
		});

		it('should update org completed events', () => {
			const { result } = renderHook(() => useEventStore());
			const events = [mockEvent];

			act(() => {
				result.current.setOrgCompletedEvents(events);
			});

			expect(result.current.orgCompletedEvents).toEqual(events);
		});

		it('should update org completed events pagination', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgCompletedEventsCurrentPage(2);
				result.current.setOrgCompletedEventsTotal(50);
			});

			expect(result.current.orgCompletedEventsCurrentPage).toBe(2);
			expect(result.current.orgCompletedEventsTotal).toBe(50);
		});

		it('should update org completed events loading state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setLoadingOrgCompletedEvents(true);
			});

			expect(result.current.loadingOrgCompletedEvents).toBe(true);

			act(() => {
				result.current.setLoadingOrgCompletedEvents(false);
			});

			expect(result.current.loadingOrgCompletedEvents).toBe(false);
		});
	});

	describe('manager events management', () => {
		it('should initialize with default manager events state', () => {
			const { result } = renderHook(() => useEventStore());
			expect(result.current.managerSetupEvent).toBe(false);
			expect(result.current.managerStartingEvent).toBe(false);
			expect(result.current.managerCancelingEvent).toBe(false);
			expect(result.current.managerEndingEvent).toBe(false);
		});

		it('should update manager setup event state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setManagerSetupEvent(true);
			});

			expect(result.current.managerSetupEvent).toBe(true);

			act(() => {
				result.current.setManagerSetupEvent(false);
			});

			expect(result.current.managerSetupEvent).toBe(false);
		});

		it('should update manager starting event state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setManagerStartingEvent(true);
			});

			expect(result.current.managerStartingEvent).toBe(true);

			act(() => {
				result.current.setManagerStartingEvent(false);
			});

			expect(result.current.managerStartingEvent).toBe(false);
		});

		it('should update manager canceling event state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setManagerCancelingEvent(true);
			});

			expect(result.current.managerCancelingEvent).toBe(true);

			act(() => {
				result.current.setManagerCancelingEvent(false);
			});

			expect(result.current.managerCancelingEvent).toBe(false);
		});

		it('should update manager ending event state', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setManagerEndingEvent(true);
			});

			expect(result.current.managerEndingEvent).toBe(true);

			act(() => {
				result.current.setManagerEndingEvent(false);
			});

			expect(result.current.managerEndingEvent).toBe(false);
		});

		it('should handle multiple manager states simultaneously', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setManagerSetupEvent(true);
				result.current.setManagerStartingEvent(true);
				result.current.setManagerCancelingEvent(false);
				result.current.setManagerEndingEvent(true);
			});

			expect(result.current.managerSetupEvent).toBe(true);
			expect(result.current.managerStartingEvent).toBe(true);
			expect(result.current.managerCancelingEvent).toBe(false);
			expect(result.current.managerEndingEvent).toBe(true);
		});
	});

	describe('error handling', () => {
		it('should initialize with null error', () => {
			const { result } = renderHook(() => useEventStore());
			expect(result.current.error).toBeNull();
		});

		it('should set error', () => {
			const { result } = renderHook(() => useEventStore());
			const testError = new Error('Test error');

			act(() => {
				result.current.setError(testError);
			});

			expect(result.current.error).toEqual(testError);
		});

		it('should set error to null', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setError(null);
			});

			expect(result.current.error).toBeNull();
		});
	});

	describe('reset functionality', () => {
		it('should reset all state to initial values', () => {
			const { result } = renderHook(() => useEventStore());

			// Modify state
			act(() => {
				result.current.setViewEvent(mockEvent);
				result.current.setLoadingViewEvent(true);
				result.current.setCameraEvents([mockEvent]);
				result.current.setCameraEventsTotal(50);
				result.current.setLoadingCameraEvents(true);
				result.current.setOrgEventsCurrentTab('Upcoming');
				result.current.setOrgEventsStatuses(['active']);
				result.current.setOrgEvents([mockEvent]);
				result.current.setOrgEventsCurrentPage(2);
				result.current.setOrgEventsTotal(50);
				result.current.setLoadingOrgEvents(true);
				result.current.setOrgCompletedEvents([mockEvent]);
				result.current.setOrgCompletedEventsCurrentPage(2);
				result.current.setOrgCompletedEventsTotal(50);
				result.current.setLoadingOrgCompletedEvents(true);
				result.current.setManagerSetupEvent(true);
				result.current.setManagerStartingEvent(true);
				result.current.setManagerCancelingEvent(true);
				result.current.setManagerEndingEvent(true);
				result.current.setError(new Error('Test error'));
			});

			// Reset state
			act(() => {
				result.current.resetEvents();
			});

			// Verify reset
			expect(result.current.viewEvent).toBeNull();
			expect(result.current.loadingViewEvent).toBe(false);
			expect(result.current.cameraEvents).toEqual([]);
			expect(result.current.cameraEventsTotal).toBe(0);
			expect(result.current.loadingCameraEvents).toBe(false);
			expect(result.current.orgEventsCurrentTab).toBe('All');
			expect(result.current.orgEventsStatuses).toEqual([]);
			expect(result.current.orgEvents).toEqual([]);
			expect(result.current.orgEventsCurrentPage).toBe(0);
			expect(result.current.orgEventsTotal).toBe(0);
			expect(result.current.loadingOrgEvents).toBe(false);
			expect(result.current.orgCompletedEvents).toEqual([]);
			expect(result.current.orgCompletedEventsCurrentPage).toBe(0);
			expect(result.current.orgCompletedEventsTotal).toBe(0);
			expect(result.current.loadingOrgCompletedEvents).toBe(false);
			expect(result.current.managerSetupEvent).toBe(false);
			expect(result.current.managerStartingEvent).toBe(false);
			expect(result.current.managerCancelingEvent).toBe(false);
			expect(result.current.managerEndingEvent).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useEventStore());

			// Verify initial state
			expect(result.current.viewEvent).toBeNull();
			expect(result.current.loadingViewEvent).toBe(false);
			expect(result.current.cameraEvents).toEqual([]);
			expect(result.current.cameraEventsTotal).toBe(0);
			expect(result.current.loadingCameraEvents).toBe(false);
			expect(result.current.orgEventsCurrentTab).toBe('All');
			expect(result.current.orgEventsStatuses).toEqual([]);
			expect(result.current.orgEvents).toEqual([]);
			expect(result.current.orgEventsCurrentPage).toBe(0);
			expect(result.current.orgEventsTotal).toBe(0);
			expect(result.current.loadingOrgEvents).toBe(false);
			expect(result.current.orgCompletedEvents).toEqual([]);
			expect(result.current.orgCompletedEventsCurrentPage).toBe(0);
			expect(result.current.orgCompletedEventsTotal).toBe(0);
			expect(result.current.loadingOrgCompletedEvents).toBe(false);
			expect(result.current.managerSetupEvent).toBe(false);
			expect(result.current.managerStartingEvent).toBe(false);
			expect(result.current.managerCancelingEvent).toBe(false);
			expect(result.current.managerEndingEvent).toBe(false);
			expect(result.current.error).toBeNull();

			// Reset the store
			act(() => {
				result.current.resetEvents();
			});

			// Verify state remains at initial values
			expect(result.current.viewEvent).toBeNull();
			expect(result.current.loadingViewEvent).toBe(false);
			expect(result.current.cameraEvents).toEqual([]);
			expect(result.current.cameraEventsTotal).toBe(0);
			expect(result.current.loadingCameraEvents).toBe(false);
			expect(result.current.orgEventsCurrentTab).toBe('All');
			expect(result.current.orgEventsStatuses).toEqual([]);
			expect(result.current.orgEvents).toEqual([]);
			expect(result.current.orgEventsCurrentPage).toBe(0);
			expect(result.current.orgEventsTotal).toBe(0);
			expect(result.current.loadingOrgEvents).toBe(false);
			expect(result.current.orgCompletedEvents).toEqual([]);
			expect(result.current.orgCompletedEventsCurrentPage).toBe(0);
			expect(result.current.orgCompletedEventsTotal).toBe(0);
			expect(result.current.loadingOrgCompletedEvents).toBe(false);
			expect(result.current.managerSetupEvent).toBe(false);
			expect(result.current.managerStartingEvent).toBe(false);
			expect(result.current.managerCancelingEvent).toBe(false);
			expect(result.current.managerEndingEvent).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setViewEvent(mockEvent);
				result.current.setLoadingViewEvent(true);
				result.current.setCameraEvents([mockEvent]);
				result.current.setCameraEventsTotal(50);
				result.current.setLoadingCameraEvents(true);
				result.current.setOrgEventsCurrentTab('Upcoming');
				result.current.setOrgEventsStatuses(['active']);
				result.current.setOrgEvents([mockEvent]);
				result.current.setOrgEventsCurrentPage(2);
				result.current.setOrgEventsTotal(50);
				result.current.setLoadingOrgEvents(true);
				result.current.setOrgCompletedEvents([mockEvent]);
				result.current.setOrgCompletedEventsCurrentPage(2);
				result.current.setOrgCompletedEventsTotal(50);
				result.current.setLoadingOrgCompletedEvents(true);
				result.current.setManagerSetupEvent(true);
				result.current.setManagerStartingEvent(true);
				result.current.setManagerCancelingEvent(true);
				result.current.setManagerEndingEvent(true);
				result.current.setError(new Error('Test error'));
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useEventStore());

			// The state should be persisted
			expect(newResult.current.viewEvent).toEqual(mockEvent);
			expect(newResult.current.loadingViewEvent).toBe(true);
			expect(newResult.current.cameraEvents).toEqual([mockEvent]);
			expect(newResult.current.cameraEventsTotal).toBe(50);
			expect(newResult.current.loadingCameraEvents).toBe(true);
			expect(newResult.current.orgEventsCurrentTab).toBe('Upcoming');
			expect(newResult.current.orgEventsStatuses).toEqual(['active']);
			expect(newResult.current.orgEvents).toEqual([mockEvent]);
			expect(newResult.current.orgEventsCurrentPage).toBe(2);
			expect(newResult.current.orgEventsTotal).toBe(50);
			expect(newResult.current.loadingOrgEvents).toBe(true);
			expect(newResult.current.orgCompletedEvents).toEqual([mockEvent]);
			expect(newResult.current.orgCompletedEventsCurrentPage).toBe(2);
			expect(newResult.current.orgCompletedEventsTotal).toBe(50);
			expect(newResult.current.loadingOrgCompletedEvents).toBe(true);
			expect(newResult.current.managerSetupEvent).toBe(true);
			expect(newResult.current.managerStartingEvent).toBe(true);
			expect(newResult.current.managerCancelingEvent).toBe(true);
			expect(newResult.current.managerEndingEvent).toBe(true);
			expect(newResult.current.error).toEqual(new Error('Test error'));
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useEventStore());

			expect(typeof result.current.setViewEvent).toBe('function');
			expect(typeof result.current.setLoadingViewEvent).toBe('function');
			expect(typeof result.current.setCameraEvents).toBe('function');
			expect(typeof result.current.setCameraEventsTotal).toBe('function');
			expect(typeof result.current.setLoadingCameraEvents).toBe('function');
			expect(typeof result.current.setOrgEventsCurrentTab).toBe('function');
			expect(typeof result.current.setOrgEventsStatuses).toBe('function');
			expect(typeof result.current.setOrgEvents).toBe('function');
			expect(typeof result.current.setOrgEventsCurrentPage).toBe('function');
			expect(typeof result.current.setOrgEventsTotal).toBe('function');
			expect(typeof result.current.setLoadingOrgEvents).toBe('function');
			expect(typeof result.current.setOrgCompletedEvents).toBe('function');
			expect(typeof result.current.setOrgCompletedEventsCurrentPage).toBe('function');
			expect(typeof result.current.setOrgCompletedEventsTotal).toBe('function');
			expect(typeof result.current.setLoadingOrgCompletedEvents).toBe('function');
			expect(typeof result.current.setManagerSetupEvent).toBe('function');
			expect(typeof result.current.setManagerStartingEvent).toBe('function');
			expect(typeof result.current.setManagerCancelingEvent).toBe('function');
			expect(typeof result.current.setManagerEndingEvent).toBe('function');
			expect(typeof result.current.setError).toBe('function');
			expect(typeof result.current.resetEvents).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useEventStore());

			expect(result.current.viewEvent).toBeDefined();
			expect(typeof result.current.loadingViewEvent).toBe('boolean');
			expect(Array.isArray(result.current.cameraEvents)).toBe(true);
			expect(typeof result.current.cameraEventsTotal).toBe('number');
			expect(typeof result.current.loadingCameraEvents).toBe('boolean');
			expect(typeof result.current.orgEventsCurrentTab).toBe('string');
			expect(Array.isArray(result.current.orgEventsStatuses)).toBe(true);
			expect(Array.isArray(result.current.orgEvents)).toBe(true);
			expect(typeof result.current.orgEventsCurrentPage).toBe('number');
			expect(typeof result.current.orgEventsTotal).toBe('number');
			expect(typeof result.current.loadingOrgEvents).toBe('boolean');
			expect(Array.isArray(result.current.orgCompletedEvents)).toBe(true);
			expect(typeof result.current.orgCompletedEventsCurrentPage).toBe('number');
			expect(typeof result.current.orgCompletedEventsTotal).toBe('number');
			expect(typeof result.current.loadingOrgCompletedEvents).toBe('boolean');
			expect(typeof result.current.managerSetupEvent).toBe('boolean');
			expect(typeof result.current.managerStartingEvent).toBe('boolean');
			expect(typeof result.current.managerCancelingEvent).toBe('boolean');
			expect(typeof result.current.managerEndingEvent).toBe('boolean');
			expect(result.current.error).toBeDefined();
		});
	});

	describe('edge cases', () => {
		it('should handle null view event', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setViewEvent(null);
			});

			expect(result.current.viewEvent).toBeNull();
		});

		it('should handle undefined view event', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setViewEvent(undefined as any);
			});

			expect(result.current.viewEvent).toBeUndefined();
		});

		it('should handle empty camera events array', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setCameraEvents([]);
			});

			expect(result.current.cameraEvents).toEqual([]);
		});

		it('should handle large arrays of camera events', () => {
			const { result } = renderHook(() => useEventStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				...mockEvent,
				id: `event-${index}`,
				title: `Event ${index}`,
			}));

			act(() => {
				result.current.setCameraEvents(largeArray);
			});

			expect(result.current.cameraEvents).toEqual(largeArray);
			expect(result.current.cameraEvents).toHaveLength(1000);
		});

		it('should handle negative camera events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setCameraEventsTotal(-1);
			});

			expect(result.current.cameraEventsTotal).toBe(-1);
		});

		it('should handle zero camera events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setCameraEventsTotal(0);
			});

			expect(result.current.cameraEventsTotal).toBe(0);
		});

		it('should handle large camera events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setCameraEventsTotal(999999);
			});

			expect(result.current.cameraEventsTotal).toBe(999999);
		});

		it('should handle empty org events statuses array', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgEventsStatuses([]);
			});

			expect(result.current.orgEventsStatuses).toEqual([]);
		});

		it('should handle large arrays of org events statuses', () => {
			const { result } = renderHook(() => useEventStore());
			const largeArray = Array.from({ length: 100 }, (_, index) => `status-${index}`);

			act(() => {
				result.current.setOrgEventsStatuses(largeArray);
			});

			expect(result.current.orgEventsStatuses).toEqual(largeArray);
			expect(result.current.orgEventsStatuses).toHaveLength(100);
		});

		it('should handle negative org events current page', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgEventsCurrentPage(-1);
			});

			expect(result.current.orgEventsCurrentPage).toBe(-1);
		});

		it('should handle large org events current page', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgEventsCurrentPage(999999);
			});

			expect(result.current.orgEventsCurrentPage).toBe(999999);
		});

		it('should handle negative org events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgEventsTotal(-1);
			});

			expect(result.current.orgEventsTotal).toBe(-1);
		});

		it('should handle large org events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgEventsTotal(999999);
			});

			expect(result.current.orgEventsTotal).toBe(999999);
		});

		it('should handle negative org completed events current page', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgCompletedEventsCurrentPage(-1);
			});

			expect(result.current.orgCompletedEventsCurrentPage).toBe(-1);
		});

		it('should handle large org completed events current page', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgCompletedEventsCurrentPage(999999);
			});

			expect(result.current.orgCompletedEventsCurrentPage).toBe(999999);
		});

		it('should handle negative org completed events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgCompletedEventsTotal(-1);
			});

			expect(result.current.orgCompletedEventsTotal).toBe(-1);
		});

		it('should handle large org completed events total', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setOrgCompletedEventsTotal(999999);
			});

			expect(result.current.orgCompletedEventsTotal).toBe(999999);
		});

		it('should handle undefined error', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setError(undefined);
			});

			expect(result.current.error).toBeUndefined();
		});

		it('should handle string error', () => {
			const { result } = renderHook(() => useEventStore());

			act(() => {
				result.current.setError('String error');
			});

			expect(result.current.error).toBe('String error');
		});

		it('should handle object error', () => {
			const { result } = renderHook(() => useEventStore());
			const errorObject = { message: 'Object error', code: 500 };

			act(() => {
				result.current.setError(errorObject);
			});

			expect(result.current.error).toEqual(errorObject);
		});
	});
});
