import * as React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../styles/base';

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.buttonContainer}>
            {secondaryButtonText ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={onSecondaryButtonPress}>
                  <Text style={styles.buttonText}>{secondaryButtonText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={onPrimaryButtonPress}>
                  <Text style={styles.buttonText}>{primaryButtonText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.fullWidthButton]}
                onPress={onPrimaryButtonPress}>
                <Text style={styles.buttonText}>{primaryButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  fullWidthButton: {
    backgroundColor: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default CustomModal;
