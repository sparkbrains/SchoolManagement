import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/screen-props';
import LoginScreen from '../../screens/LoginScreen';
import ForgotPasswordScreen from '../../screens/ForgotPassword';

const AuthStack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator(): React.JSX.Element {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;
