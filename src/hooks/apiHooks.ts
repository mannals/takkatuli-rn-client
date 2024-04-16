import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchData} from '../lib/functions';
import {CategoryWithSubcategories, MakePost, NewPostWithoutFile, Post, PostPreview, PostWithOwner, PostWithSubcat, Subcategory, UpdateUser, User} from '../types/DBTypes';
import {Credentials} from '../types/LocalTypes';
import {
  LoginResponse,
  MediaResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import useUpdateContext from './updateHooks';

const useUser = () => {
  const getUserById = async (id: number) => {
    return await fetchData<User>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id,
    );
  };

  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
      options,
    );
    return result;
  };

  const postUser = async (user: Record<string, string>) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
    return await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      options,
    );
  };
  const getUsernameAvailability = async (username: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/username/' + username,
    );
  };

  const getEmailAvailability = async (email: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/email/' + email,
    );
  };

  const putUser = async (
    token: string,
    user: UpdateUser,
  ): Promise<UserResponse> => {
    const userUpdate: Partial<UpdateUser> = {};
    for (const key in user) {
      if (user[key]) {
        userUpdate[key] = user[key];
      }
    }
    return await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(userUpdate),
      },
    );
  };

  const deleteUser = async () => {
    const token = await AsyncStorage.getItem('token');
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
  };

  return {
    getUserById,
    getUserByToken,
    postUser,
    getUsernameAvailability,
    getEmailAvailability,
    putUser,
    deleteUser,
  };
};

const useAuth = () => {
  const postLogin = async (values: Credentials) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    };
    const result = await fetchData<LoginResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
      options,
    );
    return result;
  };
  return {postLogin};
};

const useCategories = () => {
  const [catsWithSubcats, setCatsWithSubcats] = useState<
    CategoryWithSubcategories[]
  >([]);
  const {update} = useUpdateContext();

  const getAllCatsWithSubcats = async () => {
    try {
      const cats = await fetchData<CategoryWithSubcategories[]>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/categories/frontpage',
      );
      if (cats) {
        setCatsWithSubcats(cats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getAllCatsWithSubcats();
  }, [update]);

  return {
    catsWithSubcats,
    getAllCatsWithSubcats,
  };
};

const useSubcategories = () => {
  const [thisSubcat, setThisSubcat] = useState<Subcategory | null>(null);

  const getSubcatById = async (id: number) => {
    try {
      const subcat = await fetchData<Subcategory>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/subcategories/' + id,
      );
      if (subcat) {
        setThisSubcat(subcat);
        return subcat;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {thisSubcat, setThisSubcat, getSubcatById};
};

const usePosts = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [thisPost, setThisPost] = useState<PostWithSubcat | null>(null);
  const [replies, setReplies] = useState<PostWithSubcat[] | null>(null);
  const [postPreviews, setPostPreviews] = useState<PostPreview[] | null>(null);
  const {update} = useUpdateContext();

  const getAllPosts = async () => {
    try {
      const posts = await fetchData<Post[]>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts',
      );
      if (posts) {
        setPosts(posts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, [update]);

  const getPostPreviewsBySubcatId = async (subcat_id: number) => {
    try {
      const previews = await fetchData<PostPreview[]>(
        process.env.EXPO_PUBLIC_MEDIA_API +
          '/subcategories/' +
          subcat_id +
          '/posts',
      );
      if (previews) {
        setPostPreviews(previews);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getPostById = async (postId: number) => {
    try {
      const post = await fetchData<PostWithSubcat>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId,
      );
      if (post) {
        console.log(post.created_at);
        setThisPost(post);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getRepliesByPostId = async (postId: number) => {
    try {
      const replies = await fetchData<PostWithSubcat[]>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId + '/replies',
      );
      if (replies) {
        setReplies(replies);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const makeNewPost = async (
    fileData: UploadResponse | null,
    postData: NewPostWithoutFile,
    token: string,
  ) => {
    try {
      if (fileData) {
        const post = {
          ...postData,
          filename: fileData.data.filename,
          filesize: fileData.data.filesize,
          media_type: fileData.data.media_type,
        };
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(post),
        };
        return await fetchData<MediaResponse>(
          process.env.EXPO_PUBLIC_MEDIA_API + '/posts',
          options,
        );
      } else {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(postData),
        };
        return await fetchData<MediaResponse>(
          process.env.EXPO_PUBLIC_MEDIA_API + '/posts',
          options,
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    posts,
    thisPost,
    replies,
    postPreviews,
    getAllPosts,
    getPostPreviewsBySubcatId,
    getPostById,
    getRepliesByPostId,
    makeNewPost,
  };
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      };
      return await fetchData<UploadResponse>(
        process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/upload',
        options,
      );
    } catch (e) {
      console.error('Error uploading file', e);
    }
  };

  return {postFile};
};

export {useUser, useAuth, useCategories, useSubcategories, usePosts, useFile};
