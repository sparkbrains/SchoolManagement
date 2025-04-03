import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import {colors, spacing} from '../styles/base';
import {
  Camera,
  CameraDevice,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from 'react-native';

const CameraView = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const [isPermissionProvided, setIsPermissionProvided] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<CameraPosition>('front');
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const camera = useRef<Camera>(null);
  const device: CameraDevice = useCameraDevice(currentCamera) as CameraDevice;

  useEffect(() => {
    if (hasPermission === false) {
      requestPermission().then(newPermission => {
        if (!newPermission) {
          Alert.alert(
            'Camera Permission',
            'Camera permission is required to use this feature. Please enable it in Settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => Linking.openSettings(),
              },
            ],
            {cancelable: false},
          );
          setIsPermissionProvided(false);
        } else {
          setIsPermissionProvided(true);
        }
      });
    } else if (hasPermission === true) {
      setIsPermissionProvided(true);
    }
  }, [hasPermission]);

  const handleTakePhoto = async () => {
    if (camera.current == null) return;
    setIsTakingPhoto(true);
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      console.log('photo', photo);
      Alert.alert('Photo Taken', 'Photo captured successfully!');
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo.');
    } finally {
      setIsTakingPhoto(false);
    }
  };

  if (!isPermissionProvided) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Camera Permission Required</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No camera device found.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        preview={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.captureButton,
            isTakingPhoto && styles.disabledCaptureButton,
          ]}
          onPress={handleTakePhoto}
          disabled={isTakingPhoto}>
          {isTakingPhoto ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Icon name="camera-alt" size={30} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing.large,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: spacing.large,
  },
  disabledCaptureButton: {
    backgroundColor: colors.accent,
  },
});

export default CameraView;
