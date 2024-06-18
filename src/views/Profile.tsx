import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
import * as DocumentPicker from 'expo-document-picker';
import {Button} from '@rneui/base';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import Header from '../components/Header';
import {useUserContext} from '../hooks/ContextHooks';
import {useFile, useUser, useVotes} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {FileValues, UploadFile} from '../types/DBTypes';
import EditUserInfo from '../components/EditUserInfo';
import ChangePasswordField from '../components/ChangePassword';

export const Profile = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {user, handleGetUser, handleLogout} = useUserContext();
  const {postFile} = useFile();
  const {
    getUserWithProfilePicture,
    thisUser,
    setThisUser,
    deleteUser,
    profilePicture,
    getProfilePicture,
    changeProfilePicture,
  } = useUser();
  const {addVote} = useVotes();
  const {update, setUpdate} = useUpdateContext();
  const [picEditing, setPicEditing] = useState<boolean>(false);
  const [infoEditing, setInfoEditing] = useState<boolean>(false);
  const [passwordChanging, setPasswordChanging] = useState<boolean>(false);
  const [fileValues, setFileValues] = useState({
    filename: '',
    filesize: 0,
    media_type: '',
    uri: '',
  });

  const handleDelete = async () => {
    Alert.alert('Poistetaanko käyttäjätili?', '', [
      {
        text: 'Poista',
        onPress: async () => {
          // delete user
          const deletion = await deleteUser();
          Alert.alert('Käyttäjätili poistettu', '', [
            {
              text: 'OK',
              onPress: () => console.log('OK'),
            },
          ]);
          if (deletion) {
            await logout();
          }
        },
      },
      {
        text: 'Peruuta',
        onPress: () => console.log('cancel'),
      },
    ]);
  };

  const logout = async () => {
    await handleLogout();
    navigation.navigate('Kirjaudu/Rekisteröidy');
  };

  const values: UploadFile = {
    file: null,
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  useEffect(() => {
    if (!user) {
      navigation.navigate('Kirjaudu/Rekisteröidy');
    } else {
      handleGetUser();
      getProfilePicture();
      getUserWithProfilePicture(user.user_id);
      console.log(thisUser);
      console.log(profilePicture);
      console.log('profile picture', profilePicture?.filename);
    }
  }, [update]);

  const doUpload = async (inputs: UploadFile) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (fileValues.uri && token) {
        const fileResult = await postFile(fileValues.uri, token);
        if (fileResult) {
          const postResult = await changeProfilePicture(fileResult, token);
          if (postResult) {
            setUpdate((prev) => !prev);
            setPicEditing(false);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

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
        <ScrollView>
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
            <Text>{thisUser?.username}</Text>
          </View>
          <View style={styles.profPicSection}>
            {!profilePicture ? (
              <FontAwesomeIcon
                icon={faCircleUser}
                size={130}
                color={'#4E392A'}
                style={{marginVertical: 20}}
              />
            ) : (
              <View>
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: 'scale-down',
                    resizeMode: 'contain',
                    marginBottom: 10,
                    backgroundColor: '#FFFFFF',
                  }}
                  source={{uri: profilePicture.filename}}
                  alt={profilePicture.filename}
                />
              </View>
            )}
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    setPicEditing(true);
                    try {
                      // get image or video files only
                      const res = await DocumentPicker.getDocumentAsync({
                        type: ['image/*', 'video/*'],
                        copyToCacheDirectory: true,
                      });
                      if (!res.canceled) {
                        console.log(res);
                        setFileValues({
                          filename: res.assets[0].name,
                          filesize: res.assets[0].size ?? 0,
                          media_type: res.assets[0].mimeType ?? '',
                          uri: res.assets[0].uri,
                        });
                        onChange(res);
                        handleSubmit(doUpload);
                      } else {
                        console.log('cancelled');
                      }
                    } catch (err) {
                      throw err;
                    }
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    Vaihda profiilikuva...
                  </Text>
                </TouchableOpacity>
              )}
              name="file"
            />
            {picEditing === false ? (
              <></>
            ) : (
              <>
                <Button
                  title="Tallenna"
                  onPress={handleSubmit(doUpload)}
                  buttonStyle={styles.saveButton}
                />
                <Button
                  title="Peruuta"
                  onPress={() => setPicEditing(false)}
                  buttonStyle={styles.cancelButton}
                  titleStyle={{color: '#5d71c9'}}
                />
              </>
            )}
          </View>
          <View style={styles.userInfo}>
            <View style={styles.infoTitleEdit}>
              <Text style={styles.infoTitle}>Omat tiedot</Text>
              <TouchableOpacity
                onPress={() => {
                  setInfoEditing(true);
                  console.log('info editing', infoEditing);
                }}
              >
                <FontAwesomeIcon icon={faPen} size={20} color={'#4E392A'} />
              </TouchableOpacity>
            </View>
            {thisUser && infoEditing ? (
              <EditUserInfo
                infoEditing={infoEditing}
                setInfoEditing={setInfoEditing}
                thisUser={thisUser}
                setThisUser={setThisUser}
              />
            ) : (
              <View style={styles.infoFields}>
                <View style={styles.infoField}>
                  <Text style={{fontWeight: 'bold'}}>Käyttäjänimi</Text>
                  <Text>{thisUser?.username}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={{fontWeight: 'bold'}}>Sähköpostiosoite</Text>
                  <Text>{thisUser?.email}</Text>
                </View>
                <View style={styles.bioField}>
                  <Text style={{fontWeight: 'bold'}}>Kuvaus</Text>
                  <Text>
                    {thisUser?.bio_text ? thisUser.bio_text : 'Ei kuvausta.'}
                  </Text>
                </View>
              </View>
            )}
            <Button
              style={styles.button}
              onPress={() => {
                console.log('changing password');
                setPasswordChanging(true);
              }}
            >
              Vaihda salasana
            </Button>
            {passwordChanging && (
              <ChangePasswordField
                passwordChanging={passwordChanging}
                setPasswordChanging={setPasswordChanging}
              />
            )}
            <TouchableOpacity style={styles.redButton} onPress={handleDelete}>
              <Text style={styles.redButtonText}>Poista tilisi</Text>
            </TouchableOpacity>
            <Button
              title="Kirjaudu ulos"
              onPress={logout}
              buttonStyle={styles.button}
            />
          </View>
        </ScrollView>
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bioField: {
    flexDirection: 'column',
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
  cancelButton: {
    margin: 5,
    backgroundColor: '#ffffff',
    borderColor: '#5d71c9',
    borderWidth: 1,
    color: '#5d71c9',
    borderRadius: 12,
  },
  saveButton: {
    margin: 5,
    backgroundColor: '#5d71c9',
    borderRadius: 12,
  },
});
