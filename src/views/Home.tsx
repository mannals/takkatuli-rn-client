import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Category from '../components/Category';

const Home = () => {
  return (
    <>
      <Header />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.siteLocation}>
            <FontAwesomeIcon icon={faHome} size={25} color={'#4E392A'} />
            <Text style={styles.home}>Etusivu</Text>
          </View>
          <Category />
          <Category />
          <Category />
        </View>
      </ScrollView>
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
