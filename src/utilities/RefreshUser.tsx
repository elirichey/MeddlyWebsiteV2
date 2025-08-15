import type { NextRouter } from 'next/router';
import AuthUserHTTP from '@/utilities/http/auth';

export default async function refreshUser(router: NextRouter) {
	const refreshUser = async () => {
		try {
			const res = await AuthUserHTTP.refreshUser();
			if (res.status === 200 || res.status === 201) {
				console.log('User Refreshed');
			} else {
				if (res.status === 400) {
					console.log('Refresh Token Expired');
					await AuthUserHTTP.signOut();
					router.push('/');
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
