import {StyleSheet, Text, View} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleChevronRight, faHome} from '@fortawesome/free-solid-svg-icons';
import {StackNavigationProp} from '@react-navigation/stack';
import Header from '../components/Header';

type RootStackParamList = {
  Alakategoria: {subcat_id: number};
  Kotisivu: undefined;
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

export const SubcategoryPage = ({route, navigation}: Props) => {
  const subcatId = route.params.subcat_id;
  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.siteLocation}>
          <FontAwesomeIcon icon={faHome} size={25} color={'#4E392A'} />
          <Text style={styles.home}>Etusivu</Text>
          <FontAwesomeIcon
            icon={faCircleChevronRight}
            size={25}
            color={'#4E392A'}
          />
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
});
