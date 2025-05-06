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
  ActivityIndicator,
} from 'react-native';
import {HomeScreenProps} from '../types/screen-props';
import StyledText from '../components/Text';
import {useState, useEffect, useRef} from 'react';

import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import Card from '../components/home/ClassCard';
import Fetch from '../helpers/fetch';
import moment from 'moment';
import {
  calculateElapsedTime,
  getCurrentDayFromDate,
} from '../helpers/common-functions';
import ScreenLoader from '../components/ScreenLoader';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import CustomModal from '../components/CustomModal';
import {CommonActions} from '@react-navigation/native';
import SwipeableComponent from '../components/SwipeableView';

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
  logs: {
    last_punch_in_time: string;
    last_punch_out_time: string;
  };
  is_early: boolean;
  is_late: boolean;
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
  slot_type: string;
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
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [showPagerLoader, setShowPagerLoader] = useState(false);
  const [dateType, setDateType] = useState<'currentDay' | 'previous' | 'next'>(
    'currentDay',
  );

  const popupShown = useRef(false);

  const goToPreviousDay = (date = '') => {
    const today = moment().format('YYYY-MM-DD');
    if (moment(date, 'YYYY-MM-DD').isBefore(moment(today, 'YYYY-MM-DD'))) {
      setDateType('previous');
    }

    const previousDate = moment(currentDate, 'YYYY-MM-DD')
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    fetchDataForAnotherDay(previousDate);
    setCurrentDate(previousDate);
  };

  const goToNextDay = (date = '') => {
    const today = moment().format('YYYY-MM-DD');
    if (moment(date, 'YYYY-MM-DD').isAfter(moment(today, 'YYYY-MM-DD'))) {
      setDateType('next');
    }

    const nextDate = moment(currentDate, 'YYYY-MM-DD')
      .add(1, 'day')
      .format('YYYY-MM-DD');
    fetchDataForAnotherDay(nextDate);
    setCurrentDate(nextDate);
  };

  const fetchDataForAnotherDay = (date: string) => {
    const isToday = moment(date).isSame(moment(), 'day');

    if (isToday) {
      fetchData();
      return;
    }
    const day = getCurrentDayFromDate(date);
    setShowPagerLoader(true);
    Fetch(`teachers/previous-classes/?date=${date}&day=${day}`).then(
      (res: any) => {
        if (res.status) {
          setData(res?.data);
        }
        setShowPagerLoader(false);
      },
    );
  };

  const fetchData = () => {
    // check for initial data load has happened or not, if it has happened then no need to show full page loader
    setDateType('currentDay');
    if (data?.slot_type) {
      setShowPagerLoader(true);
    } else {
      setIsLoading(true);
    }

    Fetch('teachers/today-classes').then((res: any) => {
      console.log('response====', res);
      if (res.status) {
        if (!res?.data?.data?.length) {
          setTimerRunning(false);
        }
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
      setIsLoading(false);
      setShowPagerLoader(false);
    });
  };

  const handleStartTimer = (initialTime?: string) => {
    setStartTime(initialTime || moment().format('HH:mm:ss'));
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

  const checkForOngoingClass = () => {
    const ongoingClass = data?.data.find(
      item =>
        !!item?.logs?.last_punch_in_time && !item?.logs?.last_punch_out_time,
    );

    if (ongoingClass) {
      setCurrentClass(ongoingClass);
      handleStartTimer(ongoingClass?.logs?.last_punch_in_time);
    }
  };

  useEffect(() => {
    if (data?.data?.length) {
      checkForOngoingClass();
    }
  }, [data]);

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

  const handleNavigate = async (
    type: string,
    classId: string,
    startTime: string,
    endTime: string,
  ) => {
    setCurrentClass(data?.data.find(item => item.id === classId) || null);
    navigation.navigate('CameraView', {
      type: type,
      scheduleId: classId,
      startTime: startTime,
      endTime: endTime,
      onGoBack: (type: string) => {
        if (type === 'PUNCH_IN') {
          // handleStartTimer();
        } else {
          handleStopTimer();
        }

        fetchData();
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
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchData();
              setCurrentDate(moment().format('YYYY-MM-DD'));
            }}
          />
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

          <StyledText
            text={data?.teacher?.school?.name || ''}
            fontSize={fontSize.h3}
            style={styles.schoolName}
          />
        </View>
        <StyledText
          text={`Welcome, ${
            data?.teacher?.first_name + ' ' + data?.teacher?.last_name
          }!`}
          fontSize={fontSize.h1}
          style={styles.header}
        />

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            onPress={() =>
              goToPreviousDay(
                moment(currentDate, 'YYYY-MM-DD')
                  .subtract(1, 'day')
                  .format('YYYY-MM-DD'),
              )
            }
            style={styles.navButton}>
            <Icon name="arrow-left" size={20} color={colors.secondary} />
          </TouchableOpacity>
          <StyledText
            text={`Schedule for ${
              moment(data?.slot_type, 'YYYY-MM-DD', true).isValid()
                ? moment(data?.slot_type, 'YYYY-MM-DD').format('dddd') +
                  ` (${moment(data?.slot_type).format('DD MMM, YYYY')})`
                : data?.slot_type +
                  ` (${moment(moment.now()).format('DD MMM, YYYY')})`
            }`}
            fontSize={fontSize.h3}
            style={styles.scheduleText}
          />
          <TouchableOpacity
            onPress={() =>
              goToNextDay(
                moment(currentDate, 'YYYY-MM-DD')
                  .add(1, 'day')
                  .format('YYYY-MM-DD'),
              )
            }
            style={styles.navButton}>
            <Icon name="arrow-right" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {showPagerLoader ? (
          <ActivityIndicator
            style={styles.loader}
            size={'large'}
            color={colors.primary}
          />
        ) : (
          <SwipeableComponent
            onSwipeLeft={() =>
              goToNextDay(
                moment(currentDate, 'YYYY-MM-DD')
                  .add(1, 'day')
                  .format('YYYY-MM-DD'),
              )
            }
            onSwipeRight={() =>
              goToPreviousDay(
                moment(currentDate, 'YYYY-MM-DD')
                  .subtract(1, 'day')
                  .format('YYYY-MM-DD'),
              )
            }>
            {data?.data.length > 0 ? (
              data?.data.map(classInfo => (
                <Card
                  key={classInfo.id}
                  subject={classInfo?.subject?.name}
                  className={
                    classInfo?.class_info?.name + classInfo?.class_info?.section
                  }
                  status={
                    !classInfo?.logs?.last_punch_in_time &&
                    !classInfo?.logs?.last_punch_out_time &&
                    moment().isAfter(moment(classInfo.end_time, 'HH:mm'))
                      ? 'Expired'
                      : classInfo.status
                  }
                  startTime={classInfo.start_time}
                  endTime={classInfo.end_time}
                  handlePunchIn={() =>
                    handleNavigate(
                      'PUNCH_IN',
                      classInfo?.id,
                      classInfo.start_time,
                      classInfo.end_time,
                    )
                  }
                  handlePunchOut={() =>
                    handleNavigate(
                      'PUNCH_OUT',
                      classInfo?.id,
                      classInfo.start_time,
                      classInfo.end_time,
                    )
                  }
                  logs={classInfo?.logs}
                  isEarly={classInfo?.is_early}
                  isLate={classInfo?.is_late}
                  scheduleDate={`${
                    moment(data?.slot_type, 'YYYY-MM-DD', true).isValid()
                      ? moment(data?.slot_type).format('MMMM Do, YYYY')
                      : data?.slot_type +
                        ` (${moment(moment.now()).format('DD MMM, YYYY')})`
                  }`}
                  timerRunning={timerRunning}
                  dataType={dateType}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <StyledText
                  fontSize={fontSize?.h4}
                  text="Unfortunately no classes has been scheduled for this day!"
                  style={{textAlign: 'center'}}
                />
              </View>
            )}
          </SwipeableComponent>
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
        title="Alert!"
        text={`Your class ${currentClass?.subject?.name} - ${currentClass?.class_info?.name}${currentClass?.class_info?.section} is ending soon. Please remember to punch out.`}
        primaryButtonText="OK"
        onPrimaryButtonPress={() => setShowTimerPopup(false)}
        onRequestClose={() => setShowTimerPopup(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    color: colors.primary,
  },
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
    zIndex: 1,
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
  logoContainer: {
    alignItems: 'center',
    padding: spacing.large,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.large,
  },
  scrollContainer: {
    padding: spacing.medium,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: spacing.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolName: {
    marginTop: spacing.small,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.primary,
  },
  scheduleText: {
    textAlign: 'center',
    color: colors.secondary,
  },
  pagerView: {
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.medium,
  },
  navButton: {
    padding: spacing.small,
  },
});

export default HomeScreen;
