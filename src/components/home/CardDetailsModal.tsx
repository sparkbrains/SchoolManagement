import React, {useState} from 'react';
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
import UploadedImage from './UploadedImage';
import Icon from 'react-native-vector-icons/Ionicons';

interface CardDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  logs: any;
  startTime: string;
  endTime: string;
  scheduleDate: string;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  visible,
  onClose,
  logs,
  startTime,
  endTime,
  scheduleDate,
}) => {
  const [showImagePreview, setShowImagePreview] = useState('');

  const staticPunchInTime = logs?.last_punch_in_time
    ? moment(logs?.last_punch_in_time, 'HH:mm:ss').format('LT')
    : 'N/A';
  const staticPunchOutTime = logs?.last_punch_out_time
    ? moment(logs?.last_punch_out_time, 'HH:mm:ss').format('LT')
    : 'N/A';
  const punchInDifference = logs?.punch_in_diff;
  const punchOutDifference = logs?.punch_out_diff;
  const punchInLateReason = logs?.punch_in_late_reason?.trim();
  const punchOutLateReason = logs?.punch_out_early_reason?.trim();
  const totalTimeSpent = logs?.total_time_spent_minutes || 'N/A';
  const scheduleFor = scheduleDate || 'N/A';

  const showPunchInTextInRed =
    logs?.last_punch_in_time &&
    moment(logs.last_punch_in_time, 'HH:mm').diff(
      moment(startTime, 'HH:mm'),
      'minutes',
    ) > 5;

  const showPunchOutTextInRed =
    logs?.last_punch_out_time &&
    (moment(logs.last_punch_out_time, 'HH:mm').diff(
      moment(endTime, 'HH:mm'),
      'minutes',
    ) > 5 ||
      moment(endTime, 'HH:mm').diff(
        moment(logs.last_punch_out_time, 'HH:mm'),
        'minutes',
      ) > 5);

  return (
    <>
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
                  text={'Schedule For: '}
                  fontSize={fontSize.h4}
                  style={styles.infoText}
                />
                <StyledText
                  text={scheduleFor}
                  fontSize={fontSize.h4}
                  style={styles.labelText}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <StyledText
                  text={'Scheduled Time: '}
                  fontSize={fontSize.h4}
                  style={styles.infoText}
                />
                <StyledText
                  text={`${moment(startTime, 'HH:mm:ss').format(
                    'LT',
                  )} - ${moment(endTime, 'HH:mm:ss').format('LT')}`}
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
                <View style={styles.textAndIconContainer}>
                  <StyledText
                    text={`${staticPunchInTime || 'N/A'}`}
                    fontSize={fontSize.h4}
                    style={styles.labelText}
                  />
                  {logs?.punch_in_photo && (
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => setShowImagePreview('punch-in-photo')}>
                      <Icon
                        name={'eye-outline'}
                        size={20}
                        color={colors.white}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <StyledText
                  text="Punch Out Time: "
                  fontSize={fontSize.h4}
                  style={styles.infoText}
                />
                <View style={styles.textAndIconContainer}>
                  <StyledText
                    text={`${staticPunchOutTime || 'N/A'}`}
                    fontSize={fontSize.h4}
                    style={styles.labelText}
                  />
                  {logs?.punch_out_photo && (
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => setShowImagePreview('punch-out-photo')}>
                      <Icon
                        name={'eye-outline'}
                        size={20}
                        color={colors.white}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <StyledText
                  text="Total Time Spent: "
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
                  style={
                    showPunchInTextInRed
                      ? styles.warningText
                      : styles.successText
                  }
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
                  style={
                    showPunchOutTextInRed
                      ? styles.warningText
                      : styles.successText
                  }
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
      <UploadedImage
        visible={!!showImagePreview}
        onRequestClose={() => setShowImagePreview('')}
        imageUrl={
          showImagePreview === 'punch-in-photo'
            ? logs?.punch_in_photo
            : logs?.punch_out_photo
        }
      />
    </>
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
  successText: {
    marginVertical: spacing.small,
    fontWeight: '500',
    color: colors.secondary,
  },

  textButton: {
    color: 'blue',
    fontSize: 16,
  },

  textAndIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.small,
  },

  iconButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CardDetailsModal;
