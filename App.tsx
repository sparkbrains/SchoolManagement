import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {StatusBar} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import CameraView from './src/screens/CameraView';
import {AuthProvider, useAuth} from './src/components/context/AuthContext';
import {AppProvider} from './src/components/context/AppContext';
import {RootStackParamList} from './src/types/screen-props';
import 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

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

function DrawerNavigator(): React.JSX.Element {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="CameraView"
        component={CameraView}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

function App(): React.JSX.Element {
  const {isLoggedIn, isLoading} = useAuth();

  if (isLoading) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {isLoggedIn ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function AppWrapper(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
