import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardType,
  ViewStyle,
} from 'react-native';
import {borderRadius, colors, spacing, utilityStyles} from '../styles/base';
import StyledText from './Text';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isRequired?: boolean;
  errorText?: string;
  placeholder?: string;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  customStyles?: ViewStyle;
  maxLength?: number | undefined;
  editable?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  isRequired = false,
  errorText = '',
  placeholder = '',
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength = undefined,
  editable = true,
  customStyles,
}) => {
  return (
    <View style={[styles.container, customStyles]}>
      <StyledText text={label} fontSize={16} style={styles.label} />
      <TextInput
        style={[utilityStyles.input, errorText && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
      />
      {isRequired && errorText && (
        <StyledText text={errorText} fontSize={10} style={styles.errorText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: spacing.medium,
  },
  label: {
    fontSize: 16,
    marginBottom: spacing.small,
    color: colors.textPrimary,
  },
  input: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.small,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
  },
});

export default Input;
