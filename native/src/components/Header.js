import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../core/theme';

const Header = ({ children, color, style }) => {
	const styles = StyleSheet.create({
		header: {
			fontSize: 26,
			color: color ? color : theme.colors.primary,
			fontWeight: 'bold',
			paddingVertical: 14,
		},
	});
	return <Text style={[styles.header, style]}>{children}</Text>;
};

export default memo(Header);
