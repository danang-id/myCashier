import { StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

export const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	contentContainer: {
		paddingTop: 0,
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	searchContainer: {
		borderWidth: 1,
		borderColor: theme.colors.alternate,
		// borderRadius: 10,
		alignItems: 'center',
	},
	sortContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	sortButton: {
		flex: 1,
		marginHorizontal: 5,
	},
	listContainer: {
		marginVertical: 10
	},
	item: {
		width: '100%',
		marginVertical: 5
	},
	title: {
		fontWeight: 'bold'
	},
	shoppingCartButton: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: theme.colors.error
	},
	actionsContent: {
		flexDirection: 'row',
		width: '100%'
	},
	action: {
		flex: 1,
		padding: 0,
		margin: 0,
		borderRadius: 0
	},
	successText: {
		color: 'green'
	},
	warningText: {
		color: theme.colors.warning
	},
	errorText: {
		color: theme.colors.error
	}
});