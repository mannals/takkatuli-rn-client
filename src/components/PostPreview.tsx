import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import moment from 'moment';
import {PostPreview} from '../types/DBTypes';

type Props = {
  item: PostPreview;
  navigation: NavigationProp<ParamListBase>;
};

// post preview item
const PostPreviewItem = ({item, navigation}: Props) => {
  const latest = item.latest;

  // truncate text content for preview
  const truncate = (str: string) => {
    return str.length > 30 ? str.substring(0, 29) + '...' : str;
  };

  // calculate time difference and format it
  let timeDifference = '';
  if (latest) {
    const diffInMinutes = moment().diff(moment(latest.created_at), 'minutes');
    const diffInSeconds = moment().diff(moment(latest.created_at), 'seconds');
    if (diffInSeconds < 60) {
      timeDifference = `juuri nyt`;
    } else if (diffInMinutes < 60) {
      timeDifference = `${diffInMinutes} minuuttia sitten`;
    } else {
      timeDifference = moment(latest.created_at).startOf('hour').fromNow();
    }
  }

  return (
    <TouchableOpacity
      style={styles.previewContainer}
      onPress={() => {
        navigation.navigate('Postaus', {post_id: item.post_id});
      }}
    >
      <FontAwesomeIcon
        icon={faCircleUser}
        size={40}
        color={'#4E392A'}
        style={{marginVertical: 20, marginHorizontal: 10}}
      />
      <View style={styles.postInfo}>
        <Text style={styles.postTitle}>{truncate(item.title)}</Text>
        <View style={styles.who}>
          <Text>{item.username}</Text>
        </View>
        <View style={styles.whenReplies}>
          <Text style={{fontWeight: 'bold'}}>{timeDifference}</Text>
          <Text>{item.replies_count.toString()} vastausta</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  postInfo: {
    marginLeft: 10,
    textAlign: 'left',
  },
  postTitle: {
    fontWeight: '500',
    marginLeft: 10,
    fontSize: 16,
    color: '#4E392A',
    textAlign: 'left',
  },
  subcategoryLatest: {
    marginLeft: 10,
    fontSize: 10,
    color: '#4E392A',
    textAlign: 'left',
  },
  who: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginTop: 10,
    width: '80%',
  },
  whenReplies: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 0,
    marginTop: 10,
    width: '90%',
  },
});

export default PostPreviewItem;
