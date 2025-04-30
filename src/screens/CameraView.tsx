import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  BackHandler,
} from 'react-native';
import {colors, fontSize, spacing} from '../styles/base';
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PhotoFile} from 'react-native-vision-camera';
import {convertImageFormat, showToast} from '../helpers/common-functions';
import ImagePreview from '../components/camera/ImagePreview';
import StyledText from '../components/Text';
import CustomModal from '../components/CustomModal';
import Fetch from '../helpers/fetch';
import moment from 'moment';
import {CameraScreenProps} from '../types/screen-props';
import ReasonModal from '../components/home/ReasonModal';

const CameraView: React.FC<CameraScreenProps> = ({route, navigation}) => {
  const {type, scheduleId, startTime, endTime} = route.params;
  const [isLateArrival, setIsLateArrival] = useState(false);
  const [isEarlyLeave, setIsEarlyLeave] = useState(false);
  const [isLateLeave, setIsLateLeave] = useState(false);

  const calculateTimeScenarios = () => {
    const currentTime = moment();
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');

    if (type === 'PUNCH_IN') {
      const lateByMinutes = currentTime.diff(start, 'minutes');
      console.log('latebyminutes===', lateByMinutes, currentTime);
      setIsLateArrival(lateByMinutes > 5);
    }

    if (type === 'PUNCH_OUT') {
      const minutesBeforeEnd = end.diff(currentTime, 'minutes');
      const minutesAfterEnd = currentTime.diff(end, 'minutes');

      if (minutesBeforeEnd > 5) {
        setIsEarlyLeave(true);
        setIsLateLeave(false);
      } else if (minutesAfterEnd > 5) {
        setIsLateLeave(true);
        setIsEarlyLeave(false);
      } else {
        setIsEarlyLeave(false);
        setIsLateLeave(false);
      }
    }
  };

  const {hasPermission, requestPermission} = useCameraPermission();
  const [isPermissionProvided, setIsPermissionProvided] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<CameraPosition>('front');
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const [isUploading, setIsUploading] = useState(false); // New state for upload status
  const [showModal, setShowModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');
  const [punchStatus, setPunchStatus] = useState('');

  const camera = useRef<Camera>(null);
  const device = useCameraDevice(currentCamera);

  useEffect(() => {
    const backAction = () => {
      if (isUploading) {
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the back handler
  }, [isUploading]);

  const handleShowSettings = () => {
    Linking.openSettings();
    navigation.goBack();
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then(newPermission => {
        if (!newPermission) {
          setShowModal(true);
          setIsPermissionProvided(false);
        } else {
          setIsPermissionProvided(true);
        }
      });
    } else if (hasPermission) {
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
      setCapturedPhoto(photo);
    } catch (error) {
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

  const handleConfirm = async () => {
    setIsUploading(true);
    try {
      const file = convertImageFormat(capturedPhoto?.path as string);

      Fetch(
        `teachers/${scheduleId}/mark-attendance/`,
        {
          ...(type === 'PUNCH_IN'
            ? {in_time: moment().format('HH:mm')}
            : {out_time: moment().format('HH:mm')}),
          ...(type === 'PUNCH_IN'
            ? {punch_in_photo: file}
            : {punch_out_photo: file}),
          ...(showReasonModal
            ? {
                [punchStatus === 'is_late' ? 'late_reason' : 'early_reason']:
                  reason,
              }
            : {}),
        },
        {method: 'post', inFormData: true},
      ).then((res: any) => {
        setIsUploading(false);
        if (res.status) {
          showToast(`Punch ${type === 'PUNCH_IN' ? 'in' : 'out'} successful`);
          setCapturedPhoto(null);
          route.params.onGoBack(type);
          navigation.goBack();
        } else {
          if (res?.is_late || res?.is_early) {
            calculateTimeScenarios();
            setShowReasonModal(true);
          }
          if (res?.is_late) {
            setPunchStatus('is_late');
          } else {
            setPunchStatus('is_early');
          }
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo.');
    } finally {
      // setIsUploading(false);
      // setCapturedPhoto(null);
      // route.params.onGoBack(type);
      // navigation.goBack();
    }
  };

  const handleFlipCamera = () => {
    setCurrentCamera(prevCamera => (prevCamera === 'front' ? 'back' : 'front'));
  };

  const handleCancel = () => {
    setShowModal(false);
    navigation.goBack();
  };

  if (!device) {
    return (
      <View style={styles.blankScreen}>
        <StyledText fontSize={fontSize.h4} text="No camera device found." />
      </View>
    );
  }

  console.log('check====', isLateArrival, isEarlyLeave, isLateLeave);

  const getTitle = () => {
    if (isLateArrival) {
      return 'Reason for arriving late';
    } else if (isEarlyLeave) {
      return 'Reason for leaving early';
    } else {
      return 'Reason for staying late';
    }
  };

  return (
    <>
      {isPermissionProvided ? (
        <View style={styles.previewContainer}>
          {capturedPhoto ? (
            <ImagePreview
              capturedPhoto={capturedPhoto}
              handleRetake={handleRetake}
              isUploading={isUploading}
              handleConfirm={handleConfirm}
            />
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
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}>
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
      ) : (
        <View style={styles.blankScreen}></View>
      )}

      <CustomModal
        visible={showModal}
        title="Camera Permission Required"
        text="Camera permission is required to use this feature. Please enable it in Settings."
        primaryButtonText="Settings"
        secondaryButtonText="Cancel"
        onPrimaryButtonPress={handleShowSettings}
        onRequestClose={handleCancel}
        onSecondaryButtonPress={handleCancel}
      />
      <ReasonModal
        visible={showReasonModal}
        reason={reason}
        changeReason={(text: string) => setReason(text)}
        title={getTitle()}
        onSubmit={handleConfirm}
        onRequestClose={() => {}}
        isLoading={isUploading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blankScreen: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: colors.primary,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: spacing.large,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: spacing.medium,
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
