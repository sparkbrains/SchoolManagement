import React from 'react';
import {Text, StyleSheet, TextProps, TextStyle, StyleProp} from 'react-native';
import {getFontSize} from '../helpers/font';

interface Props extends TextProps {
  text: string;
  fontSize: number;
  style: StyleProp<TextStyle>;
}

const StyledText: React.FC<Props> = ({text, style, fontSize = 8}) => {
  return <Text style={[style, {fontSize: getFontSize(fontSize)}]}>{text}</Text>;
};

const styles = StyleSheet.create({});

export default StyledText;
