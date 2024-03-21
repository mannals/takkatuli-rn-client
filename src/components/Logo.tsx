import {View, StyleSheet, Image} from 'react-native';

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

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/logo.png')} />
    </View>
  );
};

export default Logo;
