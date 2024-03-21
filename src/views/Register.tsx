import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import RegisterForm from '../components/RegisterForm';
import Logo from '../components/Logo';

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#4e392a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerContainer: {
    flex: 4,
    position: 'relative',
    width: Dimensions.get('window').width - 50,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 0,
    fontSize: 45,
    fontWeight: 'bold',
    color: '#4e392a',
  },
  links: {
    height: 50,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  linkText: {
    marginTop: 20,
    alignItems: 'center',
  },
});

const Register = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Logo />
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.headerText}>Luo profiili</Text>
        <RegisterForm />
        <View style={styles.links}>
          <TouchableOpacity
            style={styles.linkText}
            onPress={() => {
              // TODO: Navigate to the company registration screen
              // navigation.navigate('RekisteröiYritys');
            }}
          >
            <View>
              <Text style={{color: '#004aad'}}>Teetkö tiliä yritykselle?</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkText}
            onPress={() => {
              navigation.navigate('Kirjaudu');
            }}
          >
            <View>
              <Text style={{color: '#004aad'}}>
                Oletko jo rekisteröitynyt? Kirjaudu sisään
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;
