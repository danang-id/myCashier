import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import TransactionScreen from '../screens/App/TransactionScreen';
import CartScreen from '../screens/App/TransactionScreen';
import LinksScreen from '../screens/App/LinksScreen';
import ProfileScreen from '../screens/App/ProfileScreen';

const config = Platform.select({
	web: { headerMode: 'screen' },
	default: {},
});

const TransactionStack = createStackNavigator(
	{
		Transaction: TransactionScreen,
		Cart: CartScreen
	},
	config
);

TransactionStack.navigationOptions = {
	tabBarLabel: 'Transaction',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-cart`
					: 'md-cart'
			}
		/>
	),
};

TransactionStack.path = '';

const LinksStack = createStackNavigator(
	{
		Links: LinksScreen,
	},
	config
);

LinksStack.navigationOptions = {
	tabBarLabel: 'Links',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
	),
};

LinksStack.path = '';

const ProfileStack = createStackNavigator(
	{
		Profile: ProfileScreen,
	},
	config
);

ProfileStack.navigationOptions = {
	tabBarLabel: 'Profile',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
	),
};

ProfileStack.path = '';

const tabNavigator = createBottomTabNavigator({
	TransactionStack,
	ProfileStack,
});

tabNavigator.path = '';

export default createSwitchNavigator({
	Main: tabNavigator
});