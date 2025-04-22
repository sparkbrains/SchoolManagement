import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import {RootStackParamList} from './src/types/screen-props';
import CameraView from './src/screens/CameraView';
import {AuthProvider, useAuth} from './src/components/context/AuthContext';
import {StatusBar} from 'react-native';
import {AppProvider} from './src/components/context/AppContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const {isLoggedIn, isLoading} = useAuth();

  if (isLoading) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CameraView"
          component={CameraView}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppWrapper(): React.JSX.Element {
  return (
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  );
}
