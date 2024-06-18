import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import {fetchData} from '../lib/functions';
import {
  CategoryWithSubcategories,
  FileValues,
  MakePost,
  NewPostWithoutFile,
  Post,
  PostPreview,
  PostWithOwner,
  PostWithAll,
  ProfilePicture,
  Subcategory,
  UpdateUser,
  User,
  UserWithProfilePicture,
  PostVote,
  EditedPost,
  EditPostWithFile,
  Votes,
  VoteAmounts,
} from '../types/DBTypes';
import {Credentials} from '../types/LocalTypes';
import {
  LoginResponse,
  MediaResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {CatSubcatContext} from '../contexts/CatSubcatContext';
import useUpdateContext from './updateHooks';

const useUser = () => {
  const [thisUser, setThisUser] = useState<UserWithProfilePicture | null>(null);
  const getUserById = async (id: number) => {
    const result = await fetchData<User>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id,
    );
    if (result) {
      return result;
    }
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
    const response = await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(user),
      },
    );
    setThisUser(response.user);
    return response;
  };

  const putPassword = async (passwords: {
    old_password: string;
    new_password: string;
  }) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(passwords),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/password',
      options,
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

  const [userWithProfilePicture, setUserWithProfilePicture] =
    useState<UserWithProfilePicture>();

  const getUserWithProfilePicture = async (id: number) => {
    console.log('user id', id);
    const user = await fetchData<UserWithProfilePicture>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id + '/profpic',
    );
    if (user) {
      setUserWithProfilePicture(user);
      setThisUser(user);
    }
  };

  const [profilePicture, setProfilePicture] = useState<ProfilePicture | null>(
    null,
  );
  const [thisProfilePicture, setThisProfilePicture] =
    useState<ProfilePicture | null>(null);

  const getProfilePicture = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await fetchData<ProfilePicture | null>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/profile/image',
      options,
    );
    setProfilePicture(result);
    return result;
  };

  const getProfilePictureById = async (id: number) => {
    const result = await fetchData<ProfilePicture | null>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/profile/image/' + id,
    );
    setThisProfilePicture(result);
    return result;
  };

  const changeProfilePicture = async (file: UploadResponse, token: string) => {
    console.log('changeProfilePicture entered');
    console.log(file);

    const filevalues: FileValues = {
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
    };
    console.log('filevalues', filevalues);
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(filevalues),
    };

    return await fetchData<ProfilePicture>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/profile',
      options,
    );
  };

  return {
    thisUser,
    setThisUser,
    getUserById,
    getUserByToken,
    postUser,
    getUsernameAvailability,
    getEmailAvailability,
    putUser,
    putPassword,
    deleteUser,
    userWithProfilePicture,
    getUserWithProfilePicture,
    profilePicture,
    thisProfilePicture,
    getProfilePictureById,
    getProfilePicture,
    changeProfilePicture,
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
        return cats;
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
    setCatsWithSubcats,
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
  const [thisPost, setThisPost] = useState<PostWithAll | null>(null);
  const [replies, setReplies] = useState<PostWithAll[] | null>(null);
  const [postPreviews, setPostPreviews] = useState<PostPreview[] | null>(null);
  const {update} = useUpdateContext();
  const {catSubcat, updateCatSubcat} = React.useContext(CatSubcatContext);

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
      const post = await fetchData<PostWithAll>(
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

  useEffect(() => {
    getAllPosts();
    updateCatSubcat();
  }, [update]);

  const getRepliesByPostId = async (postId: number) => {
    try {
      const replies = await fetchData<PostWithAll[]>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId + '/replies',
      );
      if (typeof replies === 'object') {
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

  const makeReply = async (replyData: NewPostWithoutFile, token: string) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(replyData),
      };
      return await fetchData<MediaResponse>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + replyData.reply_to,
        options,
      );
    } catch (e) {
      console.error(e);
    }
  };

  const editPost = async (
    fileData: UploadResponse | null,
    postData: EditedPost,
    postId: number,
  ) => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (fileData) {
        const post: EditPostWithFile = {
          ...postData,
          filename: fileData.data.filename,
          filesize: fileData.data.filesize,
          media_type: fileData.data.media_type,
        };
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(post),
        };
        return await fetchData<MessageResponse>(
          process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId,
          options,
        );
      } else {
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(postData),
        };
        return await fetchData<MessageResponse>(
          process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId,
          options,
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deletePost = async (postId: number) => {
    const token = await AsyncStorage.getItem('token');
    console.log('deletePost entered');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const response = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId,
        options,
      );

      if (response) {
        console.log('deletePost response', response);
        updateCatSubcat();
        return response;
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
    makeReply,
    editPost,
    deletePost,
  };
};

const useVotes = () => {
  const [postVotes, setPostVotes] = useState<VoteAmounts | null>(null);
  const [thisVote, setThisVote] = useState<string | null>();
  const getVotesByPost = async (postId: number) => {
    try {
      const votes = await fetchData<Votes>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId + '/votes',
      );
      if (votes) {
        const amts: VoteAmounts = {
          likes: 0,
          dislikes: 0,
        };
        if (votes.likes && votes.likes.length > 0) {
          amts.likes = votes.likes.length;
        }
        if (votes.dislikes && votes.dislikes.length > 0) {
          amts.dislikes = votes.dislikes.length;
        }
        setPostVotes(amts);
      }
    } catch (e) {
      console.error('Error in getVotesByPost', e);
    }
  };

  const getVote = async (postId: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<PostVote | MessageResponse>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId + '/vote',
        options,
      );
      console.log('getVote result', result);
      if (result && 'approve' in result) {
        if (result.approve === true) {
          setThisVote('like');
        } else {
          setThisVote('dislike');
        }
      } else if (result && 'message' in result) {
        setThisVote(null);
      }
    } catch (e) {
      console.error('Error in getVote', e);
    }
  };

  const addVote = async (postId: number, isApprove: boolean) => {
    const token = await AsyncStorage.getItem('token');
    console.log('post id', postId);
    console.log('isApprove', isApprove);
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({approve: isApprove}),
      };
      const result = await fetchData<PostVote | MessageResponse>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId + '/vote',
        options,
      );

      console.log(result);
      if (result && 'approve' in result) {
        setThisVote(result.approve ? 'like' : 'dislike');
        getVotesByPost(postId);
      } else if (
        result &&
        'message' in result &&
        result.message === 'Vote removed'
      ) {
        setThisVote(null);
        getVotesByPost(postId);
      }
    } catch (e) {
      console.error('Error in addVote', e);
    }
  };

  const deleteVote = async (postId: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId + '/vote',
        options,
      );
      if (result) {
        setThisVote(null);
        getVotesByPost(postId);
      }
    } catch (e) {
      console.error('Error in deleteVote', e);
    }
  };

  return {
    postVotes,
    setPostVotes,
    thisVote,
    setThisVote,
    getVotesByPost,
    getVote,
    addVote,
    deleteVote,
  };
};

const useFile = () => {
  const postFile = async (
    uri: string,
    token: string,
  ): Promise<UploadResponse> => {
    console.log('loading....');
    const fileResult = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/upload',
      uri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    console.log('loading finished');
    return fileResult.body ? JSON.parse(fileResult.body) : null;
  };

  return {postFile};
};

export {
  useUser,
  useAuth,
  useCategories,
  useSubcategories,
  usePosts,
  useVotes,
  useFile,
};
