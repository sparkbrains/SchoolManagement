import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import {AuthProvider, useAuth} from './src/components/context/AuthContext';
import {AppProvider} from './src/components/context/AppContext';
import AuthNavigator from './src/components/navigators/AuthNavigator';
import DrawerNavigator from './src/components/navigators/DrawerNavigator';

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
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  );
}
