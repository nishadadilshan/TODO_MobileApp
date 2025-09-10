import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInRight,
  FadeOutLeft 
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TodoFilter, TodoSort } from '@/types/Todo';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TodoFiltersProps {
  filter: TodoFilter;
  sort: TodoSort;
  onFilterChange: (filter: TodoFilter) => void;
  onSortChange: (sort: TodoSort) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function TodoFilters({ filter, sort, onFilterChange, onSortChange }: TodoFiltersProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const filterOptions: { value: TodoFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'all', label: 'All', icon: 'list-outline' },
    { value: 'active', label: 'Active', icon: 'radio-button-off-outline' },
    { value: 'completed', label: 'Done', icon: 'checkmark-circle-outline' },
  ];

  const sortOptions: { value: TodoSort; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'created', label: 'Newest', icon: 'time-outline' },
    { value: 'priority', label: 'Priority', icon: 'flag-outline' },
    { value: 'alphabetical', label: 'A-Z', icon: 'text-outline' },
  ];

  const renderFilterButton = (option: typeof filterOptions[0], index: number) => {
    const isSelected = filter === option.value;
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = () => {
      scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
      scale.value = withSpring(1);
    };

    return (
      <AnimatedTouchableOpacity
        key={option.value}
        entering={FadeInRight.delay(index * 100)}
        exiting={FadeOutLeft}
        style={[
          styles.filterButton,
          { backgroundColor: isSelected ? tintColor : backgroundColor },
          animatedStyle
        ]}
        onPress={() => onFilterChange(option.value)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={option.icon} 
          size={16} 
          color={isSelected ? 'black' : iconColor} 
        />
        <ThemedText 
          style={[
            styles.filterButtonText,
            { color: isSelected ? 'black' : textColor }
          ]}
        >
          {option.label}
        </ThemedText>
      </AnimatedTouchableOpacity>
    );
  };

  const renderSortButton = (option: typeof sortOptions[0], index: number) => {
    const isSelected = sort === option.value;
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = () => {
      scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
      scale.value = withSpring(1);
    };

    return (
      <AnimatedTouchableOpacity
        key={option.value}
        entering={FadeInRight.delay((index + 3) * 100)}
        exiting={FadeOutLeft}
        style={[
          styles.sortButton,
          { backgroundColor: isSelected ? tintColor : backgroundColor },
          animatedStyle
        ]}
        onPress={() => onSortChange(option.value)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={option.icon} 
          size={14} 
          color={isSelected ? 'black' : iconColor} 
        />
        <ThemedText 
          style={[
            styles.sortButtonText,
            { color: isSelected ? 'black' : textColor }
          ]}
        >
          {option.label}
        </ThemedText>
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Filter</ThemedText>
        <View style={styles.filterRow}>
          {filterOptions.map(renderFilterButton)}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Sort</ThemedText>
        <View style={styles.sortRow}>
          {sortOptions.map(renderSortButton)}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
