import { StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

export const style = StyleSheet.create({
	forgotPassword: {
		width: '100%',
		alignItems: 'flex-end',
		marginBottom: 24,
	},
	row: {
		flexDirection: 'row',
		marginTop: 4,
	},
	label: {
		color: theme.colors.secondary,
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
});
