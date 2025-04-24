import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardType,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  spacing,
  utilityStyles,
} from '../styles/base';
import StyledText from './Text';
import Icon from 'react-native-vector-icons/Ionicons';

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
  iconName?: string;
  handleIconClick?: () => void;
  showLabelIcon?: boolean;
  handleShowInfo?: () => void;
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
  iconName,
  handleIconClick = () => {},
  showLabelIcon = false,
  handleShowInfo,
}) => {
  return (
    <View style={[customStyles]}>
      <View style={showLabelIcon && styles.labelContainer}>
        <StyledText text={label} fontSize={16} style={styles.label} />
        {showLabelIcon && (
          <TouchableOpacity onPress={handleShowInfo}>
            <Icon
              name={'information-circle-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            utilityStyles.input,
            errorText && styles.inputError,
            iconName && styles.inputPaddedRight,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          editable={editable}
        />
        {iconName && (
          <TouchableOpacity onPress={handleIconClick} style={styles.icon}>
            <Icon name={iconName} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {isRequired && errorText && (
        <StyledText
          text={errorText}
          fontSize={fontSize.h6}
          style={styles.errorText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  inputPaddedRight: {
    paddingRight: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
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
  icon: {
    position: 'absolute',
    right: 10,
  },
});

export default Input;
