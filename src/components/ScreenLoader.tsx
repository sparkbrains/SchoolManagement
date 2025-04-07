import {ActivityIndicator, StyleSheet} from 'react-native';
import {colors} from '../styles/base';
import {View} from 'react-native';

const ScreenLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default ScreenLoader;
