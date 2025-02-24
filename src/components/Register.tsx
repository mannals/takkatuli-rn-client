import {StyleSheet, View, Dimensions, Text, Platform} from 'react-native';
import RegisterForm from './RegisterForm';
import Header from './Header';

// register page
// contains header and register form
const Register = ({handleToggle}: {handleToggle: () => void}) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.registerContainer}>
        <Text style={styles.headerText}>Luo profiili</Text>
        <RegisterForm handleToggle={handleToggle} />
      </View>
    </View>
  );
};

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
    marginBottom: 0,
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
});

export default Register;
