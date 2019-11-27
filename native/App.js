import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import Application from './src/Application';
import { theme } from './src/core/theme';
import { persistor, store } from './src/store';

const loadResources = async () => {
	await Promise.all([
		Asset.loadAsync([
			require('./src/assets/images/robot-dev.png'),
			require('./src/assets/images/robot-prod.png'),
		]),
		Font.loadAsync({
			// This is the font that we are using for our tab bar
			...Ionicons.font,
			// We include SpaceMono because we use it in index.js. Feel free to
			// remove this if you are not using it in your app
			'space-mono': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
		}),
	]);
};

const handleLoadingError = (error) => {
	console.warn(error);
};

const handleFinishLoading = (setLoadingComplete) => {
	setLoadingComplete(true);
};

const App = (props) => {
	const [isLoadingComplete, setLoadingComplete] = useState(false);

	return (!isLoadingComplete && !props.skipLoadingScreen) ? (
		<AppLoading
			startAsync={loadResources}
			onError={handleLoadingError}
			onFinish={() => handleFinishLoading(setLoadingComplete)}
		/>
	) : (
		<ReduxProvider store={ store }>
			<PersistGate loading={null} persistor={ persistor }>
				<PaperProvider theme={theme}>
					<Application />
				</PaperProvider>
			</PersistGate>
		</ReduxProvider>
	);
};

export default App;