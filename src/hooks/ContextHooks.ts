import {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
import {CatSubcatContext} from '../contexts/CatSubcatContext';

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

const useCatSubcatContext = () => {
  const context = useContext(CatSubcatContext);
  if (!context) {
    throw new Error(
      'useCatSubcatContext must be used within a CatSubcatProvider',
    );
  }
  return context;
}
export {useUserContext, useCatSubcatContext};
