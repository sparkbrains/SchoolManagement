import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StyledText from './Text';
import {colors, fontSize, spacing} from '../styles/base';

type Props = {
  handleClick: () => void;
  isUploading: boolean;
  text: string;
  icon: string;
};

const ButtonWithIcon: React.FC<Props> = ({
  handleClick,
  isUploading,
  text,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleClick}
      disabled={isUploading}>
      {isUploading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <>
          <Icon name={icon} size={30} color={colors.white} />
          <StyledText
            text={text}
            style={styles.buttonText}
            fontSize={fontSize.h4}
          />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    minWidth: '30%',
    minHeight: 60,
  },
  buttonText: {
    color: colors.white,
  },
});

export default ButtonWithIcon;
