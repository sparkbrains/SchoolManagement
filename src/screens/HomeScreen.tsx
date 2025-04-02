import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeScreenProps} from '../types/screen-props';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;
