import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import { style } from './style';
import Background from '../../../components/Background';
import BackButton from '../../../components/BackButton';
import Logo from '../../../components/Logo';
import Header from '../../../components/Header';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import { emailAddressValidator } from '../../../core/utils';
import { forgetPassword } from '../../../services/AuthenticationAPI';
import { setLoading, showNotification } from '../../../actions';

const ForgetPasswordScreen = ({ navigation }) => {

	const [emailAddress, setEmailAddress] = useState({ value: '', error: '' });

	const isLoading = useSelector(state => state.root.isLoading);
	const dispatch = useDispatch();

	const onRecoverPressed = async () => {
		const emailAddressError = emailAddressValidator(emailAddress.value);

		if (emailAddressError) {
			setEmailAddress({ ...emailAddress, error: emailAddressError });
			return;
		}

		try {
			dispatch(setLoading(true));
			const response = await forgetPassword(emailAddress.value);
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
		<Background>
			<BackButton goBack={() => navigation.navigate('SignIn')} />

			<Logo />

			<Header>Recover Account</Header>

			<TextInput
				label="Email address"
				returnKeyType="done"
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

			<Button loading={isLoading} disabled={isLoading} mode="contained" onPress={onRecoverPressed} style={style.button}>
				Recover
			</Button>

			<TouchableOpacity
				style={style.back}
				disabled={isLoading}
				onPress={() => navigation.navigate('SignIn')}
			>
				<Text style={style.label}>← Back to sign in</Text>
			</TouchableOpacity>
		</Background>
	);
};

export default memo(ForgetPasswordScreen);
