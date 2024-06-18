import {faComment} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import moment from 'moment';
import {SubcatWithLatest} from '../types/DBTypes';

type Props = {
  item: SubcatWithLatest;
  navigation: NavigationProp<ParamListBase>;
};

const SubcategoryItem = ({item, navigation}: Props) => {
  const latest = item.latest;

  const truncate = (str: string) => {
    return str.length > 30 ? str.substring(0, 30 - 1) + '...' : str;
  };

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
      style={styles.subcategoryContainer}
      onPress={() => {
        navigation.navigate('Alakategoria', {subcat_id: item.subcategory_id});
      }}
    >
      <FontAwesomeIcon
        icon={faComment}
        size={40}
        color={'#4E392A'}
        style={{marginVertical: 20, marginHorizontal: 10}}
      />
      <View style={styles.subcategoryInfo}>
        <Text style={styles.subcategoryTitle}>{item.title}</Text>
        {latest && (
          <>
            <Text style={styles.subcategoryLatest}>
              {truncate(latest.original.title)}
            </Text>
            <View style={styles.whoWhen}>
              <Text style={{fontWeight: 'bold'}}>{timeDifference}</Text>
              <Text>{latest.username}</Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subcategoryContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  subcategoryInfo: {
    marginLeft: 10,
    textAlign: 'left',
  },
  subcategoryTitle: {
    fontWeight: '500',
    marginLeft: 5,
    fontSize: 20,
    color: '#4E392A',
    textAlign: 'left',
  },
  subcategoryLatest: {
    marginLeft: 5,
    marginVertical: 5,
    fontSize: 15,
    color: '#4E392A',
    textAlign: 'left',
  },
  whoWhen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginTop: 10,
    width: '85%',
  },
});

export default SubcategoryItem;
