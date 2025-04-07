import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {StyleSheet, ScrollView, View, Image, Dimensions} from 'react-native';
import {HomeScreenProps} from '../types/screen-props';
import StyledText from '../components/Text';
import {useState, useEffect} from 'react';

import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import Card from '../components/home/ClassCard';
import Button from '../components/button';
import Fetch from '../helpers/fetch';
import moment from 'moment';
import {calculateElapsedTime} from '../helpers/common-functions';

type ClassType = {
  class_assigned: {
    id: string;
    name: string;
    section: string;
  };
  day: string;
  end_time: string;
  id: string;
  start_time: string;
  subject: {
    name: string;
  };
  status: string;
};

type ClassList = {
  data: Array<ClassType>;
  teacher: {
    id: string;
    name: string;
    school: {
      email: string;
      logo: string;
      name: string;
    };
  };
};

const initialState = {
  data: [],
  teacher: {
    id: '',
    name: '',
    school: {
      email: '',
      logo: '',
      name: '',
    },
  },
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [data, setData] = useState<ClassList>(initialState);
  const [currentClass, setCurrentClass] = useState<ClassType | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [startTime, setStartTime] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const fetchData = () => {
    console.log('fetch data===');
    Fetch('teachers/schedule/today-classes').then(res => {
      if (res.status) {
        console.log('res===', res);
        setData(res?.data);
      }
    });
  };

  console.log('data===', data);

  const handleStartTimer = () => {
    setStartTime(moment().format('HH:mm:ss'));
    setTimerRunning(true);
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
    setCurrentClass(null);
    setStartTime(null);
    setElapsedTime('00:00:00');
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (timerRunning && startTime) {
      const intervalId = setInterval(() => {
        setElapsedTime(calculateElapsedTime(startTime));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timerRunning, startTime]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const changeState = (type: string, classId: string) => {
    setData(prevState => {
      return {
        ...prevState,
        data: prevState.data.map(item => {
          if (item.id === classId) {
            return {
              ...item,
              status: type === 'PUNCH_IN' ? 'Ongoing' : 'Completed',
            };
          }
          return item;
        }),
      };
    });
  };

  const handleNavigate = async (type: string, classId: string) => {
    setCurrentClass(data?.data.find(item => item.id === classId) || null);
    navigation.navigate('CameraView', {
      type: type,
      scheduleId: classId,
      onGoBack: (type: string) => {
        console.log('ongoback called===');
        if (type === 'PUNCH_IN') {
          handleStartTimer();
        } else {
          handleStopTimer();
        }
        // fetchData();
        console.log('type===', type, classId);

        changeState(type, classId);
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {timerRunning && (
        <View style={styles.ongoingClassContainer}>
          <StyledText
            text={`Ongoing: ${currentClass?.subject?.name} - ${currentClass?.class_assigned?.name}${currentClass?.class_assigned?.section}`}
            fontSize={fontSize.h3}
            style={styles.ongoingClassText}
          />
          <StyledText
            text={`Time: ${elapsedTime}`}
            style={styles.elapsedTimeText}
            fontSize={fontSize.h5}
          />
        </View>
      )}

      <View style={styles.logoContainer}>
        <Image
          source={
            data?.teacher?.school?.logo
              ? {uri: data?.teacher?.school?.logo}
              : require('../assets/school-logo.png')
          }
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <StyledText
        text={`Welcome, ${data?.teacher?.name}!`}
        fontSize={fontSize.h1}
        style={styles.header}
      />
      {data?.data.map(classInfo => (
        <Card
          key={classInfo.id}
          subject={classInfo.subject?.name}
          className={
            classInfo?.class_assigned?.name + classInfo?.class_assigned?.section
          }
          status={classInfo.status || 'Not Started'}
          startTime={classInfo.start_time}
          endTime={classInfo.end_time}
          handlePunchIn={() => handleNavigate('PUNCH_IN', classInfo?.id)}
          handlePunchOut={() => handleNavigate('PUNCH_OUT', classInfo?.id)}
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

  ongoingClassContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    alignItems: 'center',
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  ongoingClassText: {
    color: colors.white,
    fontSize: fontSize.h3,
    fontWeight: 'bold',
  },
  elapsedTimeText: {
    color: colors.white,
    fontSize: fontSize.h5,
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
    paddingTop: spacing.xLarge + 20,
    flexGrow: 1,
  },
});

export default HomeScreen;
