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
}) => {
  const now = moment();
  const start = moment(startTime, 'HH:mm:ss');
  const end = moment(endTime, 'HH:mm:ss').add(5, 'minutes');
  const isWithinTime =
    now.isBetween(start, end) &&
    (status === 'Upcoming' || status === 'Ongoing');

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
          <Badge
            status={status}
            isValid={
              logs?.last_punch_out_time &&
              logs?.last_punch_in_time &&
              !isEarly &&
              !isLate
            }
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name={'eye-outline'} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <StyledText
        text={`${moment(startTime, 'HH:mm:ss').format('LT')} - ${moment(
          endTime,
          'HH:mm:ss',
        ).format('LT')}`}
        fontSize={fontSize.h3}
        style={isWithinTime && styles.cardText}
      />

      {isWithinTime && (
        <View style={styles.buttonContainer}>
          <Button
            title="Punch In"
            onPress={handlePunchIn}
            style={styles.button}
            disabled={status === 'Ongoing'}
          />
          <Button
            title="Punch Out"
            onPress={handlePunchOut}
            style={styles.button}
            filled={false}
            disabled={status !== 'Ongoing'}
          />
        </View>
      )}
      <CardDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        logs={logs}
        startTime={startTime}
        endTime={endTime}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  infoText: {
    marginBottom: spacing.small,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    padding: 15,
    marginBottom: spacing.large - 4,
    ...boxShadow,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.medium + 2,
  },
  cardText: {
    marginBottom: spacing.medium + 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  classAndStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Card;
