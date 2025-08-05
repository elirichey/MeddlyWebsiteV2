import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';

// General
export const required = (value: any) => (value ? undefined : 'Required');
export const composeValidators = (...validators: any) => {
	return (value: any) => {
		return validators.reduce((error: any, validator: any) => error || validator(value), undefined);
	};
};

// Not Empty
export const notEmpty = (val: any | undefined) => {
	return isEmpty(val) ? 'Field cannot be empty' : undefined;
};

// Email
export const mustBeEmail = (val: string) => {
	if (val) return isEmail(val) ? undefined : 'Invalid Email';
	return 'Invalid Email';
};

// Phone Number
export const mustBePhone = async (val: any) => {
	let numb = val.match(/\d/g);
	numb = numb.join('');
	if (numb.length < 10) return 'Invalid Phone Number';
	return undefined;
};

// Cannot be Value
export const cannotBeValue = async (val: any) => {
	const cannotBeValue = '(Select)';
	if (val === cannotBeValue) return 'Please choose a value';
	return undefined;
};

// Password
// - Validation lives in the password input file
//   because it also updates state for checking
//   password strength
