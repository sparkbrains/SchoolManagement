import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import FilterBadge from '../components/reports/FilterBadge';
import Card from '../components/reports/Card';
import ScheduleTable from '../components/reports/ScheduleTable';
import {ScrollView} from 'react-native';
import DateTimePickerUtility from '../components/DateTimePicker';
import StyledText from '../components/Text';
import Fetch from '../helpers/fetch';
import {ReportTypes} from '../types/types';
import ScreenLoader from '../components/ScreenLoader';
import {
  generateColumns,
  generateRows,
  generateTableData,
} from '../helpers/common-functions';

type FilterType = 'Today' | 'This Week' | 'This Month' | 'Custom';
const filters: FilterType[] = ['Today', 'This Week', 'This Month', 'Custom'];
type CustomDatePicker = {
  startDate: string | null;
  endDate: string | null;
};

const initialReportState: ReportTypes = {
  data: [],
  summary: {
    total_classes: 0,
    total_overtime_minutes: 0,
    total_short_time_minutes: 0,
    total_time_spent_minutes: 0,
  },
};

const Reports: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Today');
  const [selectedDates, setSelectedDates] = useState<CustomDatePicker>({
    startDate: null,
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ReportTypes>(initialReportState);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any>({}); // TODO

  // today, this_week, this_month, custom
  const fetchData = (
    filterType: string,
    startDate: Date | null = null,
    endDate: Date | null = null,
  ) => {
    setIsLoading(true);
    let params = '';
    if (filterType === 'custom') {
      params = `&startDate=${startDate}&endDate=${endDate}`;
    }
    Fetch(
      `reports/?filter=${filterType}${filterType === 'custom' ? params : ''}`,
    ).then(res => {
      setIsLoading(false);
      if (res.status) {
        let arr = generateColumns(res?.data?.data);
        let arr2 = generateRows(res?.data?.data);
        let tableData = generateTableData(res?.data?.data);

        setTableData(tableData);
        setColumns(arr);
        setRows(arr2);
        setData(res?.data);
      }
    });
  };

  const handleChangeFilter = (filter: FilterType) => {
    switch (filter) {
      case 'Today':
        fetchData('today');
        break;
      case 'This Week':
        fetchData('this_week');
        break;
      case 'This Month':
        fetchData('this_month');
        break;
      // case 'Custom':
      //   fetchData('custom');
      //   break;
    }
    setSelectedFilter(filter);
  };

  const handleDateChange = (
    type: 'startDate' | 'endDate',
    value: Date | null,
  ) => {
    if (selectedDates?.startDate && type === 'endDate' && value) {
      fetchData('custom', selectedDates?.startDate, value);
    } else if (selectedDates?.endDate && type === 'startDate' && value) {
      fetchData('custom', value, selectedDates?.endDate);
    }
    setSelectedDates(prevState => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  useEffect(() => {
    fetchData('today');
  }, []);

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

        {isLoading ? (
          <ScreenLoader />
        ) : (
          <>
            {selectedFilter === 'Custom' && (
              <View style={styles.datePickersContainer}>
                <View style={styles.datePicker}>
                  <DateTimePickerUtility
                    handleChange={value => handleDateChange('startDate', value)}
                    selectedDate={selectedDates?.startDate}
                    label="Start Date"
                    maximumDate={
                      selectedDates?.endDate
                        ? selectedDates?.endDate
                        : undefined
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
              <View style={styles.cardWrapper}>
                <Card
                  title={'Total Overtime'}
                  time={data?.summary?.total_overtime_minutes}
                  description={'Extra time spent'}
                  iconName={'access-time'}
                />
              </View>
              <View style={styles.cardWrapper}>
                <Card
                  title={'Total Short Time'}
                  time={data?.summary?.total_short_time_minutes}
                  description={'Less time spent'}
                  iconName={'timer-off'}
                />
              </View>
              <View style={styles.cardWrapper}>
                <Card
                  title={'Total Classes'}
                  time={data?.summary?.total_classes}
                  description={'Classes attended'}
                  iconName={'class'}
                />
              </View>
              <View style={styles.cardWrapper}>
                <Card
                  title={'Total Time Spent'}
                  time={data?.summary?.total_time_spent_minutes}
                  description={'Overall time spent'}
                  iconName={'schedule'}
                />
              </View>
            </View>

            <StyledText
              fontSize={fontSize.h4}
              style={styles.detailedReportText}
              text="Detailed Report"
            />

            <ScheduleTable
              columns={columns}
              rows={rows}
              detailedInfo={tableData}
            />

            {/* <View style={styles.noDataText}>
              <StyledText
                fontSize={fontSize.h4}
                text="No data to show for this day"
              />
            </View> */}
          </>
        )}
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
  noDataText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90%',
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
