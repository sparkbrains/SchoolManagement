import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
} from 'react-native';
import {colors, spacing} from '../styles/base';
import {
  Camera,
  CameraDevice,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
  useCameraDevices,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PhotoFile} from 'react-native-vision-camera';

const CameraView = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const [isPermissionProvided, setIsPermissionProvided] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<CameraPosition>('front');
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = useCameraDevice(currentCamera);
  const navigation = useNavigation();

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
      setCapturedPhoto(photo);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo.');
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    // Here you can process the capturedPhoto, e.g., upload it to a server
    // For now, we'll just log the photo object
    Alert.alert('Photo Confirmed', 'Photo confirmed successfully!');
    setCapturedPhoto(null);
    navigation.goBack();
  };

  const handleFlipCamera = () => {
    setCurrentCamera(prevCamera => (prevCamera === 'front' ? 'back' : 'front'));
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
      {capturedPhoto ? (
        <View style={styles.previewContainer}>
          <Image
            source={{uri: `file://${capturedPhoto.path}`}}
            style={styles.previewImage}
          />
          <View style={styles.previewButtonContainer}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetake}>
              <Icon name="refresh" size={30} color={colors.white} />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}>
              <Icon name="check" size={30} color={colors.white} />
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
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
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="close" size={30} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={handleFlipCamera}>
            <Icon name="flip-camera-ios" size={30} color={colors.white} />
          </TouchableOpacity>
        </>
      )}
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
  closeButton: {
    position: 'absolute',
    top: 40,
    right: spacing.large,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: spacing.medium,
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  previewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: spacing.large,
  },
  retakeButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  buttonText: {
    color: colors.white,
  },
  flipButton: {
    position: 'absolute',
    top: 120,
    right: spacing.large,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: spacing.medium,
  },
});

export default CameraView;
