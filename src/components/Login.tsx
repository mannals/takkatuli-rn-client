import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from '@rneui/base';
import {Credentials} from '../types/LocalTypes';
import {useUserContext} from '../hooks/ContextHooks';
import Header from './Header';

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#4E392A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  loginContainer: {
    flex: 4,
    width: Dimensions.get('window').width,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 10,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4E392A',
  },
  links: {
    height: 50,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  linkText: {
    margin: 0,
    alignItems: 'center',
  },
  loginForm: {
    flex: 1,
    marginTop: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  inputWithLabel: {
    flex: 1,
    width: 250,
    marginTop: 10,
    padding: 0,
  },
  labelText: {
    fontSize: 10,
    marginLeft: 0,
  },
  input: {
    height: 40,
    width: 250,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    color: '#004aad',
  },
  loginButton: {
    marginTop: 0,
    width: 250,
    backgroundColor: '#D4863D',
    marginBottom: 10,
    borderRadius: 5,
  },
});

const Login = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {handleLogin} = useUserContext();
  const initValues: Credentials = {username: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doLogin = async (creds: Credentials) => {
    await handleLogin(creds);
    navigation.navigate('Etusivu');
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.loginContainer}>
        <Text style={styles.headerText}>Kirjaudu sisään</Text>
        <Card>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Ole hyvä ja syötä käyttäjätunnuksesi',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={styles.input}
                placeholder="käyttäjätunnus"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="text"
                autoCapitalize="none"
                errorMessage={errors.username?.message}
              />
            )}
            name="username"
          />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Ole hyvä ja syötä salasanasi',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={styles.input}
                placeholder="********"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="text"
                autoCapitalize="none"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
            name="password"
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(doLogin)}
          >
            <Text
              style={{
                color: '#ffffff',
                padding: 10,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Kirjaudu
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
};

export default Login;
