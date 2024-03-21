import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser, faBars} from '@fortawesome/free-solid-svg-icons';
import {View, StyleSheet} from 'react-native';
import Logo from './Logo';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#4E392A',
    height: 130,
  },
  iconsContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
});

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Logo />
      <View style={styles.iconsContainer}>
        <FontAwesomeIcon
          icon={faUser}
          size={30}
          color={'#EEEEEE'}
          style={{marginHorizontal: 15}}
        />
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
