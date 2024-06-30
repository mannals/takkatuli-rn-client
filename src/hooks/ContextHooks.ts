import {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
import {CatSubcatContext} from '../contexts/CatSubcatContext';

// custom hook for user context
const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// custom hook for catSubcat context
const useCatSubcatContext = () => {
  const context = useContext(CatSubcatContext);
  if (!context) {
    throw new Error(
      'useCatSubcatContext must be used within a CatSubcatProvider',
    );
  }
  return context;
};

export {useUserContext, useCatSubcatContext};
