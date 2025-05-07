import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors, fontSize, spacing} from '../styles/base';
import StyledText from './Text';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment-timezone';

interface DateTimePickerUtilityProps {
  mode?: 'date' | 'time';
  handleChange: (value: string | null) => void;
  selectedDate: string | null;
  label: string;
  disabled?: boolean;
  minimumDate?: string | undefined;
  maximumDate?: string | undefined;
}

const DateTimePickerUtility: React.FC<DateTimePickerUtilityProps> = ({
  mode = 'date',
  handleChange,
  selectedDate,
  label,
  disabled = false,
  minimumDate = undefined,
  maximumDate = undefined,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (event.nativeEvent.timestamp) {
      const istDate = moment(event.nativeEvent.timestamp)
        .tz('Asia/Kolkata')
        .format('YYYY-MM-DD');

      handleChange(istDate);
    }

    setShowPicker(false);
  };

  console.log('selected date===', selectedDate);

  const getDisplayText = (): string => {
    return selectedDate || 'Select Date';
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  const resetSelection = () => {
    handleChange(null);
  };

  return (
    <View style={styles.container}>
      <StyledText fontSize={fontSize.h5} style={styles.label} text={label} />
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={openPicker}
        activeOpacity={0.7}>
        <StyledText
          style={[styles.buttonText, !selectedDate && styles.placeholderText]}
          fontSize={fontSize.h4}
          text={getDisplayText()}
        />
        {selectedDate && (
          <TouchableOpacity
            onPress={resetSelection}
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
            <Icon name="close" size={20} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={
            selectedDate
              ? moment(selectedDate, 'YYYY-MM-DD').toDate()
              : new Date()
          }
          minimumDate={
            minimumDate ? moment(minimumDate, 'YYYY-MM-DD').toDate() : undefined
          }
          maximumDate={
            maximumDate ? moment(maximumDate, 'YYYY-MM-DD').toDate() : undefined
          }
          mode={mode}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
          disabled={disabled}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  label: {
    marginVertical: spacing.small,
  },
  pickerButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
});

export default DateTimePickerUtility;
