import * as React from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  spacing,
  utilityStyles,
} from '../styles/base';
import StyledText from './Text';
import Button from './button';

interface CustomModalProps {
  visible: boolean;
  title: string;
  text: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryButtonPress: () => void;
  onSecondaryButtonPress?: () => void;
  onRequestClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  text,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  onRequestClose,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={utilityStyles.modalOverlay}>
        <View style={styles.modalContainer}>
          <StyledText
            text={title}
            style={styles.title}
            fontSize={fontSize.h2}
          />
          <StyledText text={text} style={styles.text} fontSize={fontSize.h4} />
          <View style={styles.buttonContainer}>
            {secondaryButtonText && onSecondaryButtonPress ? (
              <>
                <Button
                  filled={false}
                  title={secondaryButtonText}
                  onPress={onSecondaryButtonPress}
                  style={{width: '45%'}}
                />
                <Button
                  title={primaryButtonText}
                  onPress={onPrimaryButtonPress}
                  style={{width: '45%'}}
                />
              </>
            ) : (
              <Button
                title={primaryButtonText}
                onPress={onPrimaryButtonPress}
                style={{marginHorizontal: 'auto', width: '50%'}}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium + 2,
    padding: spacing.large,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.medium + 2,
  },
  text: {
    marginBottom: spacing.large - 4,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: spacing.medium + 2,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  fullWidthButton: {
    backgroundColor: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginLeft: spacing.medium + 2,
  },
  secondaryButton: {
    backgroundColor: '#ccc',
    marginRight: spacing.medium + 2,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default CustomModal;
