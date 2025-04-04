import {StyleSheet} from 'react-native';
import {getFontSize} from '../helpers/font';

const colors = {
  primary: '#1565C0',
  secondary: '#2E7D32',
  accent: '#FFA726',
  background: '#F9FAFB',
  textPrimary: '#263238',
  textSecondary: '#607D8B',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FBC02D',
  border: '#B0BEC5',
  white: '#FFFFFF',
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

const fontSize = {
  header: getFontSize(24),
  h1: getFontSize(20),
  h2: getFontSize(18),
  h3: getFontSize(16),
  h4: getFontSize(14),
  h5: getFontSize(12),
  h6: getFontSize(10),
  smallText: getFontSize(8),
};

const utilityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  header: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.large,
  },
  input: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.small,
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.error,
  },
  successText: {
    color: colors.success,
    marginTop: spacing.small,
  },
  warningText: {
    color: colors.warning,
    marginTop: spacing.small,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export {colors, spacing, utilityStyles, borderRadius, boxShadow, fontSize};
