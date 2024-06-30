import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';

// site logo
// navigates to home page when pressed
const Logo = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('Etusivu');
      }}
    >
      <Image style={styles.logo} source={require('../../assets/logo.png')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4E392A',
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderRadius: 10,
    shadowColor: '#000',
  },
  logo: {
    flex: 1,
    width: 200,
    resizeMode: 'contain',
  },
});

export default Logo;
