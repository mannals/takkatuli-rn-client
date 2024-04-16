import moment from 'moment';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleUser, faReply, faUser} from '@fortawesome/free-solid-svg-icons';
import {useEffect} from 'react';
import {PostWithSubcat} from '../types/DBTypes';
import {usePosts} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

const PostItem = ({post}: {post: PostWithSubcat}) => {
  return (
    <>
      <View style={styles.post}>
        <View style={styles.listTop}>
          <Text>{moment(post.created_at).format('L')}</Text>
        </View>
        <View style={styles.userContainer}>
          <FontAwesomeIcon
            icon={faCircleUser}
            size={40}
            color={'#4E392A'}
            style={{marginRight: 20}}
          />
          <Text style={{fontWeight: 'bold'}}>{post.username}</Text>
        </View>
        <View style={styles.postContent}>
          <Text>{post.text_content}</Text>
          <TouchableOpacity style={styles.replyButton}>
            <FontAwesomeIcon icon={faReply} size={20} color={'#4E392A'} />
          </TouchableOpacity>
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
  replyButton: {
    width: 40,
    marginRight: 0,
    marginVertical: 10,
    backgroundColor: '#D9D9D9',
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default PostItem;
