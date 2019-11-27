import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { style } from './style';
import { showSignOutModal } from '../../../actions';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import { theme } from '../../../core/theme';

const ProfileScreen = () => {

	const isSigningOut = useSelector(state => state.root.isSigningOut);
	const emailAddress = useSelector(state => state.root.emailAddress);
	const dispatch = useDispatch();

	const handleSignOut = () => {
		dispatch(showSignOutModal());
	};

	return (
		<View style={style.container}>
			<Header style={style.header}>{emailAddress}</Header>
			<Button
				color={theme.colors.error}
				dark={true}
				style={style.button}
				mode="contained"
				onPress={handleSignOut}
				disabled={isSigningOut}
			>Sign Out</Button>
		</View>
	);
};

ProfileScreen.navigationOptions = {
	title: 'Profile',
};

export default ProfileScreen;