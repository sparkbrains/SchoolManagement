import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import StyledText from './Text';
import {colors, fontSize, spacing} from '../styles/base';

type Props = {
  text: string;
  onPress: () => void;
  customStyles?: ViewStyle;
};

const TextButton: React.FC<Props> = ({text, onPress, customStyles}) => {
  return (
    <TouchableOpacity style={[customStyles]} onPress={onPress}>
      <StyledText text={text} fontSize={fontSize.h5} style={{color: colors.primary}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default TextButton;
