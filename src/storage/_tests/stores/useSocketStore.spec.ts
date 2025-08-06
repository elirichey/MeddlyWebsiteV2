import { renderHook, act } from '@testing-library/react-hooks';
import { useSocketStore } from '../../stores/useSocketStore';
import type { SocketSession } from '../../../interfaces/Socket';

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('useSocketStore', () => {
	let consoleLogSpy: jest.SpyInstance;
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useSocketStore.getState().resetSocket();
		});

		// Setup console spies
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
	});

	afterEach(() => {
		// Restore console methods
		consoleLogSpy.mockRestore();
		consoleErrorSpy.mockRestore();
	});

	afterAll(() => {
		// Restore original console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('test configuration', () => {
		it('should not log state when TestConfig.stores.socket is false', () => {
			// TestConfig.stores.socket is false by default
			const { result } = renderHook(() => useSocketStore());
			const mockSession: SocketSession = {
				id: '123',
				sessionId: 'session-123',
				eventId: 'event-123',
				userId: 'user-123',
				isRecording: false,
				isActive: true,
			};

			act(() => {
				result.current.createSocketSession(mockSession);
			});

			// Should only have logged the createSocketSession call, not the subscription
			expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', mockSession);
			// The subscription should not have been called since TestConfig.stores.socket is false
		});

		it('should log state when TestConfig.stores.socket is true', () => {
			// Mock the TestConfig to enable socket store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						socket: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useSocketStore: freshUseSocketStore } = require('../../stores/useSocketStore');

			// Trigger a state change directly on the store
			const mockSession: SocketSession = {
				id: '123',
				sessionId: 'session-123',
				eventId: 'event-123',
				userId: 'user-123',
				isRecording: false,
				isActive: true,
			};

			act(() => {
				freshUseSocketStore.setState({ session: mockSession, error: null });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Socket State:',
				expect.objectContaining({
					session: mockSession,
					error: null,
				}),
			);
		});
	});

	it('should initialize with default values', () => {
		const { result } = renderHook(() => useSocketStore());

		expect(result.current.session).toBeNull();
		expect(result.current.error).toBeNull();
	});

	it('should create a socket session and log to console', () => {
		const { result } = renderHook(() => useSocketStore());
		const mockSession: SocketSession = {
			id: '123',
			sessionId: 'session-123',
			eventId: 'event-123',
			userId: 'user-123',
			isRecording: false,
			isActive: true,
		};

		act(() => {
			result.current.createSocketSession(mockSession);
		});

		expect(result.current.session).toEqual(mockSession);
		expect(result.current.error).toBeNull();
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', mockSession);
	});

	it('should update an existing socket session and log to console', () => {
		const { result } = renderHook(() => useSocketStore());
		const initialSession: SocketSession = {
			id: '123',
			sessionId: 'session-123',
			eventId: 'event-123',
			userId: 'user-123',
			isRecording: false,
			isActive: true,
		};

		const updatedSession: SocketSession = {
			...initialSession,
			isRecording: true,
		};

		act(() => {
			result.current.createSocketSession(initialSession);
			result.current.updateSocketSession(updatedSession);
		});

		expect(result.current.session).toEqual(updatedSession);
		expect(result.current.error).toBeNull();
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', initialSession);
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Updating session:', updatedSession);
	});

	it('should log socket errors to console.error', () => {
		const { result } = renderHook(() => useSocketStore());
		const mockError = new Error('Socket connection failed');

		act(() => {
			result.current.logSocketError(mockError);
		});

		expect(result.current.error).toEqual(mockError);
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', mockError);
	});

	it('should reset socket state and log to console', () => {
		const { result } = renderHook(() => useSocketStore());
		const mockSession: SocketSession = {
			id: '123',
			sessionId: 'session-123',
			eventId: 'event-123',
			userId: 'user-123',
			isRecording: false,
			isActive: true,
		};

		act(() => {
			result.current.createSocketSession(mockSession);
			result.current.logSocketError(new Error('Test error'));
			result.current.resetSocket();
		});

		expect(result.current.session).toBeNull();
		expect(result.current.error).toBeNull();
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', mockSession);
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', new Error('Test error'));
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Resetting socket');
	});

	it('should disconnect socket and log to console', () => {
		const { result } = renderHook(() => useSocketStore());
		const mockSession: SocketSession = {
			id: '123',
			sessionId: 'session-123',
			eventId: 'event-123',
			userId: 'user-123',
			isRecording: false,
			isActive: true,
		};

		act(() => {
			result.current.createSocketSession(mockSession);
			result.current.logSocketError(new Error('Test error'));
			result.current.disconnectSocket();
		});

		expect(result.current.session).toBeNull();
		expect(result.current.error).toBeNull();
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', mockSession);
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', new Error('Test error'));
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Disconnecting socket');
	});

	it('should maintain state between renders', () => {
		const { result, rerender } = renderHook(() => useSocketStore());
		const mockSession: SocketSession = {
			id: '123',
			sessionId: 'session-123',
			eventId: 'event-123',
			userId: 'user-123',
			isRecording: false,
			isActive: true,
		};

		act(() => {
			result.current.createSocketSession(mockSession);
		});

		rerender();

		expect(result.current.session).toEqual(mockSession);
		expect(result.current.error).toBeNull();
	});

	it('should clear error when creating a new session', () => {
		const { result } = renderHook(() => useSocketStore());
		const mockError = new Error('Previous error');
		const mockSession: SocketSession = {
			id: '123',
			sessionId: 'session-123',
			eventId: 'event-123',
			userId: 'user-123',
			isRecording: false,
			isActive: true,
		};

		act(() => {
			result.current.logSocketError(mockError);
			result.current.createSocketSession(mockSession);
		});

		expect(result.current.session).toEqual(mockSession);
		expect(result.current.error).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', mockError);
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', mockSession);
	});

	it('should clear error when updating a session', () => {
		const { result } = renderHook(() => useSocketStore());
		const mockError = new Error('Previous error');
		const mockSession: SocketSession = {
			id: '123',
			sessionId: 'session-123',
			eventId: 'event-123',
			userId: 'user-123',
			isRecording: false,
			isActive: true,
		};

		act(() => {
			result.current.logSocketError(mockError);
			result.current.updateSocketSession(mockSession);
		});

		expect(result.current.session).toEqual(mockSession);
		expect(result.current.error).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', mockError);
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Updating session:', mockSession);
	});

	it('should handle null error values', () => {
		const { result } = renderHook(() => useSocketStore());

		act(() => {
			result.current.logSocketError(null);
		});

		expect(result.current.error).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', null);
	});

	it('should handle undefined error values', () => {
		const { result } = renderHook(() => useSocketStore());

		act(() => {
			result.current.logSocketError(undefined);
		});

		expect(result.current.error).toBeUndefined();
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', undefined);
	});

	it('should handle string error values', () => {
		const { result } = renderHook(() => useSocketStore());
		const stringError = 'String error message';

		act(() => {
			result.current.logSocketError(stringError);
		});

		expect(result.current.error).toBe(stringError);
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', stringError);
	});

	it('should handle object error values', () => {
		const { result } = renderHook(() => useSocketStore());
		const objectError = { message: 'Object error', code: 500 };

		act(() => {
			result.current.logSocketError(objectError);
		});

		expect(result.current.error).toEqual(objectError);
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', objectError);
	});

	it('should handle complete SocketSession object with all properties', () => {
		const { result } = renderHook(() => useSocketStore());
		const completeSession: SocketSession = {
			id: 'complete-123',
			sessionId: 'complete-session-123',
			eventId: 'complete-event-123',
			userId: 'complete-user-123',
			isRecording: true,
			isActive: false,
		};

		act(() => {
			result.current.createSocketSession(completeSession);
		});

		expect(result.current.session).toEqual(completeSession);
		expect(result.current.error).toBeNull();
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', completeSession);
	});

	it('should handle multiple rapid state changes', () => {
		const { result } = renderHook(() => useSocketStore());
		const session1: SocketSession = {
			id: '1',
			sessionId: 'session-1',
			eventId: 'event-1',
			userId: 'user-1',
			isRecording: false,
			isActive: true,
		};
		const session2: SocketSession = {
			id: '2',
			sessionId: 'session-2',
			eventId: 'event-2',
			userId: 'user-2',
			isRecording: true,
			isActive: false,
		};

		act(() => {
			result.current.createSocketSession(session1);
			result.current.updateSocketSession(session2);
			result.current.logSocketError(new Error('Rapid error'));
			result.current.resetSocket();
		});

		expect(result.current.session).toBeNull();
		expect(result.current.error).toBeNull();
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Creating session:', session1);
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Updating session:', session2);
		expect(consoleErrorSpy).toHaveBeenCalledWith('[SocketStore] Logging error:', new Error('Rapid error'));
		expect(consoleLogSpy).toHaveBeenCalledWith('[SocketStore] Resetting socket');
	});
});
