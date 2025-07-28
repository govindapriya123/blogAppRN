import {createSlice,PayloadAction} from '@reduxjs/toolkit';
import { themes } from './theme/theme';
type ThemeKeys = keyof typeof themes;
export interface ThemeState{
    name:ThemeKeys;
}
const initialState:ThemeState={
    name:'light'
}
export const themeSlice=createSlice({
    name:'theme',
    initialState,
    reducers:{
        turnTheme:(state,action:PayloadAction<ThemeKeys>)=>{
            state.name=action.payload;
        }
    }
});
export const {turnTheme}=themeSlice.actions;
export default themeSlice.reducer;
