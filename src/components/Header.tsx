import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faBars,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useUserContext} from '../hooks/ContextHooks';
import Logo from './Logo';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#4E392A',
    height: 110,
  },
  iconsContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
});

const Header = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {user} = useUserContext();
  return (
    <View style={styles.headerContainer}>
      <Logo />
      <View style={styles.iconsContainer}>
        {user ? (
          <TouchableOpacity
            id="profileButton"
            onPress={() => {
              navigation.navigate('Profiili');
            }}
          >
            <FontAwesomeIcon
              icon={faUser}
              size={30}
              color={'#EEEEEE'}
              style={{marginHorizontal: 15}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            id="loginButton"
            onPress={() => {
              navigation.navigate('Kirjaudu');
            }}
          >
            <FontAwesomeIcon
              icon={faRightToBracket}
              size={30}
              color={'#EEEEEE'}
              style={{marginHorizontal: 15}}
            />
          </TouchableOpacity>
        )}
        <FontAwesomeIcon
          icon={faBars}
          size={30}
          color={'#EEEEEE'}
          style={{paddingHorizontal: 10}}
        />
      </View>
    </View>
  );
};

export default Header;
