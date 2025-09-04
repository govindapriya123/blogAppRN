import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {removeItem, setItemAsync} from '../../helpers/Storage';
import { URL } from '../../helpers/Util';
interface InitialState {
  user: any;
  token: string | null;
  loading: boolean;
  error: Error | null;
  profilePicURL:null;
}
const initialState: InitialState = {
  user: null,
  token: null,
  loading: false,
  profilePicURL:null,
  error: null,
};
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    {username, password}: {username: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await axios.post("http://localhost:8086/auth/login", {
        username,
        password,
      });
      console.log("response",response);
      const {user: loggedInUser, profileCompleted, token} = response.data;
      setItemAsync('authToken',token);
      return {loggedInUser, profileCompleted, token};
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Loginfailed');
    }
  },
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      removeItem('authToken');
    },
    setUserFromStorage: (state, action) => {
      state.user = action.payload;
    },
    setProfilePicture:(state,action)=>{
     state.profilePicURL=action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.loggedInUser;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as Error;
      });
  },
});
export const {logout, setUserFromStorage,setProfilePicture} = authSlice.actions;
export default authSlice.reducer;
