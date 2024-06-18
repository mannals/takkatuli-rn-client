import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleChevronRight, faHome} from '@fortawesome/free-solid-svg-icons';
import {RouteProp} from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {useUserContext} from '../hooks/ContextHooks';
import {useFile, usePosts, useSubcategories} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {MakePost, NewPostWithoutFile} from '../types/DBTypes';
import {UploadResponse} from '../types/MessageTypes';

type RootStackParamList = {
  Alakategoria: {subcat_id: number};
  Etusivu: undefined;
  'Tee postaus': {subcat_id: number};
  'Kirjaudu/Rekisteröidy': undefined;
  Postaus: {post_id: number};
};

type SubcatRouteProp = RouteProp<RootStackParamList, 'Alakategoria'>;
type SubcatNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Alakategoria'
>;

type Props = {
  route: SubcatRouteProp;
  navigation: SubcatNavigationProp;
};

const MakePostPage = ({route, navigation}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [URI, setURI] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const subcatId = route.params.subcat_id;
  const {postFile} = useFile();
  const {getSubcatById, thisSubcat} = useSubcategories();
  const {update, setUpdate} = useUpdateContext();
  const {makeNewPost} = usePosts();
  const values: MakePost = {
    subcategory_id: subcatId,
    title: '',
    text_content: '',
    file,
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

  useEffect(() => {
    getSubcatById(subcatId);
  }, [update]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const doUpload = async (inputs: MakePost) => {
    console.log('doUpload entered');
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token', token);
      const {subcategory_id, title, text_content, file} = inputs;
      const withoutFile: NewPostWithoutFile = {
        subcategory_id,
        title,
        text_content,
      };
      if (file && token) {
        const fileResult = await postFile(URI, token);
        if (fileResult) {
          const postResult = await makeNewPost(fileResult, withoutFile, token);
          if (postResult) {
            setUpdate((prev) => !prev);
            resetForm();
            navigation.navigate('Postaus', {
              post_id: postResult.media?.post_id,
            });
          }
        }
      } else if (token) {
        const postResult = await makeNewPost(null, withoutFile, token);
        if (postResult) {
          setUpdate((prev) => !prev);
          resetForm();
          navigation.navigate('Postaus', {
            post_id: postResult.media?.post_id,
          });
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
            style={styles.home}
            onPress={() => {
              navigation.navigate('Etusivu');
            }}
          >
            Etusivu
          </Text>
          <FontAwesomeIcon
            icon={faCircleChevronRight}
            size={25}
            color={'#4E392A'}
          />
          {thisSubcat && <Text style={styles.home}>{thisSubcat.title}</Text>}
        </View>
        <View>
          <Text style={styles.title}>Uusi postaus</Text>
          <Card>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.titleInput}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Otsikko"
                />
              )}
              name="title"
              rules={{required: 'Otsikko vaaditaan'}}
            />
            <Text style={{color: 'red', marginLeft: 10}}>*Pakollinen</Text>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.contentInput}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Sisältö"
                  multiline
                />
              )}
              name="text_content"
              rules={{required: 'Sisältö vaaditaan'}}
            />
            <Text style={{color: 'red', marginLeft: 10}}>*Pakollinen</Text>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TouchableOpacity
                  style={styles.fileInput}
                  onBlur={onBlur}
                  onPress={async () => {
                    try {
                      // get image or video files only
                      const res = await DocumentPicker.getDocumentAsync({
                        type: ['image/*', 'video/*'],
                        copyToCacheDirectory: true,
                      });
                      if (!res.canceled) {
                        console.log(res);
                        setURI(res.assets[0].uri);
                        setFileName(res.assets[0].name);
                        onChange(res);
                      } else {
                        console.log('cancelled');
                      }
                    } catch (err) {
                      throw err;
                    }
                  }}
                >
                  {URI ? (
                    <Text>{fileName}</Text>
                  ) : (
                    <Text>Valitse tiedosto...</Text>
                  )}
                </TouchableOpacity>
              )}
              name="file"
            />
            <Button
              title="Lisää"
              onPress={handleSubmit(doUpload)}
              buttonStyle={styles.newPostButton}
            />
          </Card>
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
  home: {
    fontSize: 20,
    color: '#4E392A',
    marginHorizontal: 10,
    marginTop: 0,
  },
  subcatInfo: {
    width: '100%',
    padding: 30,
  },
  subcatTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  newPostButton: {
    flexDirection: 'row',
    backgroundColor: '#273C71',
    width: '30%',
    marginHorizontal: '35%',
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
  },
  listTop: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#D4863D',
  },
  titleInput: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#D9D9D9',
  },
  contentInput: {
    marginTop: 30,
    height: 100,
    padding: 10,
    backgroundColor: '#D9D9D9',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  fileInput: {
    width: 150,
    marginLeft: 80,
    marginTop: 30,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#D9D9D9',
  },
});

export default MakePostPage;
