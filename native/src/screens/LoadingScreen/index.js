import React, { memo } from 'react';
import {
    AsyncStorage,
    ImageBackground,
    Text,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { style } from './style';
import { expo } from '../../../app.json';
import Splash from '../../assets/images/splash.png';

const LoadingScreen = ({ navigation }) => {

    const accessToken = useSelector(state => state.root.accessToken);

    const bootstrap = () => {
        navigation.navigate(accessToken === null ? 'Guest' : 'App');
    };

    React.useEffect(() => {
        bootstrap();
    }, []);

    return (
            <ImageBackground source={Splash} style={style.container}>
                <View style={style.topSpacer} />
                <Text style={style.content}>{ expo.name } v{ expo.version }</Text>
                <View style={style.bottomSpacer} />
            </ImageBackground>
    );

};

export default memo(LoadingScreen);