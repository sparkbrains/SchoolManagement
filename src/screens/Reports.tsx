import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import FilterBadge from '../components/reports/FilterBadge';
import {dates, detailedInfo, reportsCardData, timeSlots} from '../static/data';
import Card from '../components/reports/Card';
import ScheduleTable from '../components/reports/ScheduleTable';
import {ScrollView} from 'react-native';
import DateTimePickerUtility from '../components/DateTimePicker';
import StyledText from '../components/Text';

type FilterType = 'Today' | 'This Week' | 'This Month' | 'Custom';
const filters: FilterType[] = ['Today', 'This Week', 'This Month', 'Custom'];
type CustomDatePicker = {
  startDate: string | null;
  endDate: string | null;
};

const Reports: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Today');
  const [selectedDates, setSelectedDates] = useState<CustomDatePicker>({
    startDate: null,
    endDate: null,
  });

  const handleChangeFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  const handleDateChange = (
    type: 'startDate' | 'endDate',
    value: Date | null,
  ) => {
    setSelectedDates(prevState => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.filterContainer}>
          {filters.map((filter: FilterType, index: number) => (
            <FilterBadge
              key={index}
              filter={filter}
              handleChangeFilter={handleChangeFilter}
              selectedFilter={selectedFilter}
            />
          ))}
        </View>
        {selectedFilter === 'Custom' && (
          <View style={styles.datePickersContainer}>
            <View style={styles.datePicker}>
              <DateTimePickerUtility
                handleChange={value => handleDateChange('startDate', value)}
                selectedDate={selectedDates?.startDate}
                label="Start Date"
                maximumDate={
                  selectedDates?.endDate ? selectedDates?.endDate : undefined
                }
              />
            </View>
            <View style={styles.datePicker}>
              <DateTimePickerUtility
                handleChange={value => handleDateChange('endDate', value)}
                selectedDate={selectedDates?.endDate}
                label="End Date"
                disabled={!selectedDates?.startDate}
                minimumDate={
                  selectedDates?.startDate
                    ? selectedDates?.startDate
                    : undefined
                }
              />
            </View>
          </View>
        )}

        <View style={styles.cardContainer}>
          {reportsCardData.map((item, index) => (
            <View style={styles.cardWrapper} key={index}>
              <Card
                title={item.title}
                time={item.time}
                description={item.description}
                iconName={item.iconName}
              />
            </View>
          ))}
        </View>

        <StyledText
          fontSize={fontSize.h4}
          style={styles.detailedReportText}
          text="Detailed Report"
        />

        <ScheduleTable
          columns={timeSlots}
          rows={dates}
          detailedInfo={detailedInfo}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.medium,
  },
  datePicker: {
    width: '48%',
  },
  datePickersContainer: {
    flexDirection: 'row',
    marginVertical: spacing.small,
    paddingHorizontal: spacing.small,
    justifyContent: 'space-between',
  },
  detailedReportText: {
    marginVertical: spacing.small,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: borderRadius.small,
    marginBottom: spacing.small,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '50%',
  },
  detailedReportSection: {
    marginTop: spacing.medium,
  },
});

export default Reports;
