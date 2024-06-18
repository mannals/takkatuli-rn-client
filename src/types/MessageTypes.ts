import {Post, UserWithNoPassword, UserWithProfilePicture} from './DBTypes';

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type MediaResponse = MessageResponse & {
  media: Post;
};

// for auth server
type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UserWithNoPassword;
};

type UserResponse = MessageResponse & {
  user: UserWithProfilePicture;
};

type UserDeleteResponse = MessageResponse & {
  user: {user_id: number};
};

type AvailableResponse = Partial<MessageResponse> & {
  available?: boolean;
};

type BooleanResponse = MessageResponse & {
  success: boolean;
};

// for upload server
type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
    thumbnail: string;
  };
};

export type {
  MessageResponse,
  ErrorResponse,
  MediaResponse,
  LoginResponse,
  UploadResponse,
  UserResponse,
  UserDeleteResponse,
  AvailableResponse,
  BooleanResponse,
};
