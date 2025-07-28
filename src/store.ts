import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./ThemeSlice";
import postsReducer from "./store/slices/postsSlice";
import authReducer from "./store/slices/authSlice";
import bookmarkReducer from "./store/slices/bookMarkSlice";
const combinedReducer=combineReducers({
    theme:themeSlice.reducer,
    posts:postsReducer,
    auth:authReducer,
    bookmark: bookmarkReducer
});
const rootReducer=(state: any,action: any)=>{
 return combinedReducer(state,action)
}
export const store=configureStore({
   reducer:rootReducer
});
export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;
export default store;