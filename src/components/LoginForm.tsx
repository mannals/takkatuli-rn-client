import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from '@rneui/base';
import {Credentials} from '../types/LocalTypes';
import {useAuth} from '../hooks/apiHooks';

const styles = StyleSheet.create({
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

const LoginForm = () => {
  const {postLogin} = useAuth();
  const initValues: Credentials = {username: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doLogin = async (creds: Credentials) => {
    console.log(creds);
    try {
      await postLogin(creds);
      Alert.alert('Kirjautuminen onnistui', 'Tervetuloa!');
    } catch (e) {
      Alert.alert('Kirjautuminen epäonnistui', (e as Error).message);
    }
  };

  return (
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
  );
};

export default LoginForm;
