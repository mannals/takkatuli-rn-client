import React, {Dispatch, SetStateAction, createContext, useState} from 'react';

// type for update
type UpdateContextType = {
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
};

// context for update
const UpdateContext = createContext<UpdateContextType | null>(null);

// provider for update
const UpdateProvider = ({children}: {children: React.ReactNode}) => {
  const [update, setUpdate] = useState<boolean>(false);
  return (
    <UpdateContext.Provider value={{update, setUpdate}}>
      {children}
    </UpdateContext.Provider>
  );
};

export {UpdateProvider, UpdateContext};
