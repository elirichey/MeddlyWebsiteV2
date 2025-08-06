import { renderHook, act } from '@testing-library/react-hooks';
import { useSequencesStore } from '../../stores/useSequencesStore';
import type { Sequence } from '../../../interfaces/Sequence';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useSequencesStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useSequencesStore.getState().resetSequences();
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
		it('should not log state when TestConfig.stores.sequences is false', () => {
			// TestConfig.stores.sequences is false by default
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setEventSequences([{ id: '1' }]);
			});

			// Should not have logged anything since TestConfig.stores.sequences is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.sequences is true', () => {
			// Mock the TestConfig to enable sequences store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						sequences: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useSequencesStore: freshUseSequencesStore } = require('../../stores/useSequencesStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseSequencesStore.setState({ eventSequences: [{ id: '1' }] });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Sequences State:',
				expect.objectContaining({
					eventSequences: [{ id: '1' }],
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useSequencesStore());

			expect(result.current.eventSequences).toEqual([]);
			expect(result.current.loadingEventSequences).toBe(false);
			expect(result.current.userEventSequences).toEqual([]);
			expect(result.current.loadingUserEventSequences).toBe(false);
			expect(result.current.orgEventSequences).toEqual([]);
			expect(result.current.loadingOrgEventSequences).toBe(false);
			expect(result.current.currentSequence).toBeNull();
			expect(result.current.loadingCurrentSequence).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe('error handling', () => {
		it('should set and clear error state', () => {
			const { result } = renderHook(() => useSequencesStore());
			const mockError = new Error('Test error');

			act(() => {
				result.current.setError(mockError);
			});

			expect(result.current.error).toEqual(mockError);

			act(() => {
				result.current.setError(null);
			});

			expect(result.current.error).toBeNull();
		});

		it('should handle undefined error', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setError(undefined);
			});

			expect(result.current.error).toBeUndefined();
		});

		it('should handle string error', () => {
			const { result } = renderHook(() => useSequencesStore());
			const stringError = 'String error message';

			act(() => {
				result.current.setError(stringError);
			});

			expect(result.current.error).toEqual(stringError);
		});
	});

	describe('event sequences state management', () => {
		it('should update eventSequences state using setEventSequences', () => {
			const { result } = renderHook(() => useSequencesStore());
			const mockSequences: Sequence[] = [
				{
					id: '1',
					eventId: 'event1',
					event: {
						id: 'event1',
						title: 'Test Event 1',
						type: 'test',
						coverImg: 'cover1.jpg',
						orgOwner: {
							id: 'org1',
							name: 'Test Org 1',
						},
						venue: {
							id: 'venue1',
							name: 'Test Venue 1',
						},
					},
					packageId: 'pkg1',
					src: 'src1.mp4',
					m3u8: 'stream1.m3u8',
					preview: 'preview1.jpg',
					gif: 'preview1.gif',
					status: 'active',
					duration: 60,
					width: 1920,
					height: 1080,
					orientation: 'landscape',
					nsfw: false,
					created: new Date(),
					updated: new Date(),
				},
				{
					id: '2',
					eventId: 'event2',
					event: {
						id: 'event2',
						title: 'Test Event 2',
						type: 'test',
						coverImg: 'cover2.jpg',
						orgOwner: {
							id: 'org2',
							name: 'Test Org 2',
						},
						venue: {
							id: 'venue2',
							name: 'Test Venue 2',
						},
					},
					packageId: 'pkg2',
					src: 'src2.mp4',
					m3u8: 'stream2.m3u8',
					preview: 'preview2.jpg',
					gif: 'preview2.gif',
					status: 'active',
					duration: 120,
					width: 1920,
					height: 1080,
					orientation: 'landscape',
					nsfw: false,
					created: new Date(),
					updated: new Date(),
				},
			];

			act(() => {
				result.current.setEventSequences(mockSequences);
			});

			expect(result.current.eventSequences).toEqual(mockSequences);
		});

		it('should update loadingEventSequences state using setLoadingEventSequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setLoadingEventSequences(true);
			});

			expect(result.current.loadingEventSequences).toBe(true);

			act(() => {
				result.current.setLoadingEventSequences(false);
			});

			expect(result.current.loadingEventSequences).toBe(false);
		});

		it('should handle empty event sequences array', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setEventSequences([]);
			});

			expect(result.current.eventSequences).toEqual([]);
		});

		it('should handle null event sequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setEventSequences(null as any);
			});

			expect(result.current.eventSequences).toBeNull();
		});

		it('should handle undefined event sequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setEventSequences(undefined as any);
			});

			expect(result.current.eventSequences).toBeUndefined();
		});

		it('should replace existing event sequences', () => {
			const { result } = renderHook(() => useSequencesStore());
			const initialSequences = [{ id: '1', eventId: 'event1' } as any];
			const newSequences = [{ id: '2', eventId: 'event2' } as any];

			// Set initial sequences
			act(() => {
				result.current.setEventSequences(initialSequences);
			});

			expect(result.current.eventSequences).toEqual(initialSequences);

			// Replace with new sequences
			act(() => {
				result.current.setEventSequences(newSequences);
			});

			expect(result.current.eventSequences).toEqual(newSequences);
		});
	});

	describe('user event sequences state management', () => {
		it('should update userEventSequences state using setUserEventSequences', () => {
			const { result } = renderHook(() => useSequencesStore());
			const mockSequences: Sequence[] = [
				{
					id: '1',
					eventId: 'event1',
					event: {
						id: 'event1',
						title: 'Test Event 1',
						type: 'test',
						coverImg: 'cover1.jpg',
						orgOwner: {
							id: 'org1',
							name: 'Test Org 1',
						},
						venue: {
							id: 'venue1',
							name: 'Test Venue 1',
						},
					},
					packageId: 'pkg1',
					src: 'src1.mp4',
					m3u8: 'stream1.m3u8',
					preview: 'preview1.jpg',
					gif: 'preview1.gif',
					status: 'active',
					duration: 60,
					width: 1920,
					height: 1080,
					orientation: 'landscape',
					nsfw: false,
					created: new Date(),
					updated: new Date(),
				},
			];

			act(() => {
				result.current.setUserEventSequences(mockSequences);
			});

			expect(result.current.userEventSequences).toEqual(mockSequences);
		});

		it('should update loadingUserEventSequences state using setLoadingUserEventSequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setLoadingUserEventSequences(true);
			});

			expect(result.current.loadingUserEventSequences).toBe(true);

			act(() => {
				result.current.setLoadingUserEventSequences(false);
			});

			expect(result.current.loadingUserEventSequences).toBe(false);
		});

		it('should handle empty user event sequences array', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setUserEventSequences([]);
			});

			expect(result.current.userEventSequences).toEqual([]);
		});

		it('should handle null user event sequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setUserEventSequences(null as any);
			});

			expect(result.current.userEventSequences).toBeNull();
		});

		it('should handle undefined user event sequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setUserEventSequences(undefined as any);
			});

			expect(result.current.userEventSequences).toBeUndefined();
		});
	});

	describe('org event sequences state management', () => {
		it('should update orgEventSequences state using setOrgEventSequences', () => {
			const { result } = renderHook(() => useSequencesStore());
			const mockSequences: Sequence[] = [
				{
					id: '1',
					eventId: 'event1',
					event: {
						id: 'event1',
						title: 'Test Event 1',
						type: 'test',
						coverImg: 'cover1.jpg',
						orgOwner: {
							id: 'org1',
							name: 'Test Org 1',
						},
						venue: {
							id: 'venue1',
							name: 'Test Venue 1',
						},
					},
					packageId: 'pkg1',
					src: 'src1.mp4',
					m3u8: 'stream1.m3u8',
					preview: 'preview1.jpg',
					gif: 'preview1.gif',
					status: 'active',
					duration: 60,
					width: 1920,
					height: 1080,
					orientation: 'landscape',
					nsfw: false,
					created: new Date(),
					updated: new Date(),
				},
			];

			act(() => {
				result.current.setOrgEventSequences(mockSequences);
			});

			expect(result.current.orgEventSequences).toEqual(mockSequences);
		});

		it('should update loadingOrgEventSequences state using setLoadingOrgEventSequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setLoadingOrgEventSequences(true);
			});

			expect(result.current.loadingOrgEventSequences).toBe(true);

			act(() => {
				result.current.setLoadingOrgEventSequences(false);
			});

			expect(result.current.loadingOrgEventSequences).toBe(false);
		});

		it('should handle empty org event sequences array', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setOrgEventSequences([]);
			});

			expect(result.current.orgEventSequences).toEqual([]);
		});

		it('should handle null org event sequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setOrgEventSequences(null as any);
			});

			expect(result.current.orgEventSequences).toBeNull();
		});

		it('should handle undefined org event sequences', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setOrgEventSequences(undefined as any);
			});

			expect(result.current.orgEventSequences).toBeUndefined();
		});
	});

	describe('current sequence state management', () => {
		it('should update currentSequence state using setCurrentSequence', () => {
			const { result } = renderHook(() => useSequencesStore());
			const mockSequence: Sequence = {
				id: '1',
				eventId: 'event1',
				event: {
					id: 'event1',
					title: 'Test Event',
					type: 'test',
					coverImg: 'cover.jpg',
					orgOwner: {
						id: 'org1',
						name: 'Test Org',
					},
					venue: {
						id: 'venue1',
						name: 'Test Venue',
					},
				},
				packageId: 'pkg1',
				src: 'src.mp4',
				m3u8: 'stream.m3u8',
				preview: 'preview.jpg',
				gif: 'preview.gif',
				status: 'active',
				duration: 60,
				width: 1920,
				height: 1080,
				orientation: 'landscape',
				nsfw: false,
				created: new Date(),
				updated: new Date(),
			};

			act(() => {
				result.current.setCurrentSequence(mockSequence);
			});

			expect(result.current.currentSequence).toEqual(mockSequence);

			act(() => {
				result.current.setCurrentSequence(null);
			});

			expect(result.current.currentSequence).toBeNull();
		});

		it('should update loadingCurrentSequence state using setLoadingCurrentSequence', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setLoadingCurrentSequence(true);
			});

			expect(result.current.loadingCurrentSequence).toBe(true);

			act(() => {
				result.current.setLoadingCurrentSequence(false);
			});

			expect(result.current.loadingCurrentSequence).toBe(false);
		});

		it('should handle undefined current sequence', () => {
			const { result } = renderHook(() => useSequencesStore());

			act(() => {
				result.current.setCurrentSequence(undefined);
			});

			expect(result.current.currentSequence).toBeUndefined();
		});

		it('should handle string current sequence', () => {
			const { result } = renderHook(() => useSequencesStore());
			const stringSequence = 'string sequence';

			act(() => {
				result.current.setCurrentSequence(stringSequence as any);
			});

			expect(result.current.currentSequence).toEqual(stringSequence);
		});
	});

	describe('reset functionality', () => {
		it('should reset all state to initial values', () => {
			const { result } = renderHook(() => useSequencesStore());
			const mockSequence: Sequence = {
				id: '1',
				eventId: 'event1',
				event: {
					id: 'event1',
					title: 'Test Event',
					type: 'test',
					coverImg: 'cover.jpg',
					orgOwner: {
						id: 'org1',
						name: 'Test Org',
					},
					venue: {
						id: 'venue1',
						name: 'Test Venue',
					},
				},
				packageId: 'pkg1',
				src: 'src.mp4',
				m3u8: 'stream.m3u8',
				preview: 'preview.jpg',
				gif: 'preview.gif',
				status: 'active',
				duration: 60,
				width: 1920,
				height: 1080,
				orientation: 'landscape',
				nsfw: false,
				created: new Date(),
				updated: new Date(),
			};

			// Set some state using the setter functions
			act(() => {
				result.current.setEventSequences([mockSequence]);
				result.current.setLoadingEventSequences(true);
				result.current.setUserEventSequences([mockSequence]);
				result.current.setLoadingUserEventSequences(true);
				result.current.setOrgEventSequences([mockSequence]);
				result.current.setLoadingOrgEventSequences(true);
				result.current.setCurrentSequence(mockSequence);
				result.current.setLoadingCurrentSequence(true);
				result.current.setError(new Error('Test error'));
			});

			// Reset the store
			act(() => {
				result.current.resetSequences();
			});

			// Verify all state is reset
			expect(result.current.eventSequences).toEqual([]);
			expect(result.current.loadingEventSequences).toBe(false);
			expect(result.current.userEventSequences).toEqual([]);
			expect(result.current.loadingUserEventSequences).toBe(false);
			expect(result.current.orgEventSequences).toEqual([]);
			expect(result.current.loadingOrgEventSequences).toBe(false);
			expect(result.current.currentSequence).toBeNull();
			expect(result.current.loadingCurrentSequence).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useSequencesStore());

			// Verify initial state
			expect(result.current.eventSequences).toEqual([]);
			expect(result.current.loadingEventSequences).toBe(false);
			expect(result.current.userEventSequences).toEqual([]);
			expect(result.current.loadingUserEventSequences).toBe(false);
			expect(result.current.orgEventSequences).toEqual([]);
			expect(result.current.loadingOrgEventSequences).toBe(false);
			expect(result.current.currentSequence).toBeNull();
			expect(result.current.loadingCurrentSequence).toBe(false);
			expect(result.current.error).toBeNull();

			// Reset the store
			act(() => {
				result.current.resetSequences();
			});

			// Verify state remains at initial values
			expect(result.current.eventSequences).toEqual([]);
			expect(result.current.loadingEventSequences).toBe(false);
			expect(result.current.userEventSequences).toEqual([]);
			expect(result.current.loadingUserEventSequences).toBe(false);
			expect(result.current.orgEventSequences).toEqual([]);
			expect(result.current.loadingOrgEventSequences).toBe(false);
			expect(result.current.currentSequence).toBeNull();
			expect(result.current.loadingCurrentSequence).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useSequencesStore());
			const mockSequence: Sequence = {
				id: '1',
				eventId: 'event1',
				event: {
					id: 'event1',
					title: 'Test Event',
					type: 'test',
					coverImg: 'cover.jpg',
					orgOwner: {
						id: 'org1',
						name: 'Test Org',
					},
					venue: {
						id: 'venue1',
						name: 'Test Venue',
					},
				},
				packageId: 'pkg1',
				src: 'src.mp4',
				m3u8: 'stream.m3u8',
				preview: 'preview.jpg',
				gif: 'preview.gif',
				status: 'active',
				duration: 60,
				width: 1920,
				height: 1080,
				orientation: 'landscape',
				nsfw: false,
				created: new Date(),
				updated: new Date(),
			};

			// Set state using the setter functions
			act(() => {
				result.current.setEventSequences([mockSequence]);
				result.current.setLoadingEventSequences(true);
				result.current.setUserEventSequences([mockSequence]);
				result.current.setLoadingUserEventSequences(true);
				result.current.setOrgEventSequences([mockSequence]);
				result.current.setLoadingOrgEventSequences(true);
				result.current.setCurrentSequence(mockSequence);
				result.current.setLoadingCurrentSequence(true);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useSequencesStore());

			// State should be persisted
			expect(newResult.current.eventSequences).toEqual([mockSequence]);
			expect(newResult.current.loadingEventSequences).toBe(true);
			expect(newResult.current.userEventSequences).toEqual([mockSequence]);
			expect(newResult.current.loadingUserEventSequences).toBe(true);
			expect(newResult.current.orgEventSequences).toEqual([mockSequence]);
			expect(newResult.current.loadingOrgEventSequences).toBe(true);
			expect(newResult.current.currentSequence).toEqual(mockSequence);
			expect(newResult.current.loadingCurrentSequence).toBe(true);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useSequencesStore());

			expect(typeof result.current.setEventSequences).toBe('function');
			expect(typeof result.current.setLoadingEventSequences).toBe('function');
			expect(typeof result.current.setUserEventSequences).toBe('function');
			expect(typeof result.current.setLoadingUserEventSequences).toBe('function');
			expect(typeof result.current.setOrgEventSequences).toBe('function');
			expect(typeof result.current.setLoadingOrgEventSequences).toBe('function');
			expect(typeof result.current.setCurrentSequence).toBe('function');
			expect(typeof result.current.setLoadingCurrentSequence).toBe('function');
			expect(typeof result.current.resetSequences).toBe('function');
			expect(typeof result.current.setError).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useSequencesStore());

			expect(Array.isArray(result.current.eventSequences)).toBe(true);
			expect(typeof result.current.loadingEventSequences).toBe('boolean');
			expect(Array.isArray(result.current.userEventSequences)).toBe(true);
			expect(typeof result.current.loadingUserEventSequences).toBe('boolean');
			expect(Array.isArray(result.current.orgEventSequences)).toBe(true);
			expect(typeof result.current.loadingOrgEventSequences).toBe('boolean');
			expect(result.current.currentSequence).toBeNull();
			expect(typeof result.current.loadingCurrentSequence).toBe('boolean');
			expect(result.current.error).toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should handle large arrays of sequences', () => {
			const { result } = renderHook(() => useSequencesStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				id: `sequence-${index}`,
				eventId: `event-${index}`,
				event: {
					id: `event-${index}`,
					title: `Test Event ${index}`,
					type: 'test',
					coverImg: `cover${index}.jpg`,
					orgOwner: {
						id: `org-${index}`,
						name: `Test Org ${index}`,
					},
					venue: {
						id: `venue-${index}`,
						name: `Test Venue ${index}`,
					},
				},
				packageId: `pkg-${index}`,
				src: `src${index}.mp4`,
				m3u8: `stream${index}.m3u8`,
				preview: `preview${index}.jpg`,
				gif: `preview${index}.gif`,
				status: 'active',
				duration: 60,
				width: 1920,
				height: 1080,
				orientation: 'landscape',
				nsfw: false,
				created: new Date(),
				updated: new Date(),
			}));

			act(() => {
				result.current.setEventSequences(largeArray);
			});

			expect(result.current.eventSequences).toEqual(largeArray);
			expect(result.current.eventSequences).toHaveLength(1000);
		});

		it('should handle complex nested objects in sequences', () => {
			const { result } = renderHook(() => useSequencesStore());
			const complexSequence = {
				id: '1',
				eventId: 'event1',
				event: {
					id: 'event1',
					title: 'Complex Event',
					type: 'test',
					coverImg: 'cover.jpg',
					orgOwner: {
						id: 'org1',
						name: 'Complex Org',
						metadata: {
							description: 'A complex organization',
							tags: ['tag1', 'tag2', 'tag3'],
							settings: {
								feature1: true,
								feature2: false,
								nested: {
									deep: 'value',
									array: [1, 2, 3],
								},
							},
						},
					},
					venue: {
						id: 'venue1',
						name: 'Complex Venue',
						address: {
							street: '123 Main St',
							city: 'Test City',
							state: 'TS',
							zip: '12345',
						},
					},
				},
				packageId: 'pkg1',
				src: 'src.mp4',
				m3u8: 'stream.m3u8',
				preview: 'preview.jpg',
				gif: 'preview.gif',
				status: 'active',
				duration: 60,
				width: 1920,
				height: 1080,
				orientation: 'landscape',
				nsfw: false,
				created: new Date(),
				updated: new Date(),
			};

			act(() => {
				result.current.setCurrentSequence(complexSequence);
			});

			expect(result.current.currentSequence).toEqual(complexSequence);
		});

		it('should handle multiple rapid state changes', () => {
			const { result } = renderHook(() => useSequencesStore());

			// Perform multiple rapid state changes
			act(() => {
				result.current.setEventSequences([{ id: '1' } as any]);
				result.current.setLoadingEventSequences(true);
				result.current.setUserEventSequences([{ id: '2' } as any]);
				result.current.setLoadingUserEventSequences(true);
				result.current.setOrgEventSequences([{ id: '3' } as any]);
				result.current.setLoadingOrgEventSequences(true);
				result.current.setCurrentSequence({ id: '4' } as any);
				result.current.setLoadingCurrentSequence(true);
				result.current.setError('Test error');
			});

			// Verify all changes were applied correctly
			expect(result.current.eventSequences).toEqual([{ id: '1' }]);
			expect(result.current.loadingEventSequences).toBe(true);
			expect(result.current.userEventSequences).toEqual([{ id: '2' }]);
			expect(result.current.loadingUserEventSequences).toBe(true);
			expect(result.current.orgEventSequences).toEqual([{ id: '3' }]);
			expect(result.current.loadingOrgEventSequences).toBe(true);
			expect(result.current.currentSequence).toEqual({ id: '4' });
			expect(result.current.loadingCurrentSequence).toBe(true);
			expect(result.current.error).toEqual('Test error');
		});
	});
});
