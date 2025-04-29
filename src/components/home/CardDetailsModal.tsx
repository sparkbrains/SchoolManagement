import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import StyledText from '../Text';
import Button from '../button';
import {borderRadius, colors, fontSize, spacing} from '../../styles/base';
import moment from 'moment';

interface CardDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  logs: any;
  startTime: string;
  endTime: string;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  visible,
  onClose,
  logs,
  startTime,
  endTime,
}) => {
  const staticPunchInTime = logs?.last_punch_in_time
    ? moment(logs?.last_punch_in_time, 'HH:mm:ss').format('LT')
    : 'N/A';
  const staticPunchOutTime = logs?.last_punch_out_time
    ? moment(logs?.last_punch_out_time, 'HH:mm:ss').format('LT')
    : 'N/A';
  const punchInDifference = logs?.punch_in_diff;
  const punchOutDifference = logs?.punch_out_diff;
  const punchInLateReason = logs?.punch_in_late_reason;
  const punchOutLateReason = logs?.punch_out_early_reason;
  const totalTimeSpent = logs?.total_time_spent_minutes || 'N/A';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <StyledText
            text="Class Details"
            fontSize={fontSize.h2}
            style={styles.modalTitle}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}>
            <View style={{flexDirection: 'row'}}>
              <StyledText
                text={'Scheduled Time: '}
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${moment(startTime, 'HH:mm:ss').format('LT')} - ${moment(
                  endTime,
                  'HH:mm:ss',
                ).format('LT')}`}
                fontSize={fontSize.h4}
                style={styles.labelText}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <StyledText
                text="Punch In Time: "
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${staticPunchInTime || 'N/A'}`}
                fontSize={fontSize.h4}
                style={styles.labelText}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <StyledText
                text="Punch Out Time: "
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${staticPunchOutTime || 'N/A'}`}
                fontSize={fontSize.h4}
                style={styles.labelText}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <StyledText
                text="Total time spent: "
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${totalTimeSpent || 'N/A'}`}
                fontSize={fontSize.h4}
                style={styles.labelText}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <StyledText
                text="Punch In Difference: "
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${punchInDifference || 'N/A'}`}
                fontSize={fontSize.h4}
                style={styles.warningText}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <StyledText
                text="Punch Out Difference: "
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${punchOutDifference || 'N/A'}`}
                fontSize={fontSize.h4}
                style={styles.warningText}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <StyledText
                text="Reason for Late Punch In: "
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${punchInLateReason || 'N/A'}`}
                fontSize={fontSize.h4}
                style={styles.labelText}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <StyledText
                text="Reason for Late Punch Out: "
                fontSize={fontSize.h4}
                style={styles.infoText}
              />
              <StyledText
                text={`${punchOutLateReason || 'N/A'}`}
                fontSize={fontSize.h4}
                style={styles.labelText}
              />
            </View>
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Button title="Close" onPress={onClose} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.large,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.medium,
  },
  scrollView: {
    maxHeight: Dimensions.get('window').height * 0.5,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: spacing.large,
  },
  infoText: {
    marginVertical: spacing.small,
    fontWeight: '500',
  },
  labelText: {
    marginVertical: spacing.small,
  },
  warningText: {
    marginVertical: spacing.small,
    fontWeight: '500',
    color: colors.error,
  },
  closeButton: {
    marginTop: spacing.large,
    width: '100%',
  },
});

export default CardDetailsModal;
