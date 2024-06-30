import moment from 'moment';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleUser,
  faEdit,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {PostWithAll} from '../types/DBTypes';
import {usePosts, useVotes} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {useUserContext} from '../hooks/ContextHooks';
import EditPost from './EditPost';

// post item
const PostItem = ({post}: {post: PostWithAll}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {user} = useUserContext();
  const [voted, setVoted] = useState<string | null>();
  const [postEditing, setPostEditing] = useState<boolean>(false);
  const {thisPost, getPostById} = usePosts();
  const {update, setUpdate} = useUpdateContext();
  const {
    postVotes,
    getVotesByPost,
    thisVote,
    setThisVote,
    addVote,
    deleteVote,
  } = useVotes();

  // refresh post and votes
  useEffect(() => {
    const loadVote = async () => {
      const vote = await AsyncStorage.getItem(`vote-${post.post_id}`);
      if (vote) {
        setThisVote(vote);
      } else {
        setThisVote(null);
      }
    };
    loadVote();
    getPostById(post.post_id);
    getVotesByPost(post.post_id);
  }, [update]);

  // handle vote
  // vote: true = like, false = dislike
  // if user is not logged in, alert to login
  // if user is post owner, alert that user cannot vote own post
  // if user has already voted, delete vote
  const handleVote = (vote: boolean) => {
    if (user && user.user_id !== post.user_id) {
      if (vote && voted !== 'like') {
        addVote(post.post_id, true);
        AsyncStorage.setItem(`vote-${post.post_id}`, 'like');
        setVoted('like');
        setThisVote('like');
        getVotesByPost(post.post_id);
      } else if (!vote && voted !== 'dislike') {
        addVote(post.post_id, false);
        AsyncStorage.setItem(`vote-${post.post_id}`, 'dislike');
        setVoted('dislike');
        setThisVote('dislike');
        getVotesByPost(post.post_id);
        console.log(postVotes);
      } else {
        deleteVote(post.post_id);
        AsyncStorage.removeItem(`vote-${post.post_id}`);
        setVoted(null);
        setThisVote(null);
        getVotesByPost(post.post_id);
        console.log(postVotes);
      }
      setUpdate((prev) => !prev);
    } else if (user && user.user_id === post.user_id) {
      alert('Et voi äänestää omaa viestiäsi');
    } else {
      alert('Kirjaudu sisään äänestääksesi');
    }
  };

  return (
    <>
      <View style={styles.post}>
        <View style={styles.listTop}>
          <Text>{moment(post.created_at).format('L')}</Text>
        </View>
        <View style={styles.userContainer}>
          {post.profile_picture?.filename ? (
            <Image
              source={{uri: post.profile_picture.filename}}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 20,
                objectFit: 'cover',
                resizeMode: 'contain',
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleUser}
              size={40}
              color={'#4E392A'}
              style={{marginRight: 20}}
            />
          )}
          {post.user_id === user?.user_id ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profiili', {user_id: post.user_id});
              }}
            >
              <Text style={{fontWeight: 'bold'}}>{post.username}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Toinen käyttäjä', {user_id: post.user_id});
              }}
            >
              <Text style={{fontWeight: 'bold'}}>{post.username}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.postContent}>
          {post.user_id === user?.user_id && (
            <Pressable
              style={{
                position: 'absolute',
                right: 15,
                top: 15,
                backgroundColor: '#D9D9D9',
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                setPostEditing(true);
                console.log('postEditing', postEditing);
              }}
            >
              <FontAwesomeIcon icon={faEdit} size={20} color={'#4E392A'} />
            </Pressable>
          )}
          {!postEditing ? (
            <>
              {thisPost?.filename && (
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
                    source={{uri: thisPost.filename}}
                  />
                </View>
              )}
              <Text>{thisPost?.text_content}</Text>
            </>
          ) : (
            <EditPost
              postEditing={postEditing}
              setPostEditing={setPostEditing}
              post={post}
            />
          )}
          <View style={styles.votesContainer}>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                style={
                  thisVote === 'like'
                    ? {padding: 10, borderRadius: 10, backgroundColor: 'green'}
                    : {
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: '#D9D9D9',
                      }
                }
                onPress={() => handleVote(true)}
              >
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  size={20}
                  color={'#4E392A'}
                />
              </TouchableOpacity>
            </View>
            <Text>{postVotes?.likes}</Text>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                style={
                  thisVote === 'dislike'
                    ? {padding: 10, borderRadius: 10, backgroundColor: 'red'}
                    : {
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: '#D9D9D9',
                      }
                }
                onPress={() => handleVote(false)}
              >
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  size={20}
                  color={'#4E392A'}
                />
              </TouchableOpacity>
            </View>
            <Text>{postVotes?.dislikes}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  post: {
    width: '100%',
    flexDirection: 'column',
    marginHorizontal: 0,
  },
  listTop: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#D4863D',
    justifyContent: 'space-between',
  },
  userContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    alignItems: 'center',
  },
  postContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  votesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
  },
});

export default PostItem;
