import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {borderRadius, colors, fontSize, spacing} from '../../styles/base';
import StyledText from '../Text';

type FilterType = 'Today' | 'This Week' | 'This Month' | 'Custom';

type Props = {
  filter: FilterType;
  handleChangeFilter: (filter: FilterType) => void;
  selectedFilter: FilterType;
};

const FilterBadge: React.FC<Props> = ({
  filter,
  handleChangeFilter,
  selectedFilter,
}) => {
  return (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterOption,
        selectedFilter === filter && styles.activeFilter,
      ]}
      onPress={() => handleChangeFilter(filter)}>
      <StyledText
        text={filter}
        fontSize={fontSize.h4}
        style={[
          styles.filterText,
          selectedFilter === filter && styles.activeFilterText,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterOption: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.large,
    backgroundColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.textPrimary,
  },
  activeFilterText: {
    color: colors.white,
  },
});

export default FilterBadge;
