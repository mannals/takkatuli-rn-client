import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleChevronRight,
  faHome,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect} from 'react';
import Header from '../components/Header';
import {usePosts, useSubcategories} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import PostPreviewItem from '../components/PostPreview';
import {useUserContext} from '../hooks/ContextHooks';
import Footer from '../components/Footer';

type RootStackParamList = {
  Alakategoria: {subcat_id: number};
  Etusivu: undefined;
  'Tee postaus': {subcat_id: number};
  'Kirjaudu/Rekisteröidy': undefined;
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

// subcategory page
export const SubcategoryPage = ({route, navigation}: Props) => {
  const {user} = useUserContext();
  const subcatId = route.params.subcat_id;
  const {getSubcatById, thisSubcat} = useSubcategories();
  const {update, setUpdate} = useUpdateContext();
  const {postPreviews, getPostPreviewsBySubcatId} = usePosts();

  // refresh subcategory and post previews
  useEffect(() => {
    getSubcatById(subcatId);
    getPostPreviewsBySubcatId(subcatId);
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
          {thisSubcat && <Text style={styles.home}>{thisSubcat.title}</Text>}
        </View>
        <ScrollView>
          {thisSubcat && (
            <View style={styles.subcatInfo}>
              <Text style={styles.subcatTitle}>{thisSubcat.title}</Text>
              <Text>{thisSubcat.description}</Text>
            </View>
          )}
          {user && thisSubcat ? (
            <TouchableOpacity
              style={styles.newPostButton}
              onPress={() => {
                navigation.navigate('Tee postaus', {
                  subcat_id: thisSubcat.subcategory_id,
                });
              }}
            >
              <FontAwesomeIcon icon={faPlus} size={15} color={'#FFFFFF'} />
              <Text style={styles.buttonText}>Uusi lanka</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.newPostButton}
              onPress={() => {
                Alert.alert('Kirjaudu tai rekisteröidy tehdäksesi lankoja!');
                navigation.navigate('Kirjaudu/Rekisteröidy');
              }}
            >
              <FontAwesomeIcon icon={faPlus} size={15} color={'#FFFFFF'} />
              <Text style={styles.buttonText}>Uusi lanka</Text>
            </TouchableOpacity>
          )}
          <View style={styles.listTop}></View>
          {postPreviews?.map((item) => (
            <PostPreviewItem
              key={item.post_id}
              item={item}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </View>
      <Footer />
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
});
