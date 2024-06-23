import {View, Text, StyleSheet, FlatList} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import * as React from 'react';
import {useEffect} from 'react';
import Header from '../components/Header';
import CategoryItem from '../components/Category';
import Footer from '../components/Footer';
import {CatSubcatContext} from '../contexts/CatSubcatContext';

const Home = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {catSubcat, updateCatSubcat} = React.useContext(CatSubcatContext);

  useEffect(() => {
    console.log('catSubcat changed', catSubcat);
  }, [catSubcat]);

  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.siteLocation}>
          <FontAwesomeIcon icon={faHome} size={25} color={'#4E392A'} />
          <Text style={styles.home}>Etusivu</Text>
        </View>
        <FlatList
          data={catSubcat}
          renderItem={({item}) => (
            <CategoryItem navigation={navigation} item={item} />
          )}
        />
      </View>
      <Footer />
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
