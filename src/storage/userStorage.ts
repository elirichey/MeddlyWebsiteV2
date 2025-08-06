// User storage utility for consistent user data handling
export const getUserData = () => {
	try {
		const userData = localStorage.getItem('user');
		return userData ? JSON.parse(userData) : null;
	} catch (error) {
		console.error('Error parsing user data:', error);
		return null;
	}
};

export const setUserData = (user: any) => {
	try {
		localStorage.setItem('user', JSON.stringify(user));
	} catch (error) {
		console.error('Error storing user data:', error);
	}
};

export const removeUserData = () => {
	try {
		localStorage.removeItem('user');
	} catch (error) {
		console.error('Error removing user data:', error);
	}
};

// Legacy support - fallback to cookie if localStorage is not available
export const getUserDataWithFallback = () => {
	const userData = getUserData();
	if (userData) {
		return userData;
	}

	// Fallback to cookie for backward compatibility
	try {
		const { getCookie } = require('cookies-next');
		const userCookie = getCookie('user');
		return userCookie ? JSON.parse(userCookie) : null;
	} catch (error) {
		console.error('Error getting user data from cookie:', error);
		return null;
	}
};
