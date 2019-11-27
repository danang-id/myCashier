
import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

import Dummy from '../assets/images/app_icon_ios.png';
import {theme} from "../core/theme";

const styles = StyleSheet.create({
	container: {
		margin: 0,
		flex: 1,
		flexDirection: 'row',
	},
	imageContainer: {
		height: 75,
		width: 75
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'column',
		height: '100%'
	},
	tagText: {
		flex: 1,
		fontWeight: 'bold',
		fontSize: 10,
		marginHorizontal: 10,
		marginTop: 5,
		color:  theme.colors.error,
	},
	nameText: {
		flex: 1,
		fontWeight: 'bold',
		marginHorizontal: 10,
		marginTop: 5,
	},
	descriptionText: {
		flex: 1,
		marginHorizontal: 10,
		marginTop: 5,
	},
	actionsContainer: {
		marginHorizontal: 10,
		marginTop: 5,
	},
});

const Item = ({ image, name, description, style, tag, onPress, children, disabled }) => {
	const newStyle = StyleSheet.create({
		container: {
			...styles.container,
			...style
		}
	});
	return (
		<View style={newStyle.container} onPress={onPress}>
			<Image style={styles.imageContainer} source={!!image ? { uri: image } : Dummy} />
			<View style={styles.contentContainer}>
				<Text style={styles.tagText}>{tag.toUpperCase()}</Text>
				<Text style={styles.nameText}>{name}</Text>
				<Text style={styles.descriptionText}>{description}</Text>
				<View style={styles.actionsContainer}>{ children }</View>
			</View>
		</View>
	);
};

export default Item;