import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors, fontSize, spacing} from '../styles/base';
import StyledText from './Text';

interface DateTimePickerUtilityProps {
  mode?: 'date' | 'time';
  allowRange?: boolean;
  onConfirm: (selectedDates: {startDate: Date; endDate?: Date}) => void;
}

const DateTimePickerUtility: React.FC<DateTimePickerUtilityProps> = ({
  mode = 'date',
  allowRange = false,
  onConfirm,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleConfirm = (_: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      if (allowRange) {
        if (!isSelectingEndDate) {
          setStartDate(selectedDate);
          setIsSelectingEndDate(true);
        } else {
          setEndDate(selectedDate);
          setIsSelectingEndDate(false);
          onConfirm({startDate: startDate!, endDate: selectedDate});
        }
      } else {
        setStartDate(selectedDate);
        onConfirm({startDate: selectedDate});
      }
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  return (
    <View>
      <Button
        title={
          allowRange
            ? isSelectingEndDate
              ? 'Select End Date'
              : 'Select Start Date'
            : 'Pick Date/Time'
        }
        onPress={openPicker}
      />

      <View style={styles.dateDisplayContainer}>
        {startDate && (
          <StyledText
            fontSize={fontSize.h4}
            text={`Start Date: ${startDate.toLocaleString()}`}
          />
        )}
        {allowRange && endDate && (
          <StyledText
            fontSize={fontSize.h4}
            text={`End Date: ${endDate.toLocaleString()}`}
          />
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleConfirm}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateDisplayContainer: {
    marginTop: spacing.small,
    padding: spacing.small,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default DateTimePickerUtility;
