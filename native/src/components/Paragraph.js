import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../core/theme';

const Paragraph = ({ children, color, style }) => {
	const styles = StyleSheet.create({
		text: {
			fontSize: 16,
			lineHeight: 26,
			color: color ? color : theme.colors.secondary,
			marginBottom: 14,
		},
	});
	return <Text style={[styles.text, style]}>{children}</Text>;
};

export default memo(Paragraph);
