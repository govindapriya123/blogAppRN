import React, {createContext,useState,useEffect,useContext, PropsWithChildren, ReactNode} from 'react';
import { Appearance } from 'react-native';
import { themes,Theme} from './theme';
interface ThemeContextType{
    theme:Theme;
    toggleTheme:()=>void;
}
const defaultTheme:ThemeContextType={
    theme:themes.light,
    toggleTheme:()=>{},
};
interface ThemeProviderProps {
    children: ReactNode; // Correctly type the `children` prop
  }
const ThemeContext=createContext<ThemeContextType>(defaultTheme);
export const ThemeProvider:React.FC<ThemeProviderProps>=({children}:ThemeProviderProps)=>{
  const [theme,setTheme]=useState<Theme>(themes.dark);
  const toggleTheme = () => {
    setTheme(theme === themes.dark ? themes.light : themes.dark);
  };
  console.log('--theme--',theme);
  return(
    <ThemeContext.Provider value={{theme,toggleTheme}}>
    {children}
    </ThemeContext.Provider>
  )
}
export const useTheme=():ThemeContextType=>useContext(ThemeContext);
