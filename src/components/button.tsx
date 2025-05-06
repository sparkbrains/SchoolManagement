import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../styles/base';
import StyledText from './Text';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  filled?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  filled = true,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        filled ? styles.filled : styles.outline,
        disabled && (filled ? styles.disabled : styles.outlineDisabled),
        style,
      ]}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator color={filled ? colors.white : colors.primary} />
      ) : (
        <StyledText
          text={title}
          fontSize={fontSize.h3}
          style={[
            styles.text,
            filled ? styles.filledText : styles.outlineText,
            disabled &&
              (filled ? styles.disabledText : styles.outlineDisabledText),
            textStyle,
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing.medium,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: colors.textSecondary,
    borderColor: colors.textSecondary,
    opacity: 0.7,
  },
  text: {
    fontWeight: 'bold',
  },
  filledText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  outlineDisabled: {
    borderColor: colors.textSecondary,
  },
  outlineDisabledText: {
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.white,
  },
});

export default Button;
