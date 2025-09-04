import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import {Alert, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useAppSelector} from '../utils/hooks';
import { clearStorage } from '../helpers/Storage';

const CustomDrawer = (props: any,navigation: { navigate: (arg0: string) => void; }) => {
  const profilePic = useAppSelector(state => state.auth.profilePicURL);
  const userDetails = useAppSelector(state => state.auth.user);
  console.log("--profilePic--",profilePic);
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearStorage();
         // rootNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
         navigation.navigate("Login");
        },
      },
    ]);
  };


  return (
    <SafeAreaView style={{flex: 1}}>
       <LinearGradient
          colors={['#D68073', '#C956A8']}
          style={styles.profileContainer}>
        <View style={{paddingVertical: 30,
    paddingHorizontal: 20}}>
        <Image
          source={profilePic || require('../resources/profileimage.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userDetails?.username || 'Guest'}</Text>
        <Text style={styles.profileEmail}>{userDetails?.email || 'user@example.com'}</Text>
        </View>
        </LinearGradient>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        bounces={false}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={handleLogout}
          labelStyle={styles.signoutLabel}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawer;
const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#f2f2f2',
  },
  drawerContent: {
    paddingTop: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
  },
  signoutLabel: {
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
});
