import React, {useState} from 'react';
import {View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {borderRadius, colors, spacing} from '../styles/base';
import FilterBadge from '../components/reports/FilterBadge';
import {reportsCardData} from '../static/data';
import Card from '../components/reports/Card';

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
      <FlatList
        data={reportsCardData}
        renderItem={({item}) => (
          <Card
            title={item.title}
            time={item.time}
            description={item.description}
            iconName={item.iconName}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Two cards per row
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: spacing.medium,
    borderRadius: borderRadius.small,
  },
});

export default Reports;
