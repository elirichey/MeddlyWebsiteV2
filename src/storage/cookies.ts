import { deleteCookie, getCookie, setCookie } from 'cookies-next';

const cookieStorage = {
	getItem: (name: string) => {
		const value = getCookie(name);
		// Handle both string and Promise return types from cookies-next
		if (typeof value === 'string') {
			return value ? JSON.parse(value) : null;
		}
		// If it's a Promise, we can't handle it synchronously, so return null
		// In a real app, you might want to use a different approach for async cookies
		return null;
	},
	setItem: (name: string, value: unknown) => setCookie(name, JSON.stringify(value), { maxAge: 7 * 24 * 60 * 60 }), // 7 days in seconds
	removeItem: (name: string) => deleteCookie(name),
};

// Helper function to safely get cookie value
export const getCookieValue = (name: string): string | null => {
	const value = getCookie(name);
	if (typeof value === 'string') {
		return value;
	}
	return null;
};

// Secure cookie functions for authentication
export const setSecureAuthCookie = (name: string, value: string) => {
	setCookie(name, value, {
		httpOnly: false, // cookies-next doesn't support httpOnly in client-side
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 15 * 60, // 15 minutes
	});
};

export const setSecureRefreshCookie = (name: string, value: string) => {
	setCookie(name, value, {
		httpOnly: false, // cookies-next doesn't support httpOnly in client-side
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 7 * 24 * 60 * 60, // 7 days
	});
};

export const removeSecureCookie = (name: string) => {
	deleteCookie(name);
};

export default cookieStorage;
