import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

import LogoPrimary from '../assets/images/app_icon_android.png';
import LogoSecondary from '../assets/images/app_icon_ios.png';

const Logo = ({ variant }) => (
	<Image source={ variant !== 'secondary' ? LogoPrimary : LogoSecondary } style={styles.image} />
);

const styles = StyleSheet.create({
	image: {
		width: 128,
		height: 128,
		marginBottom: 12,
	},
});

export default memo(Logo);
