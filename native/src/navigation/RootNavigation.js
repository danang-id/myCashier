import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AppNavigation from './AppNavigation';
import GuestNavigation from './GuestNavigation';
import LoadingScreen from '../screens/LoadingScreen';

export default createAppContainer(
    createSwitchNavigator(
        {
            App: AppNavigation,
            Guest: GuestNavigation,
            Loading: LoadingScreen,
        },
        {
            initialRouteName: 'Loading',
        }
    )
);
