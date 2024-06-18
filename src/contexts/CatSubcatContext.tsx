import React, {useEffect} from 'react';
import {CatSubcatContextType} from '../types/LocalTypes';
import {useCategories} from '../hooks/apiHooks';
import {CategoryWithSubcategories} from '../types/DBTypes';

const CatSubcatContext = React.createContext<CatSubcatContextType>({
  catSubcat: null,
  updateCatSubcat: () => {},
});

// Create a provider component
const CatSubcatProvider = ({children}: {children: React.ReactNode}) => {
  const [catSubcat, setCatSubcat] = React.useState<
    CategoryWithSubcategories[] | null
  >(null);

  const {getAllCatsWithSubcats} = useCategories();

  const updateCatSubcat = async () => {
    console.log('updateCatSubcat called');
    const newCatSubcat = await getAllCatsWithSubcats();
    console.log('newCatSubcat', newCatSubcat);
    if (newCatSubcat) {
      setCatSubcat(newCatSubcat);
    }
  };

  useEffect(() => {
    updateCatSubcat();
  }, []);

  return (
    <CatSubcatContext.Provider value={{catSubcat, updateCatSubcat}}>
      {children}
    </CatSubcatContext.Provider>
  );
};

export {CatSubcatProvider, CatSubcatContext};
