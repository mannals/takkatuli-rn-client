import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Button} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {UpdateUser, UserWithProfilePicture} from '../types/DBTypes';
import {useUser} from '../hooks/apiHooks';
import {useUserContext} from '../hooks/ContextHooks';

// edit user info form
const EditUserInfo = ({
  infoEditing,
  setInfoEditing,
  thisUser,
  setThisUser,
}: {
  infoEditing: boolean;
  setInfoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  thisUser: UserWithProfilePicture;
  setThisUser: React.Dispatch<
    React.SetStateAction<UserWithProfilePicture | null>
  >;
}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {putUser, getUserWithProfilePicture} = useUser();
  const [update, setUpdate] = useState<boolean>(false);
  const {handleGetUser} = useUserContext();

  const values: UpdateUser = {
    username: thisUser.username,
    email: thisUser.email,
    bio_text: thisUser.bio_text ?? '',
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

  // refresh user info after editing
  useEffect(() => {
    getUserWithProfilePicture(thisUser.user_id);
    handleGetUser();
  }, [update]);

  // edit user info
  const handleEditUserInfo = async (inputs: UpdateUser) => {
    await doUpload(inputs);
    await getUserWithProfilePicture(thisUser.user_id);
    await handleGetUser();
  };

  // upload edited user info to server
  const doUpload = async (inputs: UpdateUser) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token', token);
      if (token) {
        const result = await putUser(token, inputs);
        if (result) {
          console.log('EditUserInfo result', result);
          setUpdate((prev) => !prev);
          resetForm();
          setInfoEditing(false);
          setThisUser(result.user);
          getUserWithProfilePicture(thisUser.user_id);
          navigation.navigate('Profiili');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <View style={styles.infoFields}>
        <View style={styles.infoField}>
          <Text style={{fontWeight: 'bold'}}>Käyttäjänimi</Text>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.contentInput}
                onChangeText={onChange}
                value={value ?? thisUser?.username}
                placeholder="Käyttäjänimi"
              />
            )}
            name="username"
          />
        </View>
        <View style={styles.infoField}>
          <Text style={{fontWeight: 'bold'}}>Sähköpostiosoite</Text>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.contentInput}
                onChangeText={onChange}
                value={value ?? thisUser?.email}
                placeholder="Sähköpostiosoite"
              />
            )}
            name="email"
          />
        </View>
        <View style={styles.infoField}>
          <Text style={{fontWeight: 'bold'}}>Kuvaus</Text>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.contentInput}
                onChangeText={onChange}
                value={
                  value !== undefined && value !== null
                    ? value
                    : thisUser?.bio_text
                      ? thisUser.bio_text
                      : ''
                }
                placeholder="Kuvaus"
                multiline
              />
            )}
            name="bio_text"
          />
        </View>
      </View>
      <View style={styles.saveCancel}>
        <Button
          title="Tallenna"
          onPress={handleSubmit(handleEditUserInfo)}
          buttonStyle={styles.saveButton}
        />
        <Button
          title="Peruuta"
          onPress={() => setInfoEditing(false)}
          buttonStyle={styles.cancelButton}
          titleStyle={{color: '#4E392A'}}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoFields: {
    marginVertical: 10,
    width: '90%',
  },
  infoField: {
    marginVertical: 5,
  },
  contentInput: {
    backgroundColor: '#D9D9D9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  saveCancel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#4E392A',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
  },
});

export default EditUserInfo;
