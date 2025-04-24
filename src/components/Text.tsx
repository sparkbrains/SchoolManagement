import React from 'react';
import {Text, TextProps, TextStyle, StyleProp} from 'react-native';

interface Props extends TextProps {
  text: string;
  fontSize?: number;
  style?: StyleProp<TextStyle>;
}

const StyledText: React.FC<Props> = ({text, style, fontSize = 8}) => {
  return <Text style={[style, {fontSize: fontSize}]}>{text}</Text>;
};

export default StyledText;
