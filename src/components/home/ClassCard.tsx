import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import StyledText from '../Text';
import Button from '../button';
import {borderRadius, boxShadow, colors, fontSize, spacing} from '../../styles/base';
import Badge from '../Badge';
import moment from 'moment';

interface CardProps {
  subject: string;
  className: string;
  startTime: string;
  endTime: string;
  handlePunchIn: () => void;
  status: string;
  handlePunchOut: () => void;
}

const Card: React.FC<CardProps> = ({
  subject,
  className,
  startTime,
  endTime,
  status,
  handlePunchIn,
  handlePunchOut,
}) => {
  const now = moment();
  const start = moment(startTime, 'HH:mm:ss');
  const end = moment(endTime, 'HH:mm:ss').add(5, 'minutes');
  const isWithinTime =
    now.isBetween(start, end) &&
    (status === 'Upcoming' || status === 'Ongoing');

  return (
    <View style={styles.card}>
      <View style={styles.classAndStatus}>
        <StyledText
          text={`${subject} - ${className}`}
          fontSize={fontSize.h3}
          style={styles.cardTitle}
        />
        <Badge status={status} />
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
