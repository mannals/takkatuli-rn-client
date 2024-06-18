import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SubcategoryPage} from '../views/SubcategoryPage';
import Home from '../views/Home';
import LoginRegister from '../views/LoginRegister';
import {useUserContext} from '../hooks/ContextHooks';
import {PostPage} from '../views/PostPage';
import {Profile} from '../views/Profile';
import MakePost from '../views/MakePost';
import OtherUserProfile from '../views/OtherUserProfile';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const {user} = useUserContext();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Etusivu"
        component={Home}
        options={{headerShown: false}}
      />
      {user ? (
        <Stack.Screen
          name="Profiili"
          component={Profile}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name="Kirjaudu/Rekisteröidy"
          component={LoginRegister}
          options={{headerShown: false}}
        />
      )}
      <Stack.Screen
        name="Alakategoria"
        component={SubcategoryPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Postaus"
        component={PostPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Tee postaus"
        component={MakePost}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Toinen käyttäjä"
        component={OtherUserProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default Navigator;
