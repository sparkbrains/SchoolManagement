import * as React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from '../../styles/base';

interface FullPageImagePreviewModalProps {
  visible: boolean;
  imageUrl: string;
  onRequestClose: () => void;
}

const UploadedImage: React.FC<FullPageImagePreviewModalProps> = ({
  visible,
  imageUrl,
  onRequestClose,
}) => {
  const [loading, setLoading] = React.useState(true);

  return (
    <Modal
      transparent={false}
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
          <Icon name="close" size={30} color={colors.white} />
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={styles.loader}
          />
        )}

        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.large,
    right: spacing.large,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    zIndex: 5,
  },
});

export default UploadedImage;
