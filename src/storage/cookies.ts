import Cookies from 'js-cookie';

const cookieStorage = {
	getItem: (name: string) => {
		const value = Cookies.get(name);
		return value ? JSON.parse(value) : null;
	},
	setItem: (name: string, value: unknown) => Cookies.set(name, JSON.stringify(value), { expires: 7 }),
	removeItem: (name: string) => Cookies.remove(name),
};

export default cookieStorage;
