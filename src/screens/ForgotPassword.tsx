import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import {ForgotPasswordScreenProps} from '../types/screen-props';
import Input from '../components/Input';
import {
  spacing,
  colors,
  borderRadius,
  boxShadow,
  fontSize,
} from '../styles/base';
import {getKeyboardBehaviour, showToast} from '../helpers/common-functions';
import StyledText from '../components/Text';
import Button from '../components/button';
import {
  validateEmail,
  validateOtp,
  validatePassword,
  validatePhoneNumber,
} from '../helpers/validationUtils';
import Fetch from '../helpers/fetch';
import {CommonActions} from '@react-navigation/native';
import {arrayString} from '../helpers/array-string';
import TextButton from '../components/text-button';

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [data, setData] = useState({
    phone_number: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [usePhone, setUsePhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(300); // 5 minutes = 300 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    setSeconds(300); // Reset the timer to 5 minutes
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleResendOTP = () => {
    setErrors({});
    handleSendOtp();
    setOtpSent(false);
  };

  const handleChange = (type: string, value: string): void => {
    setData(prevState => ({
      ...prevState,
      [type]: value,
    }));
  };

  const handleSendOtp = () => {
    console.log('check1===');
    handleStartTimer();
    setErrors({});
    let error = '';
    if (usePhone) {
      error = validatePhoneNumber(data?.phone_number);
    } else {
      error = validateEmail(data?.email);
    }
    if (error) {
      setErrors(usePhone ? {phone_number: error} : {email: error});
    } else {
      setIsLoading(true);
      Fetch(
        'accounts/password-reset/request/',
        {email: data?.email},
        {method: 'post'},
      ).then(res => {
        console.log('send otp response===', res);
        if (res.status) {
          setOtpSent(true);
        } else {
          let errors = arrayString(res);
          setErrors(errors);
        }
        setIsLoading(false);
      });
    }
  };

  const handleVerifyOtp = () => {
    setErrors({});
    let error = validateOtp(data?.otp);
    if (error) {
      setErrors({otp: error});
    } else {
      setIsLoading(true);
      Fetch(
        'accounts/password-reset/verify/',
        {email: data?.email, otp: data?.otp},
        {method: 'post'},
      ).then(res => {
        console.log('verify otp response===', res);
        if (res.status) {
          setOtpVerified(true);
        } else {
          let errors = arrayString(res);
          setErrors(errors);
        }
        setIsLoading(false);
      });
    }
  };

  const handleSubmit = () => {
    let error1 = validatePassword(data?.password);
    let error2 = validatePassword(data?.confirmPassword);

    const errorsToUpdate: {[key: string]: string} = {};
    if (error1) {
      errorsToUpdate.password = error1;
    }
    if (error2) {
      errorsToUpdate.confirmPassword = error2;
    }
    if (!error2) {
      if (data?.password !== data?.confirmPassword) {
        errorsToUpdate.confirmPassword = 'Passwords do not match';
      }
    }
    if (Object.keys(errorsToUpdate).length > 0) {
      setErrors(errorsToUpdate);
    } else {
      setIsLoading(true);
      Fetch(
        'accounts/password-reset/reset/',
        {
          email: data?.email,
          new_password: data?.password,
          confirm_password: data?.confirmPassword,
        },
        {method: 'post'},
      ).then(res => {
        console.log('verify otp response===', res);
        if (res.status) {
          showToast('Password changed successfully!');
          navigateToLogin();
        }
        setIsLoading(false);
      });
    }
  };

  const navigateToLogin = () => {
    setIsTimerRunning(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  // Disable the back navigation when loader is true
  useEffect(() => {
    const backAction = () => {
      if (isLoading) {
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the back handler
  }, [isLoading]);

  return (
    <KeyboardAvoidingView
      behavior={getKeyboardBehaviour()}
      style={styles.keyboardAvoidingView}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View
          style={styles.innerContainer}
          pointerEvents={isLoading ? 'none' : 'auto'}>
          <StyledText
            text="Forgot Password"
            fontSize={fontSize.header}
            style={styles.title}
          />

          {/* {!otpVerified && (
            <View style={styles.toggleContainer}>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => setUsePhone(true)}
                  title="Phone"
                  style={styles.toggleButton}
                  filled={usePhone}
                />
                <Button
                  onPress={() => setUsePhone(false)}
                  title="Email"
                  filled={!usePhone}
                  style={styles.toggleButton}
                />
              </View>
            </View>
          )} */}

          {otpVerified ? null : usePhone ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <Input
                label="Phone number"
                value={data.phone_number}
                onChangeText={(text: string) =>
                  handleChange('phone_number', text)
                }
                isRequired={true}
                placeholder={'Enter phone number'}
                keyboardType={'phone-pad'}
                customStyles={{marginBottom: spacing.medium, width: '100%'}}
                errorText={errors?.phone_number}
                maxLength={10}
                editable={!otpSent}
              />
              {/* <TouchableOpacity
                style={{marginBottom: spacing.medium, backgroundColor: 'lightgray', padding: 4, borderRadius: 20}}>
                <Icon name="edit" size={20} color={colors.primary} />
              </TouchableOpacity> */}
            </View>
          ) : (
            <Input
              label="Email"
              value={data.email}
              onChangeText={(text: string) => handleChange('email', text)}
              isRequired={true}
              placeholder={'Enter email'}
              keyboardType={'email-address'}
              customStyles={{marginBottom: spacing.medium}}
              errorText={errors?.email}
            />
          )}

          {otpSent && !otpVerified && (
            <Input
              label="OTP"
              value={data.otp}
              onChangeText={(text: string) => handleChange('otp', text)}
              isRequired={true}
              placeholder={'Enter OTP'}
              keyboardType={'numeric'}
              customStyles={{marginBottom: spacing.medium}}
              errorText={errors?.otp}
              maxLength={6}
            />
          )}

          {errors?.non_field_errors && (
            <StyledText
              text={errors?.non_field_errors}
              fontSize={fontSize.h5}
              style={styles.errorText}
            />
          )}

          {!otpSent ? (
            <Button
              onPress={handleSendOtp}
              title="Send OTP"
              isLoading={isLoading}
            />
          ) : !otpVerified ? (
            <>
              <Button
                onPress={handleVerifyOtp}
                title="Verify OTP"
                isLoading={isLoading}
              />
              {seconds > 0 ? (
                <StyledText
                  text={`Resend OTP in ${formatTime(seconds)}`}
                  fontSize={fontSize.h5}
                  style={styles.resendOtp}
                />
              ) : (
                <TextButton
                  text="Resend OTP"
                  onPress={handleResendOTP}
                  customStyles={styles.resendOtp}
                />
              )}
            </>
          ) : (
            <>
              <Input
                label="New Password"
                value={data.password}
                onChangeText={(text: string) => handleChange('password', text)}
                isRequired={true}
                placeholder={'Enter new password'}
                secureTextEntry
                customStyles={{marginBottom: spacing.medium}}
                errorText={errors?.password}
              />
              <Input
                label="Confirm Password"
                value={data.confirmPassword}
                onChangeText={(text: string) =>
                  handleChange('confirmPassword', text)
                }
                isRequired={true}
                placeholder={'Confirm new password'}
                secureTextEntry
                customStyles={{marginBottom: spacing.medium}}
                errorText={errors?.confirmPassword}
              />

              {errors?.non_field_errors && (
                <StyledText
                  text={errors?.non_field_errors}
                  fontSize={fontSize.h5}
                  style={styles.errorText}
                />
              )}

              <Button
                onPress={handleSubmit}
                title="Submit"
                isLoading={isLoading}
              />
            </>
          )}
          <TextButton
            text="Remember password"
            onPress={navigateToLogin}
            customStyles={styles.rememberPassword}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  resendOtp: {
    textAlign: 'center',
    color: colors.primary,
    marginVertical: spacing.small,
    alignSelf: 'center',
  },
  innerContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    padding: spacing.large,
    ...boxShadow,
  },
  title: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.medium,
  },
  toggleButton: {
    flex: 1,
    padding: spacing.small,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    gap: 10,
  },
  errorText: {
    color: colors.error,
    marginVertical: spacing.small,
    textAlign: 'center',
  },
  rememberPassword: {
    marginVertical: spacing.medium,
    alignSelf: 'center',
  },
});

export default ForgotPasswordScreen;
