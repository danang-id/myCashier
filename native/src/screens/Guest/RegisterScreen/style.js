import { StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

export const style = StyleSheet.create({
	label: {
		color: theme.colors.secondary,
	},
	button: {
		marginTop: 24,
	},
	row: {
		flexDirection: 'row',
		marginTop: 4,
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
});