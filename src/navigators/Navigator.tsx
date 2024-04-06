import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import Register from '../views/Register';
import {SubcategoryPage} from '../views/SubcategoryPage';
import Home from '../views/Home';
import {useUserContext} from '../hooks/ContextHooks';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Kirjaudu"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Rekisteröidy"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Etusivu"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Alakategoria"
        component={SubcategoryPage}
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
