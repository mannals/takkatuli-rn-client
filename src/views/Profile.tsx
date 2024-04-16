import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleChevronRight,
  faCircleUser,
  faHome,
  faPen,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Button} from '@rneui/base';
import Header from '../components/Header';

export const Profile = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.siteLocation}>
          <FontAwesomeIcon icon={faHome} size={25} color={'#4E392A'} />
          <Text
            style={styles.locationText}
            onPress={() => {
              navigation.navigate('Etusivu');
            }}
          >
            Etusivu
          </Text>
          <FontAwesomeIcon
            style={{marginLeft: 10}}
            icon={faCircleChevronRight}
            size={25}
            color={'#4E392A'}
          />
          <Text style={styles.locationText}>Profiili</Text>
        </View>
        <View style={styles.pageInfo}>
          <Text style={styles.pageTitle}>Profiili</Text>
        </View>
        <View style={styles.top}>
          <FontAwesomeIcon
            icon={faUser}
            size={15}
            color={'#4E392A'}
            style={{marginRight: 10}}
          />
          <Text>Käyttäjänimi</Text>
        </View>
        <View style={styles.profPicSection}>
          <FontAwesomeIcon
            icon={faCircleUser}
            size={130}
            color={'#4E392A'}
            style={{marginVertical: 20}}
          />
          <Button style={styles.button}>Vaihda profiilikuva...</Button>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.infoTitleEdit}>
            <Text style={styles.infoTitle}>Omat tiedot</Text>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faPen} size={20} color={'#4E392A'} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoFields}>
            <View style={styles.infoField}>
              <Text style={{fontWeight: 'bold'}}>Käyttäjänimi</Text>
              <Text>WioletWizard</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={{fontWeight: 'bold'}}>Sähköpostiosoite</Text>
              <Text>example@mail.com</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={{fontWeight: 'bold'}}>Salasana</Text>
              <Text>**************</Text>
            </View>
          </View>
          <Button style={styles.button}>Vaihda salasana</Button>
          <TouchableOpacity style={styles.redButton}>
            <Text style={styles.redButtonText}>Poista tilisi</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#948C86',
  },
  locationText: {
    fontSize: 20,
    color: '#4E392A',
    marginLeft: 10,
    marginTop: 0,
  },
  pageInfo: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  top: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#D4863D',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profPicSection: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#4E392A',
    color: '#FFFFFF',
    padding: 10,
    fontSize: 15,
  },
  userInfo: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    alignItems: 'center',
  },
  infoTitleEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoFields: {
    width: '95%',
    marginTop: 15,
    marginHorizontal: 'auto',
    padding: 5,
  },
  infoField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  redButton: {
    marginVertical: 10,
    backgroundColor: '#A51F47',
    padding: 10,
  },
  redButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
