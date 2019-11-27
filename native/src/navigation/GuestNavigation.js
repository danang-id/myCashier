
import { createSwitchNavigator } from 'react-navigation';
import HomeScreen from '../screens/Guest/HomeScreen';
import SignInScreen from '../screens/Guest/SignInScreen';
import RegisterScreen from '../screens/Guest/RegisterScreen';
import ForgetPasswordScreen from '../screens/Guest/ForgetPasswordScreen';

export default createSwitchNavigator({
	Home: HomeScreen,
	SignIn: SignInScreen,
	Register: RegisterScreen,
	ForgetPassword: ForgetPasswordScreen,
}, {
	initialRouteName: 'Home',
	headerMode: 'none',
});