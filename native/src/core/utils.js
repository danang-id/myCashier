
// @flow

import { showNotification } from '../actions';

export const emailAddressValidator = (email: string) => {
	const regExp = new RegExp(/\S+@\S+\.\S+/);

	if (!email || email.length <= 0) return 'Email address cannot be empty.';
	if (!regExp.test(email)) return 'We need a valid email address.';

	return '';
};

export const passwordValidator = (password: string) => {
	if (!password || password.length <= 0) return 'Password cannot be empty.';
	if (password.length < 8) return 'Password should contain minimum 8 characters.';
	return '';
};

export const passwordConfirmationValidator = (password: string, passwordConfirmation: string) => {
	if (password !== passwordConfirmation) return 'Please type the same password to confirm.';
	return '';
};

export const requiredValidator = (fieldName: string, value: string) => {
	if (!value || value.length <= 0) return fieldName + ' cannot be empty.';
	return '';
};

export const catchNetworkError = (error, navigation, dispatch) => {
	if (error.response && (
		error.response.code === 401 || error.response.code === 403
	)) {
		navigation.navigate('Guess');
		dispatch(showNotification({
			type: 'error',
			title: 'Something went wrong',
			message: 'Your session has been expired! Please sign in again.'
		}));
	} else {
		dispatch(showNotification({
			type: 'error',
			title: 'Something went wrong',
			message: error.message
		}));
	}
}