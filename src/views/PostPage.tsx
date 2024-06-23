import {RouteProp} from '@react-navigation/native';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleChevronRight,
  faClock,
  faHome,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/fi';
import {Button, Card} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {usePosts} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import PostItem from '../components/Post';
import {useUserContext} from '../hooks/ContextHooks';
import {MakeReply, NewPostWithoutFile} from '../types/DBTypes';

moment.locale('fi');

type RootStackParamList = {
  Postaus: {post_id: number};
  Etusivu: undefined;
  Alakategoria: {subcat_id: number};
};

type PostPageRouteProp = RouteProp<RootStackParamList, 'Postaus'>;
type PostPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Postaus'
>;

type Props = {
  route: PostPageRouteProp;
  navigation: PostPageNavigationProp;
};

export const PostPage = ({route, navigation}: Props) => {
  const postId = route.params.post_id;
  const {getPostById, thisPost, getRepliesByPostId, replies} = usePosts();
  const {update, setUpdate} = useUpdateContext();
  const [replying, setReplying] = useState<number | null>(null);
  const {makeReply} = usePosts();
  const {user} = useUserContext();

  useEffect(() => {
    getPostById(postId);
    getRepliesByPostId(postId);
  }, [update]);

  const values: MakeReply = {
    subcategory_id: thisPost?.subcategory_id ?? 0,
    text_content: '',
    reply_to: thisPost?.post_id ?? 0,
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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  console.log(thisPost?.thumbnail);

  const doReply = async (data: MakeReply) => {
    const token = await AsyncStorage.getItem('token');
    const reply: NewPostWithoutFile = {
      subcategory_id: thisPost?.subcategory_id ?? data.subcategory_id,
      text_content: data.text_content,
      reply_to: thisPost?.post_id,
    };
    console.log(reply);
    if (thisPost && token) {
      const newReply = await makeReply(reply, token);
      if (newReply) {
        setReplying(null);
        getRepliesByPostId(postId);
        resetForm();
        navigation.navigate('Postaus', {post_id: thisPost.post_id});
      }
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
          {thisPost && (
            <Text
              style={styles.home}
              onPress={() => {
                navigation.navigate('Alakategoria', {
                  subcat_id: thisPost.subcategory_id,
                });
              }}
            >
              {thisPost.subcategory_name}
            </Text>
          )}
        </View>
        {thisPost && (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.postMainInfo}>
              <Text style={styles.postTitle}>{thisPost.title}</Text>
              <View style={styles.whoWhen}>
                <FontAwesomeIcon
                  icon={faUser}
                  size={20}
                  color={'#4E392A'}
                  style={{marginHorizontal: 15}}
                />
                <Text>{thisPost.username}</Text>
                <FontAwesomeIcon
                  icon={faClock}
                  size={20}
                  color={'#4E392A'}
                  style={{marginHorizontal: 15}}
                />
                <Text>{moment(thisPost.created_at).format('L')}</Text>
              </View>
              <PostItem post={thisPost} />
              {replies && (
                <FlatList
                  data={replies}
                  renderItem={({item}) => <PostItem post={item} />}
                />
              )}
              {replying === thisPost.post_id ? (
                <Card>
                  <Text style={styles.titleInput}>Kirjoita vastaus...</Text>
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
                  <Button
                    title="Lähetä"
                    onPress={handleSubmit(doReply)}
                    buttonStyle={styles.submitReplyButton}
                  />
                </Card>
              ) : (
                <Button
                  title="Vastaa"
                  buttonStyle={styles.replyButton}
                  titleStyle={{color: '#ffffff'}}
                  onPress={() => {
                    if (user) {
                      setReplying(thisPost.post_id);
                    } else {
                      alert('Kirjaudu sisään vastataksesi!');
                    }
                  }}
                />
              )}
            </View>
          </ScrollView>
        )}
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
  postMainInfo: {
    flexDirection: 'column',
    padding: 15,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginHorizontal: 10,
  },
  whoWhen: {
    flexDirection: 'row',
    marginLeft: 0,
    paddingHorizontal: 0,
  },
  replyButton: {
    marginTop: 20,
    marginHorizontal: 50,
    backgroundColor: '#D4863D',
    color: '#FFFFFF',
  },
  submitReplyButton: {
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
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    marginHorizontal: 'auto',
  },
  contentInput: {
    marginTop: 10,
    height: 80,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#D9D9D9',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
