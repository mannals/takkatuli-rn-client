import {
  Category,
  CategoryWithSubcategories,
  Subcategory,
  User,
  UserWithNoPassword,
} from './DBTypes';

type Credentials = Pick<User, 'username' | 'password'>;

type CatSubcatContextType = {
  catSubcat: CategoryWithSubcategories[] | null;
  updateCatSubcat: () => void;
};

type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
  handleGetUser: () => void;
  handleEdit: (user: User) => void;
};

export type {Credentials, CatSubcatContextType, AuthContextType};
