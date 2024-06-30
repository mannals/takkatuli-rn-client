import React, {useEffect} from 'react';
import {CatSubcatContextType} from '../types/LocalTypes';
import {useCategories} from '../hooks/apiHooks';
import {CategoryWithSubcategories} from '../types/DBTypes';

// context for categories and subcategories
const CatSubcatContext = React.createContext<CatSubcatContextType>({
  catSubcat: null,
  updateCatSubcat: () => {},
});

// provider for categories and subcategories
const CatSubcatProvider = ({children}: {children: React.ReactNode}) => {
  const [catSubcat, setCatSubcat] = React.useState<
    CategoryWithSubcategories[] | null
  >(null);

  const {getAllCatsWithSubcats} = useCategories();

  // update categories and subcategories
  const updateCatSubcat = async () => {
    console.log('updateCatSubcat called');
    const newCatSubcat = await getAllCatsWithSubcats();
    console.log('newCatSubcat', newCatSubcat);
    if (newCatSubcat) {
      setCatSubcat(newCatSubcat);
    }
  };

  // update categories and subcategories on mount
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
