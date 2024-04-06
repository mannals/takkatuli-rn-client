import {StatusBar} from 'expo-status-bar';
import {Platform, StyleSheet} from 'react-native';
import Navigator from './src/navigators/Navigator';
import Home from './src/views/Home';
import {UserProvider} from './src/contexts/UserContext';

const App = () => {
  return (
    <>
      <UserProvider>
        <Navigator />
        <StatusBar style="auto" />
      </UserProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
