import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {StyleSheet, ScrollView, View, Image} from 'react-native';
import {HomeScreenProps} from '../types/screen-props';
import StyledText from '../components/Text';
import {useState, useEffect} from 'react';

import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import {classes} from '../static-data/classes';
import Card from '../components/home/ClassCard';
import Button from '../components/button';
import Fetch from '../helpers/fetch';
import {showToast} from '../helpers/common-functions';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [data, setData] = useState();

  const fetchData = () => {
    Fetch('api-url').then(res => {
      if (res.status) {
        setData(res?.data);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const handlePunchIn = async () => {
    navigation.navigate('CameraView');
  };

  const handlePunchOut = async () => {
    Fetch('api-url', {}, {method: 'post', inFormData: true}).then(res => {
      if (res.status) {
        showToast('Punch out successful');
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/school-logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <StyledText
        text="Welcome, Teacher!"
        fontSize={fontSize.h1}
        style={styles.header}
      />
      {classes.map(classInfo => (
        <Card
          key={classInfo.id}
          subject={classInfo.subject}
          className={classInfo.className}
          status={classInfo.status}
          startTime={classInfo.startTime}
          endTime={classInfo.endTime}
          handlePunchIn={handlePunchIn}
        />
      ))}

      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.large,
    textAlign: 'center',
  },

  logoutButton: {
    marginTop: spacing.large,
  },

  logoContainer: {alignItems: 'center', padding: spacing.large},

  logo: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.large,
  },

  scrollContainer: {
    padding: spacing.medium,
    flexGrow: 1,
  },
});

export default HomeScreen;
