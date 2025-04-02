import {StyleSheet} from 'react-native';

const colors = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  accent: '#F5A623',
  background: '#F2F2F2',
  textPrimary: '#4A4A4A',
  textSecondary: '#9B9B9B',
  error: '#D0021B',
  success: '#7ED321',
  warning: '#F8E71C',
  border: '#ccc',
  white: '#fff',
};

const spacing = {
  small: 8,
  medium: 12,
  large: 24,
  xLarge: 32,
};

const boxShadow = {
  shadowColor: colors.primary,
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 5,
};

const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  full: 9999, // for fully rounded corners
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.large,
  },
  text: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    padding: spacing.small,
    marginBottom: spacing.medium,
    borderRadius: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: spacing.small,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    marginTop: spacing.small,
  },
  warningText: {
    color: colors.warning,
    fontSize: 14,
    marginTop: spacing.small,
  },
});

export {colors, spacing, styles, borderRadius, boxShadow};
