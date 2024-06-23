import {Text, StyleSheet, View} from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.footerLinks}>
        <Text style={styles.footerLink}>Etusivu</Text>
        <Text style={styles.footerLink}>Säännöt</Text>
        <Text style={styles.footerLink}>Privacy Policy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#6F5A4B',
    padding: 10,
    flexDirection: 'row',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    width: '100%',
  },
  footerLink: {
    color: '#ffffff',
    fontSize: 10,
    marginHorizontal: 5,
  },
});

export default Footer;
