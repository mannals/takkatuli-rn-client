import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from '@rneui/base';
import {useEffect} from 'react';
import {useUser} from '../hooks/apiHooks';

const RegisterForm = ({handleToggle}: {handleToggle: () => void}) => {
  const {postUser} = useUser();
  const initValues = {
    username: '',
    email: '',
    password: '',
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
    mode: 'onBlur',
  });

  const doRegister = async (inputs: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await postUser(inputs);
      Alert.alert(
        'Käyttäjätili luotu onnistuneesti',
        'Voit nyt kirjautua sisään',
      );
      handleToggle();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Ole hyvä ja syötä käyttäjänimesi',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>NIMI</Text>
            <Input
              style={styles.input}
              placeholder="Matti Mehiläinen"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.username?.message}
            />
          </View>
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Sähköpostiosoite ei ole validi',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SÄHKÖPOSTIOSOITE</Text>
            <Input
              style={styles.input}
              placeholder="mattimeikalainen@example.com"
              keyboardType="default"
              autoCorrect={false}
              inputMode="email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
              autoCapitalize="none"
            />
          </View>
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SALASANA</Text>
            <Input
              style={styles.input}
              secureTextEntry
              placeholder="Salasana"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          </View>
        )}
        name="password"
      />
      {/* TODO: add password confirmation */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit(doRegister)}
      >
        <Text
          style={{
            color: '#ffffff',
            padding: 10,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Rekisteröidy
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  registerForm: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
    alignItems: 'center',
  },
  inputWithLabel: {
    width: 250,
    paddingVertical: 10,
    marginBottom: 40,
    height: 40,
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
    flexDirection: 'row',
  },
  registerButton: {
    marginTop: 20,
    width: 250,
    backgroundColor: '#D4863D',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default RegisterForm;
