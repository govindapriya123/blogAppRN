import React, { startTransition, useEffect, useState } from 'react';
import { NavigationContainer,  useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/features/SplashScreen';
import LoginScreen from './src/features/LoginScreen';
import AddTransactionScreen from './src/features/AddTransactionScreen';
import AnalyticsScreen from './src/features/AnalyticsScreen';
import SettingsScreen from './src/features/SettingsScreen';
import ProfileScreen from './src/features/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import RegisterScreen from './src/features/RegisterScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from './src/features/DashboardScreen';
import TransactionScreen from './src/features/TransactionScreen';
import CreatePostScreen from './src/features/CreatePostScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from 'styled-components';
import { themes } from './src/theme/theme';
import { Provider, useSelector } from 'react-redux';
import store from './src/store';
import { ThemeState } from './src/ThemeSlice';
import { getItem } from './src/helpers/Storage';
import CustomDrawer from './src/custom/CustomDrawer';
import MyFeed from './src/features/MyFeed';
import BookmarksScreen from './src/features/BookMarksScreen';
import DraftsScreen from './src/features/DraftsScreen';
import PostDetailsScreen from './src/features/PostDetailsScreen';
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const addIcon=require('./src/resources/plus.png');
function HomeScreenTabs() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        listeners={{
          focus: () => navigation.setOptions({ title: 'Dashboard' }),
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} /> // Replace with your icon
          ),
        }}
      />
      <Tab.Screen
        name="CreatePost"
        listeners={{
          focus: () => navigation.setOptions({ title: 'Create Post' }),
        }}
        component={CreatePostScreen}
        options={{
          tabBarLabel: '', // Hide the text label
          tabBarIcon: ({ color, size }) => (
            <Image
              source={addIcon}
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} /> // Replace with your icon
          ),}} />
    </Tab.Navigator>
  );
}


function AppDrawer() {
  const theme=useTheme();
  return (
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerStyle: { backgroundColor: theme.headerBgColor },
      headerTintColor: theme.headerText,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Drawer.Screen
      name="Home"
      component={HomeScreenTabs}
      options={{
        drawerIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="SavedPosts"
      component={BookmarksScreen}
      options={{
        drawerIcon: ({ color, size }) => <Icon name="bookmark" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="MyFeed"
      component={MyFeed}
      options={{
        drawerIcon: ({ color, size }) => <Icon name="rss-feed" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Drafts"
      component={DraftsScreen}
      options={{
        drawerIcon: ({ color, size }) => <Icon name="drafts" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        drawerIcon: ({ color, size }) => <Icon name="person" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        drawerIcon: ({ color, size }) => <Icon name="settings" size={size} color={color} />,
      }}
    />
  </Drawer.Navigator>
  );
}
const ThemedApp= ()=>{
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('light'); // Default theme
  const theme = useSelector((state: { theme: ThemeState }) => state.theme.name);
  useEffect(() => {
    const fetchTheme = async () => {
      const storedTheme = (await getItem('app_theme')) as keyof typeof themes;
      startTransition(() => {
        setCurrentTheme(storedTheme || theme); // Use stored theme or fallback to redux theme
      });
    };
    fetchTheme();
  }, [theme]);
 return(
  <ThemeProvider theme={themes[currentTheme]} >
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash"   screenOptions={{
            // Dynamically set header styles
            headerStyle: {
              backgroundColor:themes[currentTheme] .headerBgColor,
            },
            headerTintColor: themes[currentTheme].headerText,
            headerTitleStyle: {
              fontWeight: 'bold',
              // Or any other style you want
              // color: activeTheme.headerTextColor // optional
            },
          }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }}  />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  </ThemeProvider>
 )
}


export default function App() {
  return (
    <Provider store={store}>
    <ThemedApp/>
    </Provider>
  );
}