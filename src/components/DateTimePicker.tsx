import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors, fontSize, spacing} from '../styles/base';
import StyledText from './Text';
import Icon from 'react-native-vector-icons/Ionicons';

interface DateTimePickerUtilityProps {
  mode?: 'date' | 'time';
  allowRange?: boolean;
  onConfirm: (selectedDates: {startDate: Date; endDate?: Date}) => void;
  handleChange: (value: Date | null) => void;
  selectedDate: Date | null;
}

const DateTimePickerUtility: React.FC<DateTimePickerUtilityProps> = ({
  mode = 'date',
  allowRange = false,
  onConfirm,
  handleChange,
  selectedDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = (_: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      handleChange(selectedDate);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return mode === 'date'
      ? date.toLocaleDateString()
      : mode === 'time'
      ? date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
      : date.toLocaleString();
  };

  const getDisplayText = (): string => {
    if (!selectedDate) {
      return allowRange
        ? isSelectingEndDate
          ? 'Select End Date/Time'
          : 'Select Start Date/Time'
        : `Select ${mode === 'date' ? 'Date' : 'Time'}`;
    }

    if (allowRange) {
      if (!selectedDate) {
        if (isSelectingEndDate) {
          return `${formatDate(selectedDate)} - Select End`;
        }
        return formatDate(selectedDate);
      }
      return `${formatDate(selectedDate)} - ${formatDate(endDate)}`;
    }

    return formatDate(selectedDate);
  };

  const openPicker = () => {
    if (allowRange && selectedDate) {
      setIsSelectingEndDate(true);
    } else {
      setIsSelectingEndDate(false);
    }
    setShowPicker(true);
  };

  const resetSelection = () => {
    handleChange(null);
    setIsSelectingEndDate(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={openPicker}
        activeOpacity={0.7}>
        <StyledText
          style={[styles.buttonText, !selectedDate && styles.placeholderText]}
          fontSize={fontSize.h4}
          text={getDisplayText()}
        />
      </TouchableOpacity>

      {selectedDate && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetSelection}
          hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
          <Icon name="close" size={20} />
        </TouchableOpacity>
      )}

      {showPicker && (
        <DateTimePicker
          value={isSelectingEndDate && selectedDate ? selectedDate : new Date()}
          minimumDate={
            isSelectingEndDate && selectedDate ? selectedDate : undefined
          }
          mode={mode}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleConfirm}
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
  pickerButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  resetButton: {
    position: 'absolute',
    right: spacing.small,
    top: '50%',
    transform: [{translateY: -12}],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DateTimePickerUtility;
