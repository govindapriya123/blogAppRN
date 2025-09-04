import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { getItem } from '../../helpers/Storage';
interface InitialState {
  bookmarkedPosts: any;
  loading: Boolean;
  error: null | Error;
  message: string | null;
}
const initialState: InitialState = {
  bookmarkedPosts: [] as any[],
  loading: false,
  error: null,
  message: null,
};
export const fetchBookMarkedPosts = createAsyncThunk(
  'bookmark/fetchBookMarkedPosts',
  async () => {
    const authToken=await getItem("authToken");
    const bookmarkedPosts = await axios.get("http://localhost:8086/api/bookmarks",{headers:{Authorization:`Bearer ${authToken}`}});
     console.log("bookmarkedPosts",bookmarkedPosts);
     return bookmarkedPosts.data;
  },
);
export const toggleBookMark = createAsyncThunk(
  'bookmark/toggleBookMark',
  async (postId:number,{rejectWithValue}) => {
    try{
    const authToken=await getItem("authToken");
    const toggleBookMark=await axios.post("http://localhost:8086/api/bookmarks/toggle",{postId},{
        headers: { Authorization: `Bearer ${authToken}` }
    });
   return toggleBookMark.data;
}catch(error){
    console.error("Bookmark error:",error);
    rejectWithValue("toggleBookmark Failed");
}
  },
);
const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  extraReducers(builder) {
    //Bookmarked posts
    builder
      .addCase(fetchBookMarkedPosts.pending, state => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchBookMarkedPosts.fulfilled, (state, action) => {
        (state.loading = false),
          (state.bookmarkedPosts = action.payload);
      })
      .addCase(fetchBookMarkedPosts.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload as Error);
      });
    //Bookmarked Toggle
    builder
      .addCase(toggleBookMark.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBookMark.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        // const bookmarkedPost = state.bookmarkedPosts.find(
        //   (p: {id: any}) => p.id === postId,
        // );
      })
      .addCase(toggleBookMark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as Error;
      });
  },
  reducers: {
    updateBookmarkPosts: (state, action) => {
      const postId = action.payload;
      const post = state.bookmarkedPosts.find((p: {id: any}) => p.id === postId);
      if (post) {
        post.bookmarked = !post.bookmarked;
      }
    }
  },
});
export const {updateBookmarkPosts} = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
