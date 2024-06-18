import {StatusBar} from 'expo-status-bar';
import {Platform, StyleSheet} from 'react-native';
import Navigator from './src/navigators/Navigator';
import {UserProvider} from './src/contexts/UserContext';
import {UpdateProvider} from './src/contexts/UpdateContext';
import {CatSubcatProvider} from './src/contexts/CatSubcatContext';

const App = () => {
  return (
    <>
      <UserProvider>
        <UpdateProvider>
          <CatSubcatProvider>
            <Navigator />
            <StatusBar style="auto" />
          </CatSubcatProvider>
        </UpdateProvider>
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
