import moment from 'moment';
import {Platform, ToastAndroid} from 'react-native';

export const getKeyboardBehaviour = () => {
  return Platform.OS === 'ios' ? 'padding' : 'height';
};

export const showToast = (text: string) => {
  ToastAndroid.show(text, ToastAndroid.SHORT);
};

export const convertImageFormat = (path: string) => {
  return {
    uri: `file://${path}`,
    type: 'image/jpeg',
    name: 'photo.jpg',
  };
};

export const calculateElapsedTime = (start: string) => {
  const now = moment();
  const startTimeMoment = moment(start, 'HH:mm:ss');
  const duration = moment.duration(now.diff(startTimeMoment));
  const hours = duration.hours().toString().padStart(2, '0');
  const minutes = duration.minutes().toString().padStart(2, '0');
  const seconds = duration.seconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const getCurrentDayFromDate = (dateString: string): string => {
  try {
    const date = moment(dateString, 'YYYY-MM-DD');
    if (date.isValid()) {
      return date.format('dddd');
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error parsing date string:', error);
    return '';
  }
};
