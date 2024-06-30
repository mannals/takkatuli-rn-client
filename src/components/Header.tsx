import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faRightFromBracket,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useUserContext} from '../hooks/ContextHooks';
import Logo from './Logo';

// header for every page
const Header = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {user, handleLogout} = useUserContext();

  // logout user
  const logout = async () => {
    await handleLogout();
    Alert.alert('Kirjauduit ulos');
    navigation.navigate('Etusivu');
  };

  return (
    <View style={styles.headerContainer}>
      <Logo />
      <View style={styles.iconsContainer}>
        {user ? (
          <>
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
            <TouchableOpacity
              id="logoutButton"
              onPress={() => {
                logout();
              }}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                size={30}
                color={'#EEEEEE'}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            id="loginButton"
            onPress={() => {
              navigation.navigate('Kirjaudu/Rekisteröidy');
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
      </View>
    </View>
  );
};

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

export default Header;
