import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {StyleSheet, ScrollView, View, Image} from 'react-native';
import {HomeScreenProps} from '../types/screen-props';
import StyledText from '../components/Text';
import {useState, useEffect} from 'react';

import {fontSize, spacing} from '../styles/base';
import {classes} from '../static-data/classes';
import Card from '../components/home/ClassCard';
import Button from '../components/button';
import Fetch from '../helpers/fetch';
import {checkPermission} from '../helpers/permisssions';
import {showToast} from '../helpers/common-functions';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [data, setData] = useState();
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

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
    const isPermissionProvided = await checkPermission('camera');
    if (isPermissionProvided === 'ALLOWED') {
      Fetch('api-url', {}, {method: 'post'}).then(res => {
        if (res.status) {
          showToast('Punch out successful');
        }
      });
    } else {
      setShowPermissionPopup(true);
    }
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
          timing={classInfo.timing}
          status={classInfo.status}
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
  },
  scrollContainer: {
    padding: spacing.medium,
  },
});

export default HomeScreen;
