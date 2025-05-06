import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {borderRadius, colors, spacing} from '../styles/base';
import FilterBadge from '../components/reports/FilterBadge';
import {dummyData, reportsCardData} from '../static/data';
import Card from '../components/reports/Card';
import DetailedInfo from '../components/reports/DetailedInfo';

type FilterType = 'Today' | 'This Week' | 'This Month' | 'Custom';
const filters: FilterType[] = ['Today', 'This Week', 'This Month', 'Custom'];

const Reports: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Today');

  const handleChangeFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <FlatList
        data={dummyData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => <DetailedInfo data={item} />}
        contentContainerStyle={styles.detailedReportSection}
      />

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.medium,
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
