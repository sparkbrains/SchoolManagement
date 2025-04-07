import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import * as React from 'react';
import {View, StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native';
import {LoginScreenProps} from '../types/screen-props';
import Input from '../components/Input';
import {
  spacing,
  colors,
  borderRadius,
  boxShadow,
  utilityStyles,
  fontSize,
} from '../styles/base';
import {getKeyboardBehaviour} from '../helpers/common-functions';
import StyledText from '../components/Text';
import Button from '../components/button';
import TextButton from '../components/text-button';
import {
  validateEmail,
  validateEmailOrPhone,
  validatePassword,
} from '../helpers/validationUtils';
import Fetch from '../helpers/fetch';
import {arrayString} from '../helpers/array-string';
import {TeacherManagementIcon} from '../assets/svg-icons';
import CustomModal from '../components/CustomModal';

const initialState = {
  phone_number: '',
  email: '',
  password: '',
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [data, setData] = useState(initialState);
  const [usePhoneLogin, setUsePhoneLogin] = React.useState(true);
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
      case 'phone_number':
        // error = validatePhoneNumber(value);
        error = validateEmailOrPhone(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
    }
    return error;
  };

  const validateForm = () => {
    let formErrors: any = {};
    let fieldsToSkip = [usePhoneLogin ? 'email' : 'phone_number'];

    Object.entries(data).forEach(([key, value]) => {
      if (fieldsToSkip.includes(key)) return; // extra check to remove the fields not required for validation

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
        'accounts/login/',
        {
          username: usePhoneLogin ? data?.phone_number : data?.email,
          password: data?.password,
        },
        {method: 'post'},
      ).then(res => {
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

  const toggleSelection = (allow: boolean): void => {
    setErrors({});
    setUsePhoneLogin(allow);
    setData(initialState);
  };

  const handleIconClick = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={getKeyboardBehaviour()}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={[utilityStyles.container, styles.container]}
          keyboardShouldPersistTaps="handled">
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

            {/* <View style={styles.toggleContainer}>
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => toggleSelection(true)}
                title="Phone"
                style={styles.toggleButton}
                filled={usePhoneLogin}
              />
              <Button
                onPress={() => toggleSelection(false)}
                title="Email"
                filled={!usePhoneLogin}
                style={styles.toggleButton}
              />
            </View>
          </View> */}

            {usePhoneLogin ? (
              <Input
                label="Email / Phone No."
                value={data.phone_number}
                onChangeText={(text: string) =>
                  handleChange('phone_number', text)
                }
                isRequired={true}
                placeholder={'Enter phone number or email'}
                // keyboardType={'phone-pad'}
                customStyles={{marginBottom: spacing.medium}}
                errorText={errors?.phone_number}
                // maxLength={10}
              />
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

            {errors?.non_field_errors && (
              <StyledText
                text={errors?.non_field_errors}
                fontSize={12}
                style={styles.errorText}
              />
            )}

            <Button onPress={handleLogin} title="Login" isLoading={isLoading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomModal
        visible={showInfo}
        title="Instructions"
        text="Password must be at least 8 characters long, and include an upper case letter, a lower case letter, a number, and a special character."
        onPrimaryButtonPress={() => setShowInfo(false)}
        primaryButtonText='Close'
        onRequestClose={() => setShowInfo(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
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
