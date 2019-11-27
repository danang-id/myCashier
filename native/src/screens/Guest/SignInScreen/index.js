import React, { memo, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { style } from './style';
import Background from '../../../components/Background';
import Logo from '../../../components/Logo';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import BackButton from '../../../components/BackButton';
import { emailAddressValidator, passwordValidator } from '../../../core/utils';
import {setAccessToken, setLoading, showNotification} from '../../../actions';
import { signIn } from "'./../../services/AuthenticationAPI";

const SignInScreen = ({ navigation }) => {

	const [emailAddress, setEmailAddress] = useState({ value: '', error: '' });
	const [password, setPassword] = useState({ value: '', error: '' });

	const isLoading = useSelector(state => state.root.isLoading);
	const dispatch = useDispatch();

	const handleSignInPressed = async () => {
		const emailAddressError = emailAddressValidator(emailAddress.value);
		const passwordError = passwordValidator(password.value);

		if (emailAddressError || passwordError) {
			setEmailAddress({ ...emailAddress, error: emailAddressError });
			setPassword({ ...password, error: passwordError });
			return;
		}

		try {
			dispatch(setLoading(true));
			const response = await signIn(emailAddress.value, password.value);
			await dispatch(setAccessToken(response.data.token, emailAddress.value));
			navigation.navigate('App');
			dispatch(showNotification({
				type: 'success',
				title: response.message
			}));
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
		<Background>
			<BackButton goBack={() => navigation.navigate('Home')} />

			<Logo />

			<Header>Welcome back!</Header>

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

			<View style={style.forgotPassword}>
				<TouchableOpacity
					disabled={isLoading}
					onPress={() => navigation.navigate('ForgetPassword')}
				>
					<Text style={style.label}>Forget your password?</Text>
				</TouchableOpacity>
			</View>

			<Button loading={isLoading} disabled={isLoading} mode="contained" onPress={handleSignInPressed}>
				Sign In
			</Button>

			<View style={style.row}>
				<Text style={style.label}>Don’t have an account? </Text>
				<TouchableOpacity disabled={isLoading} onPress={() => navigation.navigate('Register')}>
					<Text style={style.link}>Sign up</Text>
				</TouchableOpacity>
			</View>
		</Background>
	);
};

export default memo(SignInScreen);
