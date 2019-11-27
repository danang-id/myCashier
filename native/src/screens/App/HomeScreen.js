import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { MonoText } from '../../components/StyledText';
import Button from '../../components/Button';
import PopUp from '../../components/PopUp';
import {setAccessToken, showNotification, showSignOutModal} from '../../actions';
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";

const HomeScreen = ({ navigation }) => {

	const accessToken = useSelector(state => state.root.accessToken);
	const dispatch = useDispatch();

	const handleSignOut = () => {
		dispatch(showSignOutModal());
	};

	const handleShowNotification = () => {
		dispatch(showNotification({
			message: 'Hi!',
			title: 'Title',
			type: 'info'
		}));
	};

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.contentContainer}>
				<View style={styles.welcomeContainer}>
					<Image
						source={
							__DEV__
								? require('../../assets/images/robot-dev.png')
								: require('../../assets/images/robot-prod.png')
						}
						style={styles.welcomeImage}
					/>
				</View>

				<View style={styles.getStartedContainer}>
					<DevelopmentModeNotice />

					<Text style={styles.getStartedText}>Get started by opening</Text>

					<View
						style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
						<MonoText>screens/HomeScreen.js</MonoText>
					</View>

					<Text style={styles.getStartedText}>
						Change this text and your app will automatically reload.
					</Text>
				</View>

				<View style={styles.helpContainer}>
					<Button mode="contained" onPress={handleSignOut}>
						Sign Out
					</Button>
				</View>

				<View style={styles.helpContainer}>
					<Button mode="contained" onPress={handleShowNotification}>
						Show Notification
					</Button>
				</View>
			</ScrollView>


		</View>
	);
};

HomeScreen.navigationOptions = {
	header: null,
};

const DevelopmentModeNotice = () => {
	if (__DEV__) {
		const learnMoreButton = (
			<Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
				Learn more
			</Text>
		);

		return (
			<Text style={styles.developmentModeText}>
				Development mode is enabled: your app will be slower but you can use
				useful development tools. {learnMoreButton}
			</Text>
		);
	} else {
		return (
			<Text style={styles.developmentModeText}>
				You are not in development mode: your app will run at full speed.
			</Text>
		);
	}
};

function handleLearnMorePress() {
	WebBrowser.openBrowserAsync(
		'https://docs.expo.io/versions/latest/workflow/development-mode/'
	);
}

function handleHelpPress() {
	WebBrowser.openBrowserAsync(
		'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	developmentModeText: {
		marginBottom: 20,
		color: 'rgba(0,0,0,0.4)',
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center',
	},
	contentContainer: {
		paddingTop: 30,
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	welcomeImage: {
		width: 100,
		height: 80,
		resizeMode: 'contain',
		marginTop: 3,
		marginLeft: -10,
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50,
	},
	homeScreenFilename: {
		marginVertical: 7,
	},
	codeHighlightText: {
		color: 'rgba(96,100,109, 0.8)',
	},
	codeHighlightContainer: {
		backgroundColor: 'rgba(0,0,0,0.05)',
		borderRadius: 3,
		paddingHorizontal: 4,
	},
	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center',
	},
	navigationFilename: {
		marginTop: 5,
	},
	helpContainer: {
		marginTop: 15,
		alignItems: 'center',
	},
	helpLink: {
		paddingVertical: 15,
	},
	helpLinkText: {
		fontSize: 14,
		color: '#2e78b7',
	},
});

export default HomeScreen;