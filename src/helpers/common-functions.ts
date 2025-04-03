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
