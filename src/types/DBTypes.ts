export type UserLevel = {
  level_id: number;
  level_name: 'Admin' | 'User' | 'Guest';
};

export type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  created_at: Date | string;
  edited_at: Date | string | null;
};

export type UpdateUser = {
  email: string;
  fullname: string;
  phone: string;
  address: string;
  about_me: string;
  [key: string]: string | undefined;
};

export type Category = {
  category_id: number;
  title: string;
  created_at: Date | string;
};

export type Subcategory = {
  subcategory_id: number;
  category_id: number;
  title: string;
  description: string;
  created_at: Date | string;
};

export type Post = {
  post_id: number;
  user_id: number;
  subcategory_id: number;
  filename: string | null;
  filesize: number | null;
  thumbnail: string | null;
  media_type: string | null;
  is_poll: boolean | null;
  reply_to: number | null;
  title: string;
  text_content: string;
  created_at: Date | string;
  edited_at: Date | string | null;
};

export type PollOption = {
  option_id: number;
  post_id: number;
  title: string;
  created_at: Date | string;
  edited_at: Date | string | null;
};

export type PollOptionVote = {
  vote_id: number;
  option_id: number;
  user_id: number;
  created_at: Date | string | null;
};

export type PostVote = {
  vote_id: number;
  post_id: number;
  user_id: number;
  approve: boolean;
  created_at: Date | string;
};

export type UploadResult = {
  message: string;
  data?: {
    image: string;
  };
};

export type MostLikedPosts = Pick<
  Post,
  | 'post_id'
  | 'filename'
  | 'filesize'
  | 'media_type'
  | 'title'
  | 'text_content'
  | 'created_at'
> &
  Pick<User, 'user_id' | 'username' | 'email' | 'created_at'> & {
    likes_count: bigint;
  };

export type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

export type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

export type TokenContent = Pick<User, 'user_id'> &
  Pick<UserLevel, 'level_name'>;

export type CategoryWithSubcategories = Category & {
  subcategories: SubcatWithLatest[];
};

export type PostWithOwner = Post & Pick<User, 'username'>;

export type PostIDandTitle = Pick<Post, 'post_id' | 'title'>;

export type ReplyWithOriginal = PostWithOwner & {
  original: Pick<PostWithOwner, 'post_id' | 'username' | 'title'>;
};

export type PostInSubcatListing = Pick<
  PostWithOwner,
  'created_at' | 'username'
> & {
  original: PostIDandTitle;
};

export type SubcatWithLatest = Subcategory & {
  latest: PostInSubcatListing;
};

export type OriginalPost = Omit<Post, 'reply_to'>;

export type PostWithoutPoll = Omit<Post, 'is_poll'>;

export type FileInfo = {
  filename: string;
  user_id: number;
};
