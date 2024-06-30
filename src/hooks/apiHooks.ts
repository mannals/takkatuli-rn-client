import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import {fetchData} from '../lib/functions';
import {
  CategoryWithSubcategories,
  FileValues,
  NewPostWithoutFile,
  Post,
  PostPreview,
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

// custom hooks for API calls

// hook for user
const useUser = () => {
  const [thisUser, setThisUser] = useState<UserWithProfilePicture | null>(null);

  // get user by id
  const getUserById = async (id: number) => {
    const result = await fetchData<User>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id,
    );
    if (result) {
      return result;
    }
  };

  // get user by token
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

  // post user
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

  // get username availability
  const getUsernameAvailability = async (username: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/username/' + username,
    );
  };

  // get email availability
  const getEmailAvailability = async (email: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/email/' + email,
    );
  };

  // edit user
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

  // change password
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

  // delete user
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

  // get user with profile picture
  const getUserWithProfilePicture = async (id: number) => {
    const user = await fetchData<UserWithProfilePicture>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id + '/profpic',
    );
    if (user) {
      setUserWithProfilePicture(user);
      setThisUser(user);
    }
  };

  // your own profile picture
  const [profilePicture, setProfilePicture] = useState<ProfilePicture | null>(
    null,
  );

  // any user's profile picture
  const [thisProfilePicture, setThisProfilePicture] =
    useState<ProfilePicture | null>(null);

  // get profile picture
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

  // get profile picture by id
  const getProfilePictureById = async (id: number) => {
    const result = await fetchData<ProfilePicture | null>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/profile/image/' + id,
    );
    setThisProfilePicture(result);
    return result;
  };

  // change profile picture
  const changeProfilePicture = async (file: UploadResponse, token: string) => {
    const filevalues: FileValues = {
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
    };

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

// hook for authentication
const useAuth = () => {
  // post login
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

// hook for categories
const useCategories = () => {
  const [catsWithSubcats, setCatsWithSubcats] = useState<
    CategoryWithSubcategories[]
  >([]);
  const {update} = useUpdateContext();

  // get all categories with subcategories
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

  // update categories
  useEffect(() => {
    getAllCatsWithSubcats();
  }, [update]);

  return {
    catsWithSubcats,
    setCatsWithSubcats,
    getAllCatsWithSubcats,
  };
};

// hook for subcategories
const useSubcategories = () => {
  const [thisSubcat, setThisSubcat] = useState<Subcategory | null>(null);

  // get subcategory by id
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

// hook for posts
const usePosts = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [thisPost, setThisPost] = useState<PostWithAll | null>(null);
  const [replies, setReplies] = useState<PostWithAll[] | null>(null);
  const [postPreviews, setPostPreviews] = useState<PostPreview[] | null>(null);
  const {update} = useUpdateContext();
  const {catSubcat, updateCatSubcat} = React.useContext(CatSubcatContext);

  // get all posts
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

  // get post previews by subcategory id
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

  // get post by id
  const getPostById = async (postId: number) => {
    try {
      const post = await fetchData<PostWithAll>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + postId,
      );
      if (post) {
        setThisPost(post);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // update posts
  useEffect(() => {
    getAllPosts();
    updateCatSubcat();
  }, [update]);

  // get replies by post id
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

  // make new post
  const makeNewPost = async (
    fileData: UploadResponse | null,
    postData: NewPostWithoutFile,
    token: string,
  ) => {
    try {
      // file is optional
      // if file is included
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
      // if file is not included
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

  // make reply
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

  // edit post
  const editPost = async (
    fileData: UploadResponse | null,
    postData: EditedPost,
    postId: number,
  ) => {
    const token = await AsyncStorage.getItem('token');
    try {
      // file is optional
      // if file is included
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
      // if file is not included
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

  // delete post
  const deletePost = async (postId: number) => {
    const token = await AsyncStorage.getItem('token');

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

// hook for votes
const useVotes = () => {
  const [postVotes, setPostVotes] = useState<VoteAmounts | null>(null);
  const [thisVote, setThisVote] = useState<string | null>();

  // get votes by post
  const getVotesByPost = async (postId: number) => {
    try {
      const votes = await fetchData<Votes>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/votes/' + postId + '/all',
      );
      if (votes) {
        // if there are votes
        // divide votes into likes and dislikes
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

  // get my vote
  const getVote = async (postId: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<PostVote | MessageResponse>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/votes/' + postId,
        options,
      );

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

  // add vote
  const addVote = async (postId: number, isApprove: boolean) => {
    const token = await AsyncStorage.getItem('token');
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
        process.env.EXPO_PUBLIC_MEDIA_API + '/votes/' + postId,
        options,
      );

      // if vote was added
      if (result && 'approve' in result) {
        setThisVote(result.approve ? 'like' : 'dislike');
        getVotesByPost(postId);
        // if vote was removed
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

  // delete vote
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
        process.env.EXPO_PUBLIC_MEDIA_API + '/votes/' + postId,
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

// hook for file upload
const useFile = () => {
  // post file
  const postFile = async (
    uri: string,
    token: string,
  ): Promise<UploadResponse> => {
    console.log('postFile', uri, token);
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
