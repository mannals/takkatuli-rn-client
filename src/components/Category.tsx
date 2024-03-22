import {Text, View, StyleSheet} from 'react-native';
import Subcategory from './Subcategory';

const Category = () => {
  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Category</Text>
      </View>
      <Subcategory />
      <Subcategory />
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

export default Category;
