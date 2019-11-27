import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection:'column',
	},
	topSpacer: {
		flex: 9
	},
	content: {
		flex: 1,
		fontWeight: '400',
		fontSize: 15,
		color: 'white',
		textAlign: 'center'
	},
	bottomSpacer: {
		flex: 2
	}
});