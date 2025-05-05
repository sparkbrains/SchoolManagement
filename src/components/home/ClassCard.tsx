import * as React from 'react';
import {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import StyledText from '../Text';
import Button from '../button';
import {
  borderRadius,
  boxShadow,
  colors,
  fontSize,
  spacing,
} from '../../styles/base';
import Badge from '../Badge';
import moment from 'moment';
import CardDetailsModal from './CardDetailsModal';
import Icon from 'react-native-vector-icons/Ionicons';

interface CardProps {
  subject: string;
  className: string;
  startTime: string;
  endTime: string;
  handlePunchIn: () => void;
  status: string;
  logs: any;
  handlePunchOut: () => void;
  isEarly?: boolean;
  isLate?: boolean;
  scheduleDate: string;
  timerRunning?: boolean;
  dataType: 'currentDay' | 'previous' | 'next';
}

const Card: React.FC<CardProps> = ({
  subject,
  className,
  startTime,
  endTime,
  status,
  handlePunchIn,
  handlePunchOut,
  logs,
  isEarly,
  isLate,
  scheduleDate,
  timerRunning,
  dataType,
}) => {
  const now = moment();
  const start = moment(startTime, 'HH:mm:ss');
  const end = moment(endTime, 'HH:mm:ss');
  const isWithinTime = now.isAfter(start);
  const allowPunchIn = now.isBetween(start, end);

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.classAndStatus}>
        <StyledText
          text={`${subject} - ${className}`}
          fontSize={fontSize.h3}
          style={styles.cardTitle}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
          }}>
          {(dataType === 'currentDay' || dataType === 'previous') && (
            <Badge
              status={status}
              isValid={
                logs?.last_punch_out_time &&
                logs?.last_punch_in_time &&
                !isEarly &&
                !isLate
              }
            />
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <StyledText
          text={`${moment(startTime, 'HH:mm:ss').format('LT')} - ${moment(
            endTime,
            'HH:mm:ss',
          ).format('LT')}`}
          fontSize={fontSize.h3}
          style={styles.cardText}
        />
      </View>
      {dataType === 'currentDay' &&
        isWithinTime &&
        (!logs?.last_punch_in_time || !logs?.last_punch_out_time) && (
          <View style={styles.buttonContainer}>
            <Button
              title="Punch In"
              onPress={handlePunchIn}
              style={styles.button}
              disabled={
                !!logs?.last_punch_in_time || !allowPunchIn || timerRunning
              }
            />
            <Button
              title="Punch Out"
              onPress={handlePunchOut}
              style={styles.button}
              filled={false}
              disabled={
                !logs?.last_punch_in_time || !!logs?.last_punch_out_time
              }
            />
          </View>
        )}

      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}>
        <Icon
          name={'information-circle-outline'}
          size={20}
          color={colors.info}
        />
        <StyledText
          text="Details"
          fontSize={fontSize.h4}
          style={styles.infoButtonText}
        />
      </TouchableOpacity>

      <CardDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        logs={logs}
        startTime={startTime}
        endTime={endTime}
        scheduleDate={scheduleDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    padding: 15,
    marginBottom: spacing.large - 4,
    ...boxShadow,
  },

  cardTitle: {
    fontWeight: 'bold',
  },

  cardText: {
    marginBottom: spacing.medium,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.medium,
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
  },

  classAndStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoButton: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.large,
    paddingHorizontal: spacing.medium,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.info,
    gap: 8,
    width: '100%',
    height: 44,
  },
  infoButtonText: {
    color: colors.primary,
  },
});

export default Card;
