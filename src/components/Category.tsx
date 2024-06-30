import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {CategoryWithSubcategories} from '../types/DBTypes';
import Subcategory from './Subcategory';

type Props = {
  item: CategoryWithSubcategories;
  navigation: NavigationProp<ParamListBase>;
};

// category box with subcategories
const CategoryItem = ({item, navigation}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </TouchableOpacity>
      {item.subcategories && (
        <FlatList
          data={item.subcategories}
          keyExtractor={(item) => item.subcategory_id.toString()}
          renderItem={({item}) => (
            <Subcategory item={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    marginBottom: 20,
  },
  categoryContainer: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#D4863D',
  },
  categoryTitle: {
    fontSize: 16,
    color: '#4E392A',
    fontWeight: 'bold',
  },
});

export default CategoryItem;
