import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleChevronRight,
  faClock,
  faHome,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/fi';
import Header from '../components/Header';
import {usePosts} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import PostItem from '../components/Post';

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

  useEffect(() => {
    getPostById(postId);
    getRepliesByPostId(postId);
  }, [update]);

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
          <ScrollView>
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
                <Text>
                  {moment(thisPost.created_at).subtract(10, 'days').calendar()}
                </Text>
              </View>
              <PostItem post={thisPost} />
              {replies && (
                <FlatList
                  data={replies}
                  renderItem={({item}) => <PostItem post={item} />}
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
});
