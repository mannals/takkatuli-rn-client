import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleChevronRight,
  faCircleUser,
  faHome,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {RouteProp} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Image} from '@rneui/base';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import Header from '../components/Header';
import {useUser} from '../hooks/apiHooks';

// change language to Finnish for date formatting
moment.locale('fi');

type RootStackParamList = {
  'Toinen käyttäjä': {user_id: number};
  Etusivu: undefined;
  Alakategoria: {subcat_id: number};
};

type PostPageRouteProp = RouteProp<RootStackParamList, 'Toinen käyttäjä'>;
type PostPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Toinen käyttäjä'
>;

type Props = {
  route: PostPageRouteProp;
  navigation: PostPageNavigationProp;
};

// other user profile page
const OtherUserProfile = ({route, navigation}: Props) => {
  const userId = route.params.user_id;
  const {getUserWithProfilePicture, thisUser} = useUser();
  const [update, setUpdate] = useState<boolean>(false);

  // refresh user data
  useEffect(() => {
    getUserWithProfilePicture(userId);
  }, [update]);

  // set bio text
  const bio = thisUser?.bio_text ? thisUser.bio_text : 'Ei kuvausta';

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
            {thisUser?.filename && !(thisUser.filename === '') ? (
              <View>
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: 'cover',
                    resizeMode: 'contain',
                    marginBottom: 10,
                  }}
                  source={{uri: thisUser.filename}}
                  alt={thisUser.filename}
                  onError={(error) =>
                    console.error('Error loading image:', error)
                  }
                />
              </View>
            ) : (
              <FontAwesomeIcon
                icon={faCircleUser}
                size={130}
                color={'#4E392A'}
                style={{marginVertical: 20}}
              />
            )}
          </View>
          <View style={styles.userInfo}>
            <View style={styles.infoTitleEdit}>
              <Text style={styles.infoTitle}>Omat tiedot</Text>
            </View>
            <View style={styles.infoFields}>
              <View style={styles.infoField}>
                <Text style={{fontWeight: 'bold'}}>Käyttäjänimi</Text>
                <Text>{thisUser?.username}</Text>
              </View>
              <View style={styles.infoField}>
                <Text style={{fontWeight: 'bold'}}>Sähköpostiosoite</Text>
                <Text>{thisUser?.email}</Text>
              </View>
              <View style={styles.infoField}>
                <Text style={{fontWeight: 'bold'}}>Rekisteröitynyt</Text>
                <Text>{moment(thisUser?.created_at).format('DD.MM.YYYY')}</Text>
              </View>
              <View style={styles.bioField}>
                <Text style={{fontWeight: 'bold'}}>Kuvaus</Text>
                <Text>{bio}</Text>
              </View>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bioField: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default OtherUserProfile;
