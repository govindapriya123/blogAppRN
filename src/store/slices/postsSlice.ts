import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {getItem} from '../../helpers/Storage';
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const authToken = await getItem('authToken');
  console.log('authToken:', authToken);
  const response = await axios.get('http://localhost:8086/api/posts/feed', {
    headers: {Authorization: `Bearer ${authToken}`},
  });
  console.log('response', JSON.stringify(response));
  return response.data;
});
interface InitialState {
  posts: any;
  myPosts: any;
  status: any;
  error: Error | null;
  publishedPosts: any;
  draftPosts: any;
}
const initialState: InitialState = {
  posts: [] as any[],
  myPosts: [] as any[],
  publishedPosts: [] as any[],
  draftPosts: [] as any[],
  status: 'idle',
  error: null as any,
};
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    saveMyPosts: (state, action) => {
      const userId = action.payload;
      state.myPosts = state.posts.filter(
        (post: any) => post.user.id === userId && post.status === 'Publish',
      );
    },
    publishedPosts: state => {
      state.publishedPosts = state.posts.filter(
        (post: any) => post.status === 'Publish',
      );
    },
    draftPosts: state => {
      state.draftPosts = state.posts.filter(
        (post: any) => post.status === 'Draft',
      );
    },
    updateBookmarkStatus: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((p: {id: any}) => p.id === postId);
      if (post) {
        post.bookmarked = !post.bookmarked;
      }

      // Optional: Update in publishedPosts too, if you're displaying that
      const publishedPost = state.publishedPosts.find(
        (p: {id: any}) => p.id === postId,
      );
      if (publishedPost) {
        publishedPost.bookmarked = !publishedPost.bookmarked;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error as Error;
      });
  },
});
export const {saveMyPosts, publishedPosts, draftPosts, updateBookmarkStatus} =
  postsSlice.actions;
export default postsSlice.reducer;
