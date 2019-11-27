import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../core/theme';

const TextInput = ({ errorText, style, inputStyle, ...props }) => {
	if (!style) {
		style = {}
	}
	if (!inputStyle) {
		inputStyle = {}
	}
	const newStyles = StyleSheet.create({
		container: {
			...styles.container,
			...style
		},
		input: {
			...styles.input,
			...inputStyle
		}
	});

	return (
		<View style={newStyles.container}>
			<Input
				style={newStyles.input}
				selectionColor={theme.colors.secondary}
				underlineColor="transparent"
				mode="outlined"
				{...props}
			/>
			{errorText ? <Text style={styles.error}>{errorText}</Text> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginVertical: 10,
	},
	input: {
		backgroundColor: theme.colors.surface,
	},
	error: {
		fontSize: 14,
		color: theme.colors.error,
		paddingHorizontal: 4,
		paddingTop: 4,
	},
});

export default memo(TextInput);
