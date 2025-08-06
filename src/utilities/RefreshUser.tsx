import { deleteCookie } from 'cookies-next';
import type { NextRouter } from 'next/router';
import AuthUserHTTP from './http/user/auth';
import { getCookieValue } from '@/storage/cookies';

export default async function refreshUser(router: NextRouter) {
	const logout = () => {
		const accessToken = getCookieValue('accessToken');
		const refreshToken = getCookieValue('refreshToken');

		const roleCookie = getCookieValue('role');
		const userCookie = getCookieValue('user');

		const user = userCookie ? JSON.parse(userCookie) : null;
		const role = roleCookie ? JSON.parse(roleCookie) : null;

		user ? deleteCookie('user') : null;
		accessToken ? deleteCookie('accessToken') : null;
		refreshToken ? deleteCookie('refreshToken') : null;
		role ? deleteCookie('role') : null;
		return router.push('/');
	};

	const refreshUser = async () => {
		const refreshToken = getCookieValue('refreshToken');
		try {
			const res = await AuthUserHTTP.refreshUser(refreshToken);
			if (res.status === 200 || res.status === 201) {
				console.log('User Refreshed');
			} else {
				if (res.status === 400) {
					console.log('Refresh Token Expired');
					return logout();
				}
				console.warn('User Refresh Error:', res);
				return res;
			}
		} catch (e) {
			console.error('Refresh User Error', e);
			return e;
		}
	};

	return refreshUser();
}
