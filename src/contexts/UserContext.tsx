import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {AuthContextType, Credentials} from '../types/LocalTypes';
import {UpdateUser, UserWithNoPassword} from '../types/DBTypes';
import {useAuth, useUser} from '../hooks/apiHooks';

// context for user
const UserContext = createContext<AuthContextType | null>(null);

// provider for user
const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<UserWithNoPassword | null>(null);
  const {postLogin} = useAuth();
  const {getUserByToken, putUser} = useUser();

  // handle login
  const handleLogin = async (creds: Credentials) => {
    try {
      const result = await postLogin(creds);
      if (result) {
        AsyncStorage.setItem('token', result.token);
        setUser(result.user);
        console.log(result.user, 'result.user', result.token, 'result.token');
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  // handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  // handle auto login
  // ensure user stays logged in
  const handleAutoLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token, 'token');
      if (token) {
        const result = await getUserByToken(token);
        if (result) {
          setUser(result.user);
        }
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  // handle get user
  const handleGetUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const result = await getUserByToken(token);
        if (result) {
          setUser(result.user);
        }
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  // handle edit user
  const handleEdit = async (values: UpdateUser) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await putUser(token, values);
        console.log(values, 'values');
        const result = await getUserByToken(token);
        console.log(result, 'result');
        if (result) {
          setUser(result.user);
        }
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        handleAutoLogin,
        handleGetUser,
        handleEdit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export {UserProvider, UserContext};
