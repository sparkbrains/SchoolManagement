import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import StyledText from '../Text';
import Button from '../button';
import {colors, fontSize} from '../../styles/base';
import Badge from '../Badge';

interface CardProps {
  subject: string;
  className: string;
  timing: string;
  handlePunchIn: () => void;
  status: string;
}

const Card: React.FC<CardProps> = ({
  subject,
  className,
  timing,
  status,
  handlePunchIn,
}) => {
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
        text={timing}
        fontSize={fontSize.h3}
        style={styles.cardText}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Punch In"
          onPress={handlePunchIn}
          style={styles.button}
        />
        <Button
          title="Punch Out"
          onPress={() => {}}
          style={styles.button}
          filled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    marginBottom: 10,
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
