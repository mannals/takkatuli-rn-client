import {Button, Text} from '@rneui/base';
import * as DocumentPicker from 'expo-document-picker';
import {
  TouchableOpacity,
  View,
  Image,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {Controller, set, useForm} from 'react-hook-form';
import * as React from 'react';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {EditedPost, MakePost, PostWithAll, UploadFile} from '../types/DBTypes';
import {useCategories, useFile, usePosts} from '../hooks/apiHooks';
import {useUserContext} from '../hooks/ContextHooks';
import {CatSubcatContext} from '../contexts/CatSubcatContext';

const EditPost = ({
  postEditing,
  setPostEditing,
  post,
}: {
  postEditing: boolean;
  setPostEditing: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostWithAll;
}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {user} = useUserContext();
  const [update, setUpdate] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const {postFile} = useFile();
  const {catSubcat, updateCatSubcat} = React.useContext(CatSubcatContext);
  const {getAllCatsWithSubcats} = useCategories();
  const {thisPost, getPostById, editPost, deletePost} = usePosts();
  const [picEditing, setPicEditing] = useState<boolean>(false);
  const [fileValues, setFileValues] = useState({
    filename: '',
    filesize: 0,
    media_type: '',
    uri: '',
  });

  const values: EditedPost = {
    title: undefined,
    text_content: undefined,
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
    getPostById(post.post_id);
  }, [update]);

  const handleEditPost = async (inputs: EditedPost) => {
    await doUpload(inputs);
    await getPostById(post.post_id);
  };

  const doUpload = async (inputs: EditedPost) => {
    console.log('doUpload entered');
    console.log('inputs', inputs);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token', token);
      const {title, text_content, file} = inputs;
      const withoutFile: EditedPost = {
        title,
        text_content,
      };
      if (file && token) {
        const fileResult = await postFile(fileValues.uri, token);
        if (fileResult) {
          const postResult = await editPost(
            fileResult,
            withoutFile,
            post.post_id,
          );
          if (postResult) {
            updateCatSubcat();
            setUpdate((prev) => !prev);
            resetForm();
            setPostEditing(false);
            getPostById(post.post_id);
            navigation.navigate('Postaus', {
              post_id: post.post_id,
            });
          }
        }
      } else if (token) {
        const postResult = await editPost(null, withoutFile, post.post_id);
        if (postResult) {
          setUpdate((prev) => !prev);
          resetForm();
          setPostEditing(false);
          getPostById(post.post_id);
          navigation.navigate('Postaus', {
            post_id: post.post_id,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Poista postaus', 'Haluatko varmasti poistaa postauksesi?', [
      {
        text: 'Peruuta',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: async () => {
          const result = await deletePost(post.post_id);
          if (result) {
            updateCatSubcat();
            setPostEditing(false);
            navigation.navigate('Etusivu');
          } else {
            Alert.alert('Poistaminen epäonnistui');
          }
        },
      },
    ]);
  };

  return (
    <>
      {!post.reply_to && (
        <>
          {!post.filename ? (
            <Text>No file selected</Text>
          ) : (
            <View>
              <Image
                style={{
                  width: '80%',
                  height: 300,
                  objectFit: 'scale-down',
                  resizeMode: 'contain',
                  marginBottom: 10,
                  marginLeft: '10%',
                }}
                source={{uri: post.filename}}
                alt={post.filename}
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
                  style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 15}}
                >
                  Vaihda tiedosto
                </Text>
              </TouchableOpacity>
            )}
            name="file"
          />
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.titleInput}
                onChangeText={onChange}
                value={value ? value : thisPost?.title}
                placeholder="Otsikko"
              />
            )}
            name="title"
          />
        </>
      )}
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.contentInput}
            onChangeText={onChange}
            value={value ? value : thisPost?.text_content}
            placeholder="Sisältö"
            multiline
          />
        )}
        name="text_content"
      />
      <View style={styles.saveCancel}>
        <Button
          title="Tallenna"
          onPress={handleSubmit(handleEditPost)}
          buttonStyle={styles.saveButton}
        />
        <Button
          title="Peruuta"
          onPress={() => setPostEditing(false)}
          buttonStyle={styles.cancelButton}
          titleStyle={{color: '#4E392A'}}
        />
      </View>
      <View>
        <Button
          title="Poista"
          onPress={handleDelete}
          buttonStyle={styles.redButton}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    marginHorizontal: 70,
    alignItems: 'center',
    backgroundColor: '#4E392A',
    color: '#FFFFFF',
    padding: 10,
    fontSize: 15,
  },
  redButton: {
    marginVertical: 10,
    marginHorizontal: 70,
    alignItems: 'center',
    backgroundColor: '#A51F47',
    padding: 10,
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
    marginTop: 40,
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
  saveCancel: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    margin: 5,
    backgroundColor: '#ffffff',
    borderColor: '#4E392A',
    borderWidth: 1,
    color: '#4E392A',
  },
  saveButton: {
    margin: 5,
    backgroundColor: '#4E392A',
  },
});

export default EditPost;
