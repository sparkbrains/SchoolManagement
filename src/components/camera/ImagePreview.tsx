import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {spacing} from '../../styles/base';
import ButtonWithIcon from '../ButtonWithIcon';

type Props = {
  capturedPhoto: {path: string};
  handleRetake: () => void;
  isUploading: boolean;
  handleConfirm: () => void;
};

const ImagePreview: React.FC<Props> = ({
  capturedPhoto,
  handleRetake,
  isUploading,
  handleConfirm,
}) => {
  return (
    <View style={styles.previewContainer}>
      <Image
        source={{uri: `file://${capturedPhoto.path}`}}
        style={styles.previewImage}
      />
      <View style={styles.previewButtonContainer}>
        <ButtonWithIcon
          handleClick={handleRetake}
          isUploading={false}
          text="Retake"
          icon="refresh"
        />
        <ButtonWithIcon
          handleClick={handleConfirm}
          isUploading={isUploading}
          text="Confirm"
          icon="check"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '85%',
  },
  previewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: spacing.large,
    flex: 1,
  },
});

export default ImagePreview;
