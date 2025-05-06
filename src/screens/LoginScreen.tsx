import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {LoginScreenProps} from '../types/screen-props';
import Input from '../components/Input';
import {
  spacing,
  colors,
  borderRadius,
  boxShadow,
  fontSize,
} from '../styles/base';
import StyledText from '../components/Text';
import Button from '../components/button';
import TextButton from '../components/text-button';
import {
  validateEmailOrPhone,
  validatePassword,
} from '../helpers/validationUtils';
import Fetch from '../helpers/fetch';
import {arrayString} from '../helpers/array-string';
import {TeacherManagementIcon} from '../assets/svg-icons';
import CustomModal from '../components/CustomModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const initialState = {
  username: '',
  password: '',
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (type: string, value: string): void => {
    setData(prevState => ({
      ...prevState,
      [type]: value,
    }));
  };

  const validateField = (type: string, value: string) => {
    let error = '';
    switch (type) {
      case 'username':
        error = validateEmailOrPhone(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
    }
    return error;
  };

  const validateForm = () => {
    let formErrors: any = {};

    Object.entries(data).forEach(([key, value]) => {
      let error = validateField(key, value);
      if (error) {
        formErrors[key] = error;
      }
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length > 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      return;
    } else {
      setIsLoading(true);
      Fetch(
        'login/',
        {
          phone_number_or_email: data?.username,
          phone_number_prefix: '+91',
          password: data?.password,
        },
        {method: 'post'},
      ).then(res => {
        console.log("res===", res);
        
        if (res.status) {
          AsyncStorage.setItem('userToken', res?.data?.access);
          navigation.replace('Home');
        } else {
          let errors = arrayString(res);
          setErrors(errors);
        }
        setIsLoading(false);
      });
    }
  };

  const handleForgotPassword = () => {
    setData(initialState);
    setErrors({});
    navigation.navigate('ForgotPassword');
  };

  const handleIconClick = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraHeight={0}
        extraScrollHeight={0}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.keyboardAvoidingView}
        style={{backgroundColor: colors.white}}>
        <View
          style={styles.innerContainer}
          pointerEvents={isLoading ? 'none' : 'auto'}>
          <View
            style={{marginHorizontal: 'auto', marginVertical: spacing.large}}>
            <TeacherManagementIcon size={100} color={colors.primary} />
          </View>

          <StyledText
            text="Teacher Login"
            fontSize={fontSize.header}
            style={styles.title}
          />

          <Input
            label="Email / Phone No."
            value={data.username}
            onChangeText={(text: string) => handleChange('username', text)}
            isRequired={true}
            placeholder={'Enter phone number or email'}
            customStyles={{marginBottom: spacing.medium}}
            errorText={errors?.username}
          />

          <Input
            label="Password"
            value={data.password}
            onChangeText={(text: string) => handleChange('password', text)}
            isRequired={true}
            placeholder={'Enter password'}
            secureTextEntry={!showPassword}
            errorText={errors?.password}
            iconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
            handleIconClick={handleIconClick}
            showLabelIcon={true}
            handleShowInfo={() => setShowInfo(true)}
          />

          <TextButton
            text="Forgot your password?"
            onPress={handleForgotPassword}
            customStyles={{marginVertical: spacing.medium}}
          />

          {errors?.message && (
            <StyledText
              text={errors?.message}
              fontSize={12}
              style={styles.errorText}
            />
          )}

          {errors?.non_field_errors && (
            <StyledText
              text={errors?.non_field_errors}
              fontSize={12}
              style={styles.errorText}
            />
          )}

          <Button onPress={handleLogin} title="Login" isLoading={isLoading} />
        </View>
      </KeyboardAwareScrollView>
      <CustomModal
        visible={showInfo}
        title="Instructions"
        text="Password must be at least 8 characters long, and include an upper case letter, a lower case letter, a number, and a special character."
        onPrimaryButtonPress={() => setShowInfo(false)}
        primaryButtonText="Close"
        onRequestClose={() => setShowInfo(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flexGrow: 1,
    padding: spacing.medium,
    justifyContent: 'center',
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
});

export default LoginScreen;
