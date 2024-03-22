import {faComment} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StyleSheet, Text, View} from 'react-native';

const Subcategory = () => {
  return (
    <View style={styles.subcategoryContainer}>
      <FontAwesomeIcon
        icon={faComment}
        size={40}
        color={'#4E392A'}
        style={{marginVertical: 20, marginHorizontal: 10}}
      />
      <View style={styles.subcategoryInfo}>
        <Text style={styles.subcategoryTitle}>Subcategory</Text>
        <Text style={styles.subcategoryLatest}>
          Title of latest post in subcategory
        </Text>
        <View style={styles.whoWhen}>
          <Text style={{fontWeight: 'bold'}}>Time</Text>
          <Text>Author</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subcategoryContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  subcategoryInfo: {
    marginLeft: 10,
    textAlign: 'left',
  },
  subcategoryTitle: {
    fontWeight: '500',
    marginLeft: 10,
    fontSize: 20,
    color: '#4E392A',
    textAlign: 'left',
  },
  subcategoryLatest: {
    marginLeft: 10,
    fontSize: 15,
    color: '#4E392A',
    textAlign: 'left',
  },
  whoWhen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginTop: 10,
  },
});

export default Subcategory;
