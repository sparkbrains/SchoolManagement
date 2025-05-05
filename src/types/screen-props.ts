import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  CameraView: {
    type: string;
    scheduleId: string;
    onGoBack: (type: string) => void;
  };
  Reports: undefined;
};

type ScreenNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;
type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: ScreenNavigationProp<T>;
  route: ScreenRouteProp<T>;
};

// Export types for more screens as required
export type HomeScreenProps = ScreenProps<'Home'>;
export type LoginScreenProps = ScreenProps<'Login'>;
export type ForgotPasswordScreenProps = ScreenProps<'ForgotPassword'>;
export type CameraScreenProps = ScreenProps<'CameraView'>;
export type ReportScreenProps = ScreenProps<'Reports'>;
