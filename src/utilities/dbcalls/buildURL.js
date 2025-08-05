export const buildURL = (name, uuid, img, price) => {
	const base = '/api/checkout_sessions?';
	const _name = `name=${name}`;
	const _uuid = `uuid=${uuid}`;
	const _img = `img=${img}`;
	const _price = `price=${Number.parseInt(price.replace('$', '').replace('.', ''))}`;
	return encodeURI([base, _name, _img, _uuid, _price].join('&'));
};
