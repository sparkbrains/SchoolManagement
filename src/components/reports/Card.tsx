import {StyleSheet, Text, View} from 'react-native';
import {borderRadius, colors, fontSize, spacing} from '../../styles/base';
import StyledText from '../Text';

type Props = {
  title: string;
  time: string;
  description: string;
  iconName: string;
};

const Card: React.FC<Props> = ({title, time, description, iconName}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {/* <MaterialIcons name={iconName} size={24} color="#007AFF" /> */}
      </View>

      <StyledText fontSize={fontSize.h3} style={styles.time} text={time} />

      <StyledText
        fontSize={fontSize.h5}
        style={styles.description}
        text={description}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.small,
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  time: {
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default Card;
