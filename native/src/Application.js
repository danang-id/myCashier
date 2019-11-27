import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Platform, StatusBar, SafeAreaView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { style } from './Application.style';
import { hideNotification, hideSignOutModal, setAccessToken, setLoading, showNotification } from './actions';
import { theme } from './core/theme';
import RootNavigation from './navigation/RootNavigation';
import Button from './components/Button';
import Paragraph from './components/Paragraph';
import PopUp from './components/PopUp';
import { signOut } from './services/AuthenticationAPI';

const SignOutModal = ({ navDispatch }) => {

	const accessToken = useSelector(state => state.root.accessToken);
	const isLoading = useSelector(state => state.root.isLoading);
	const dispatch = useDispatch();

	const handleSignOut = async () => {
		const clearAuth = () => {
			if (navDispatch !== null) {
				dispatch(setAccessToken(null));
				navDispatch(NavigationActions.navigate({
					routeName: 'Loading'
				}));
			}
		};
		try {
			dispatch(setLoading(true));
			const response = await signOut(accessToken);
			clearAuth();
			dispatch(showNotification({
				type: 'success',
				title: response.message
			}));
		} catch (error) {
			if (error.response && (
				error.response.code === 401 || error.response.code === 403
			)) {
				clearAuth();
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
		} finally {
			dispatch(setLoading(false));
		}
	};

	return (
		<View>
			<Paragraph color="black">Are you sure you want to sign out?</Paragraph>
			<Button
				color={theme.colors.error}
				dark={true}
				loading={isLoading}
				disabled={isLoading}
				mode="contained"
				onPress={handleSignOut}
			>
				Sign Out
			</Button>
		</View>
	)
};

const Application = () => {

	let navigator;
	const isSigningOut = useSelector(state => state.root.isSigningOut);
	const notification = useSelector(state => state.root.notification);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (isSigningOut) {
			dispatch(showNotification({
				component: (<SignOutModal navDispatch={navigator ? navigator.dispatch : null} />),
				title: 'Sign Out'
			}));
		}
	}, [ isSigningOut ]);

	const handleDismissNotification = () => {
		dispatch(hideNotification());
		dispatch(hideSignOutModal());
	};

	return (
		<SafeAreaView style={style.container}>
			{ Platform.OS === 'ios' && <StatusBar barStyle="default" /> }
			<RootNavigation ref={ nav => { navigator = nav; }} />
			<PopUp
				visible={notification !== null}
				title={notification !== null ? notification.title : ''}
				variant={notification !== null ? notification.type : 'info'}
				onDismiss={handleDismissNotification}
			>
				{
					notification !== null && !!notification.component ? notification.component : (
						<Paragraph color="black">{notification !== null ? notification.message : ''}</Paragraph>
					)
				}
			</PopUp>
		</SafeAreaView>
	)

};

export default Application;