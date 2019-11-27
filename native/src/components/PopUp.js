
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, DefaultTheme } from 'react-native-paper';

import Header from './Header';
import { theme } from '../core/theme';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		...Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { width: 0, height: -3 },
				shadowOpacity: 0.1,
				shadowRadius: 3,
			},
			android: {
				elevation: 20,
			},
		}),
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '#fbfbfb',
		padding: 20,
	},
	iconButton: {
		position: 'absolute',
		right: 0
	},
	viewContent: {
		marginRight: 40
	}
});

const PopUp = ({ children, title, variant, visible, onDismiss }) => {
	let color = theme.colors.primary;
	switch (variant) {
		case 'success':
			color = 'green'; break;
		case 'warning':
			color = theme.colors.warning; break;
		case 'error':
			color = theme.colors.error; break;
		default:
			color = theme.colors.primary;
	}

	return (
		<Portal>
			<Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
				<ScrollView>
					{ !title ? <></> : <Header color={color} style={styles.viewContent}>{ title }</Header> }
					<IconButton
						icon="close"
						color="black"
						size={20}
						style={styles.iconButton}
						onPress={onDismiss}
					/>
					<View style={!title ? styles.viewContent : {}}>{ children }</View>
				</ScrollView>
			</Modal>
		</Portal>
	);
};

PopUp.propTypes = {
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
	visible: PropTypes.bool.isRequired,
	onDismiss: PropTypes.func.isRequired,
	title: PropTypes.string,
	variant: PropTypes.string,
};

export default PopUp;
