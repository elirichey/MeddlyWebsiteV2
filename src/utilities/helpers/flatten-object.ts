export function flattenObject(obj: any, prefix = '', result: any = {}) {
	for (const key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

		const value = obj[key];
		const prefixedKey = prefix ? `${prefix}.${key}` : key;

		if (typeof value === 'object' && value !== null) {
			if (Array.isArray(value)) {
				value.forEach((item, index) => {
					flattenObject(item, `${prefixedKey}[${index}]`, result);
				});
			} else {
				flattenObject(value, prefixedKey, result);
			}
		} else {
			result[prefixedKey] = value;
		}
	}
	return result;
}
