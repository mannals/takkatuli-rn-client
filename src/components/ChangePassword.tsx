import {Button} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useState} from 'react';
import {useUser} from '../hooks/apiHooks';
import {ChangePassword} from '../types/DBTypes';

const ChangePasswordField = ({
  passwordChanging,
  setPasswordChanging,
}: {
  passwordChanging: boolean;
  setPasswordChanging: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {putPassword} = useUser();
  const [update, setUpdate] = useState<boolean>(false);

  const values = {
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

  const handleChangePassword = async (inputs: {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }) => {
    console.log('Changing password');
    if (inputs.old_password === inputs.new_password) {
      Alert.alert('Uuden salasanan on oltava eri kuin vanha salasana');
      return;
    }
    if (inputs.new_password !== inputs.confirm_new_password) {
      Alert.alert('Salasanat eivät täsmää');
      return;
    }

    const pswdChange: ChangePassword = {
      old_password: inputs.old_password,
      new_password: inputs.new_password,
    };

    await doUpload(pswdChange);
  };

  const doUpload = async (inputs: ChangePassword) => {
    try {
      await putPassword(inputs);
      setUpdate((prev) => !prev);
      resetForm();
      setPasswordChanging(false);
      Alert.alert('Salasana vaihdettu onnistuneesti');
      navigation.navigate('Profiili');
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <>
      <View style={styles.infoFields}>
        <View style={styles.infoField}>
          <Text style={{fontWeight: 'bold'}}>Vanha salasana</Text>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.contentInput}
                onChangeText={onChange}
                secureTextEntry={true}
                value={value ?? ''}
                placeholder="Vanha salasana"
              />
            )}
            name="old_password"
          />
        </View>
        <View style={styles.infoField}>
          <Text style={{fontWeight: 'bold'}}>Uusi salasana</Text>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.contentInput}
                onChangeText={onChange}
                secureTextEntry={true}
                value={value ?? ''}
                placeholder="Uusi salasana"
              />
            )}
            name="new_password"
          />
        </View>
        <View style={styles.infoField}>
          <Text style={{fontWeight: 'bold'}}>Vahvista uusi salasana</Text>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.contentInput}
                onChangeText={onChange}
                secureTextEntry={true}
                value={value ?? ''}
                placeholder="Uusi salasana uudelleen"
              />
            )}
            name="confirm_new_password"
          />
        </View>
      </View>
      <View style={styles.saveCancel}>
        <Button
          buttonStyle={styles.saveButton}
          title="Tallenna"
          onPress={handleSubmit(handleChangePassword)}
        >
          Tallenna
        </Button>
        <Button
          buttonStyle={styles.cancelButton}
          titleStyle={{color: '#4E392A'}}
          title="Peruuta"
          onPress={() => setPasswordChanging(false)}
        >
          Peruuta
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoFields: {
    width: '90%',
    marginHorizontal: 10,
  },
  infoField: {
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  contentInput: {
    backgroundColor: '#D9D9D9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  saveCancel: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#4E392A',
  },
  cancelButton: {
    backgroundColor: '#D9D9D9',
  },
});

export default ChangePasswordField;
