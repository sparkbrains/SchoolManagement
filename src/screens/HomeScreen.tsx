import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {HomeScreenProps} from '../types/screen-props';
import StyledText from '../components/Text';
import {useState, useEffect, useRef} from 'react';

import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import Card from '../components/home/ClassCard';
import Fetch from '../helpers/fetch';
import moment from 'moment';
import {calculateElapsedTime} from '../helpers/common-functions';
import ScreenLoader from '../components/ScreenLoader';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import CustomModal from '../components/CustomModal';
import {CommonActions} from '@react-navigation/native';

type ClassType = {
  class_info: {
    id: string;
    name: string;
    section: string;
  };
  day: string;
  end_time: string;
  id: string;
  start_time: string;
  subject: {
    id: string;
    name: string;
  };
  status: string;
};

type ClassList = {
  data: Array<ClassType>;
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
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
    first_name: '',
    last_name: '',
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
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTimerPopup, setShowTimerPopup] = useState(false);

  const popupShown = useRef(false);

  const fetchData = () => {
    setIsLoading(true);
    Fetch('teachers/today-classes').then((res: any) => {
      console.log('res===', res);
      setIsLoading(false);
      if (res.status) {
        setData(res?.data);
      } else {
        if (res?.code === 'user_inactive') {
          handleLogout();
        }
        setData({
          data: [],
          teacher: res?.teacher,
        });
      }
    });
  };

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
    if (timerRunning && startTime && currentClass) {
      const intervalId = setInterval(() => {
        const currentElapsedTime = calculateElapsedTime(startTime);
        setElapsedTime(currentElapsedTime);

        if (currentClass?.end_time && !popupShown.current) {
          const endTimeMoment = moment(currentClass.end_time, 'HH:mm:ss');
          const currentTimeMoment = moment(startTime, 'HH:mm:ss').add(
            moment.duration(currentElapsedTime),
          );
          const timeDifference = moment.duration(
            endTimeMoment.diff(currentTimeMoment),
          );

          if (timeDifference.asMinutes() <= 10) {
            // TODO
            setShowTimerPopup(true);
            popupShown.current = true;
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timerRunning, startTime, currentClass]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
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
        if (type === 'PUNCH_IN') {
          handleStartTimer();
        } else {
          handleStopTimer();
        }

        changeState(type, classId);
      },
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 15}}
          onPress={() => setShowModal(true)}>
          <Icon name="logout" size={20} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return isLoading ? (
    <ScreenLoader />
  ) : (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }>
        {timerRunning && (
          <View style={styles.ongoingClassContainer}>
            <StyledText
              text={`Ongoing: ${currentClass?.subject?.name} - ${currentClass?.class_info?.name}${currentClass?.class_info?.section}`}
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
          text={`Welcome, ${
            data?.teacher?.first_name + ' ' + data?.teacher?.last_name
          }!`}
          fontSize={fontSize.h1}
          style={styles.header}
        />
        {data?.data.length > 0 ? ( // TODO
          data?.data.map(classInfo => (
            <Card
              key={classInfo.id}
              subject={classInfo?.subject?.name}
              className={
                classInfo?.class_info?.name + classInfo?.class_info?.section
              }
              status={classInfo.status || 'Not Started'}
              startTime={classInfo.start_time}
              endTime={classInfo.end_time}
              handlePunchIn={() => handleNavigate('PUNCH_IN', classInfo?.id)}
              handlePunchOut={() => handleNavigate('PUNCH_OUT', classInfo?.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <StyledText
              fontSize={fontSize?.h4}
              text="Unfortunately no classes has been scheduled for you yet!"
              style={{textAlign: 'center'}}
            />
          </View>
        )}
      </ScrollView>
      <CustomModal
        visible={showModal}
        title="Confirm!"
        text="Are you sure you want to logout?"
        secondaryButtonText="Cancel"
        primaryButtonText="Logout"
        onSecondaryButtonPress={() => setShowModal(false)}
        onPrimaryButtonPress={handleLogout}
        onRequestClose={() => setShowModal(false)}
      />
      <CustomModal
        visible={showTimerPopup}
        title="10 Minutes Remaining!"
        text={`Your class ${currentClass?.subject} - ${currentClass?.class_info?.name}${currentClass?.class_info?.section} is ending soon. Please remember to punch out within the next 10 minutes.`}
        primaryButtonText="OK"
        onPrimaryButtonPress={() => setShowTimerPopup(false)}
        onRequestClose={() => setShowTimerPopup(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.large,
    textAlign: 'center',
  },

  ongoingClassContainer: {
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
  emptyContainer: {
    flex: 1,
    paddingHorizontal: spacing.large,
  },
});

export default HomeScreen;
