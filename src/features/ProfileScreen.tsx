import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as ImagePicker from 'react-native-image-picker'; // Image picker library
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem } from '../helpers/Storage';
import { useAppSelector } from '../utils/hooks';
import { profilePicURL } from '../helpers/Util';

const ProfileContainer = styled(View)`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.primaryBackground};
`;

const ProfileHeader = styled(View)`
  align-items: center;
  margin-bottom: 30px;
`;

const ProfileImage = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border-width: 2px;
  border-color: ${(props) => props.theme.headerText};
`;

const InfoField = styled(View)`
  margin-bottom: 15px;
`;

const FieldLabel = styled(Text)`
  color: ${(props) => props.theme.headerText};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const FieldInput = styled(TextInput)`
  border: 1px solid ${(props) => props.theme.inputBackground};
  border-radius: 10px;
  padding: 10px;
  color: ${(props) => props.theme.loginInputText};
  background-color: ${(props) => props.theme.inputBackground};
`;

const SaveButton = styled(TouchableOpacity)`
  margin-top: 20px;
  align-self: center;
  width: 70%;
`;

const SaveButtonText = styled(Text)`
  text-align: center;
  padding: 10px;
  font-size: 18px;
  color: white;
  font-weight: bold;
`;

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [usernameError,setUsernameError]=useState('');
  const userDetails=useAppSelector(state=>state.auth.user);
  console.log("userDetails",userDetails);

  useEffect(() => {
    fetchProfileData();
    setProfilePic({uri:`${profilePicURL}/${userDetails.username}.jpg`});
  }, []);

  const fetchProfileData= async () => {
    setLoading(true);
    try {
      const token = await getItem('authToken');
      console.log('token',token);
  
      // Prepare FormData
      const formData = new FormData();
      formData.append('username', username);
      console.log('--formData--',formData);
      if (profilePic) {
        formData.append('profilePic', {
          uri: profilePic.uri,
          name: 'profile.jpg',
          type: 'image/jpeg', // Make sure the correct MIME type is set
        });
      }
      console.log('--formData--',formData);
  
      // Make the API call
      const response = await axios.put(
        'http://192.168.0.126:8086/api/users/profile', 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSave = async () => {
    console.log("🚀 handleSave function called!");
    setLoading(true);
    try {
      console.log("🔄 Fetching authToken...");
      const token = await getItem('authToken');
      console.log("🔑 Retrieved Token:", token); 
      console.log("🔄 Preparing FormData...");
      const formData = new FormData();
      if(username){
      formData.append('username', username);
      }
      console.log("-- FormData before sending --");
      if (profilePic) {
        formData.append('profilePic', {
          uri: profilePic.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
      console.log('--response--',formData);
      const response = await axios.put('http://192.168.0.126:8086/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });
    console.log('--response--',response);
    if(response.status===200){
      navigation.navigate('Login');
    }
  
      Alert.alert('Profile Updated', 'Your profile information has been saved.');
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Login');
  };
  const validateUsername = async (newUsername: any) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
     const response= await axios.post(
        'http://192.168.0.126:8086/auth/validate-username',
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      return true; // Username is available
    } catch (error:any) {
      if (error.response?.status === 409) {
        return false; // Username is taken
      }
      console.error('Error validating username:', error);
      return false;
    }
  };
  
  const handleUsernameChange = async (newUsername: any) => {
    setUsername(newUsername);
    if (await validateUsername(newUsername)) {
      setUsernameError('');
    } else {
      setUsernameError('This username is already taken.');
    }
  };

  const selectImage = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => launchCamera(),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImageFromGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const launchCamera = () => {
    ImagePicker.launchCamera({ mediaType: 'photo', quality: 0.8 }, handleImageResponse);
  };

  const pickImageFromGallery = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, handleImageResponse);
  };

  const handleImageResponse = (response:any) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.error('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const source = { uri: response.assets[0].uri };
      setProfilePic(source);
    } else {
      console.error('Unexpected response structure: ', response);
    }
  };

  return (
    <ProfileContainer>
      {loading ? (
        <ActivityIndicator size="large" color="#C956A8" />
      ) : (
        <>
          <ProfileHeader>
            <ProfileImage source={profilePic|| require('../resources/profileimage.png')} />
            <TouchableOpacity onPress={selectImage} style={styles.cameraIcon}>
              <Icon name="camera-alt" size={24} color="#888" />
            </TouchableOpacity>
          </ProfileHeader>

          <InfoField>
            <FieldLabel>Username</FieldLabel>
            <FieldInput value={username} onChangeText={handleUsernameChange} placeholder="Enter your username" />
          </InfoField>

          <SaveButton onPress={handleSave}>
            <LinearGradient colors={['#D68073', '#C956A8']} style={{ borderRadius: 10 }}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <SaveButtonText>Save Changes</SaveButtonText>
              )}
            </LinearGradient>
          </SaveButton>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </ProfileContainer>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
  },
  logoutButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
