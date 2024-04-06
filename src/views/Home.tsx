import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import Header from '../components/Header';
import {useCategories} from '../hooks/apiHooks';
import CategoryItem from '../components/Category';

const Home = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {catsWithSubcats} = useCategories();

  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.siteLocation}>
          <FontAwesomeIcon icon={faHome} size={25} color={'#4E392A'} />
          <Text style={styles.home}>Etusivu</Text>
        </View>
        <FlatList
          data={catsWithSubcats}
          renderItem={({item}) => (
            <CategoryItem navigation={navigation} item={item} />
          )}
        />
      </View>
      <View>
        <Text>Footer here</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  siteLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  home: {
    fontSize: 20,
    color: '#4E392A',
    marginLeft: 10,
    marginTop: 0,
  },
});

export default Home;
