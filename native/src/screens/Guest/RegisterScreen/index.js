import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import { style } from './style';
import Background from '../../../components/Background';
import Logo from '../../../components/Logo';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import BackButton from '../../../components/BackButton';
import {
	emailAddressValidator, passwordConfirmationValidator,
	passwordValidator,
	requiredValidator,
} from '../../../core/utils';
import { register } from '../../../services/AuthenticationAPI';
import { setLoading, showNotification } from '../../../actions';

const RegisterScreen = ({ navigation }) => {

	const [givenName, setGivenName] = useState({ value: '', error: '' });
	const [maidenName, setMaidenName] = useState({ value: '', error: '' });
	const [emailAddress, setEmailAddress] = useState({ value: '', error: '' });
	const [password, setPassword] = useState({ value: '', error: '' });
	const [passwordConfirmation, setPasswordConfirmation] = useState({ value: '', error: '' });

	const isLoading = useSelector(state => state.root.isLoading);
	const dispatch = useDispatch();

	const handleRegisterPressed = async () => {
		const givenNameError = requiredValidator('Given Name', givenName.value);
		const maidenNameError = requiredValidator('Maiden Name', maidenName.value);
		const emailAddressError = emailAddressValidator(emailAddress.value);
		const passwordError = passwordValidator(password.value);
		const passwordConfirmationError = passwordConfirmationValidator(password.value, passwordConfirmation.value);

		if (givenNameError || maidenNameError || emailAddressError || passwordError || passwordConfirmationError) {
			setGivenName({ ...givenName, error: givenNameError });
			setMaidenName({ ...maidenName, error: maidenNameError });
			setEmailAddress({ ...emailAddress, error: emailAddressError });
			setPassword({ ...password, error: passwordError });
			setPasswordConfirmation({ ...passwordConfirmation, error: passwordConfirmationError });
			return;
		}

		try {
			dispatch(setLoading(true));
			const response = await register(
				givenName.value,
				maidenName.value,
				emailAddress.value,
				password.value,
				passwordConfirmation.value,
			);
			dispatch(showNotification({
				type: 'success',
				title: response.message
			}));
			navigation.navigate('SignIn');
		} catch (error) {
			dispatch(showNotification({
				type: 'error',
				title: 'Something went wrong',
				message: error.message
			}));
		} finally {
			dispatch(setLoading(false));
		}

	};

	return (
		<Background useScroll={true}>
			<BackButton goBack={() => navigation.navigate('Home')} />

			<Logo />

			<Header>Create Account</Header>

			<TextInput
				label="Given Name"
				returnKeyType="next"
				value={givenName.value}
				onChangeText={text => setGivenName({ value: text, error: '' })}
				error={!!givenName.error}
				errorText={givenName.error}
				disabled={isLoading}
			/>

			<TextInput
				label="Maiden Name"
				returnKeyType="next"
				value={maidenName.value}
				onChangeText={text => setMaidenName({ value: text, error: '' })}
				error={!!maidenName.error}
				errorText={maidenName.error}
				disabled={isLoading}
			/>

			<TextInput
				label="Email Address"
				returnKeyType="next"
				value={emailAddress.value}
				onChangeText={text => setEmailAddress({ value: text, error: '' })}
				error={!!emailAddress.error}
				errorText={emailAddress.error}
				autoCapitalize="none"
				autoCompleteType="email"
				textContentType="emailAddress"
				keyboardType="email-address"
				disabled={isLoading}
			/>

			<TextInput
				label="Password"
				returnKeyType="done"
				value={password.value}
				onChangeText={text => setPassword({ value: text, error: '' })}
				error={!!password.error}
				errorText={password.error}
				secureTextEntry
				disabled={isLoading}
			/>

			<TextInput
				label="Re-type Password"
				returnKeyType="done"
				value={passwordConfirmation.value}
				onChangeText={text => setPasswordConfirmation({ value: text, error: '' })}
				error={!!passwordConfirmation.error}
				errorText={passwordConfirmation.error}
				secureTextEntry
				disabled={isLoading}
			/>

			<Button loading={isLoading} disabled={isLoading} mode="contained" onPress={handleRegisterPressed} style={style.button}>
				Register
			</Button>

			<View style={style.row}>
				<Text style={style.label}>Already have an account? </Text>
				<TouchableOpacity disabled={isLoading} onPress={() => navigation.navigate('SignIn')}>
					<Text style={style.link}>Sign In</Text>
				</TouchableOpacity>
			</View>
		</Background>
	);
};

export default memo(RegisterScreen);
