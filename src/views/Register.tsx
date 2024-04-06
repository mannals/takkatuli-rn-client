import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#4e392a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerContainer: {
    flex: 4,
    position: 'relative',
    width: Dimensions.get('window').width,
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: '#EEEEEE',
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
      <Header />
      <View style={styles.registerContainer}>
        <Text style={styles.headerText}>Luo profiili</Text>
        <RegisterForm />
        <View style={styles.links}>
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
