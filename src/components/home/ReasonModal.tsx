import React from 'react';
import {Modal, View, StyleSheet, TextInput, Dimensions} from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  spacing,
  utilityStyles,
} from '../../styles/base';
import StyledText from '../Text';
import Button from '../button';

interface ReasonModalProps {
  visible: boolean;
  title: string;
  onSubmit: (reason: string) => void;
  onRequestClose: () => void;
  reason: string;
  changeReason: (text: string) => void;
  isLoading: boolean;
}

const ReasonModal: React.FC<ReasonModalProps> = ({
  visible,
  title,
  onSubmit,
  onRequestClose,
  reason,
  changeReason,
  isLoading,
}) => {
  const handleSubmit = () => {
    onSubmit(reason);
  };

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
          <TextInput
            style={styles.textArea}
            placeholder="Enter your reason here..."
            placeholderTextColor={colors.textSecondary}
            multiline={true}
            value={reason}
            onChangeText={text => changeReason(text)}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              onPress={handleSubmit}
              disabled={!reason.trim()}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '80%',
    maxHeight: Dimensions.get('window').height * 0.6,
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium + 2,
    padding: spacing.large,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.medium + 2,
  },
  textArea: {
    width: '100%',
    height: 120,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    textAlignVertical: 'top',
    marginBottom: spacing.large,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default ReasonModal;
