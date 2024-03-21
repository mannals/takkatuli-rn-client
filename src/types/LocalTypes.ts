import {User, UserWithNoPassword} from './DBTypes';

type Credentials = Pick<User, 'username' | 'password'>;

type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type {Credentials, AuthContextType};
