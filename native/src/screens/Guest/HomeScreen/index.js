import React, { memo } from 'react';

import  { style } from './style';
import Background from '../../../components/Background';
import Logo from '../../../components/Logo';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import Paragraph from '../../../components/Paragraph';

const HomeScreen = ({ navigation }) => (
	<Background>
		<Logo/>
		<Header>myCashier</Header>

		<Paragraph style={style.paragraph}>
			An intuitive point of sales application.
		</Paragraph>
		<Button mode="contained" onPress={() => navigation.navigate('SignIn')}>
			Sign In
		</Button>
		<Button
			mode="outlined"
			onPress={() => navigation.navigate('Register')}
		>
			Register
		</Button>
	</Background>
);

export default memo(HomeScreen);