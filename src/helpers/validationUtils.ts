export const validatePhoneNumber = (phoneNumber: string): string => {
  const trimmedPhoneNumber = phoneNumber.trim();
  const regex = /^\d{10}$/;
  return regex.test(trimmedPhoneNumber)
    ? ''
    : 'Phone number must be 10 digits.';
};

export const validateEmail = (email: string): string => {
  const trimmedEmail = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(trimmedEmail) ? '' : 'Invalid email address.';
};

export const validatePassword = (password: string): string => {
  const trimmedPassword = password.trim();
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(trimmedPassword)
    ? ''
    : 'Password must be at least 8 characters long, and include an upper case letter, a lower case letter, a number, and a special character.';
};

export const validateOtp = (otp: string): string => {
  const trimmedOtp = otp.trim();
  const regex = /^\d{6}$/;
  return regex.test(trimmedOtp) ? '' : 'OTP must be 6 digits.';
};

export const validateEmailOrPhone = (input: string): string => {
  const trimmedInput = input.trim();
  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (phoneRegex.test(trimmedInput)) {
    return '';
  } else if (emailRegex.test(trimmedInput)) {
    return '';
  } else {
    return 'Invalid email or phone number.';
  }
};
