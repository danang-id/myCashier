import React, { memo } from 'react';
import {
	ImageBackground,
	StyleSheet,
	KeyboardAvoidingView,
	ScrollView,
	View
} from 'react-native';

import BackgroundImage from '../assets/images/background_dot.png';

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: '100%',
		height: '100%'
	},
	scrollView: {
		// marginBottom: 40,
		// height: '100%',
	},
	container: {
		flex: 1,
		padding: 20,
		marginBottom: 20,
		width: '100%',
		maxWidth: 340,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const Background = ({ children, useScroll, source, resizeMode, color }) => {
	if (useScroll === void 0) {
		useScroll = false;
	}
	let viewStyle;
	if (!color) {
		viewStyle = StyleSheet.create({
			background: {
				...styles.background,
				backgroundColor: color
			}
		});
	}
	if (!source) {
		source = BackgroundImage;
	}
	if (!resizeMode) {
		resizeMode = 'repeat';
	}
	const useBackgroundImage = !!source || !!resizeMode;

	const content = useScroll
		? <ScrollView style={styles.scrollView}><View style={styles.container}>{ children }</View></ScrollView>
		: <KeyboardAvoidingView style={styles.container} behavior="padding">{ children }</KeyboardAvoidingView>;

	return useBackgroundImage
		? <ImageBackground source={source} resizeMode={resizeMode} style={styles.background}>{ content }</ImageBackground>
		: <View style={viewStyle.background} >{ content }</View>;
};

export default memo(Background);
