import React, {useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem } from '../helpers/Storage';
import { useAppSelector } from '../utils/hooks';
import { profilePicURL } from '../helpers/Util';
import { useNavigationContainerRef } from '@react-navigation/native';

const fields = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'bio', label: 'Bio' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'gender', label: 'Gender' },
  { key: 'location', label: 'Location' },
];

const ProfileScreen = ({navigation}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [usernameError,setUsernameError]=useState("");
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const userDetails=useAppSelector(state=>state.auth.user);
  const [profile, setProfile] = useState({
    username: userDetails.username,
    email: userDetails.email,
    phone: userDetails.profile.phone,
    bio: userDetails.profile.bio,
    dob: userDetails.profile.dob,
    gender: userDetails.profile.gender,
    location: userDetails.profile.location
  });
  const [loading, setLoading] = useState(false);
  console.log(userDetails);

  useEffect(() => {
    // fetchProfileData();
    setProfilePic({uri:`${profilePicURL}/${userDetails.username}.jpg`});
  }, []);

  const fetchProfileData= async () => {
    setLoading(true);
    try {
      const token = await getItem('authToken');
      console.log('token',token);
  
      // Prepare FormData
      const pData = {
       ...profile
      }
      const formData = new FormData();
      formData.append('data', pData);
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
        'http://192.168.0.126:8086/api/profile', 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("response",JSON.stringify(response));
  
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () =>
  {
    setIsEditing(!isEditing);
    handleSave();
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
      console.log("-- FormData before sending --");
      // if (profilePic) {
      //   formData.append('profilePic', {
      //     uri: profilePic.uri,
      //     type: 'image/jpeg',
      //     name: 'profile.jpg',
      //   });
      // }
      console.log('--response--',formData);
      const response = await axios.put('http://localhost:8086/api/profile',{
        username: profile.username,
        phone: profile.phone,
        dob: profile.dob,
        gender: profile.gender,
        bio: profile.bio,
        location: profile.location,
      }, {
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
    if (await validateUsername(newUsername)) {
      setUsernameError('');
    } else {
      setUsernameError('This username is already taken.');
    }
  };
  

  const handleChange = (field: string, value: string) => {
    if(field==="username"){
      handleUsernameChange(value);
    }
    setProfile({ ...profile, [field]: value });
  };


  const selectImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets?.length) {
        setProfilePic({ uri: response.assets[0].uri });
      }
    });
  };

  const getInitials = (name = '') => {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.imageContainer}>
        {profilePic?.uri ? (
          <Image source={{ uri: profilePic.uri }} style={styles.profileImage} />
        ) : (
          <View style={styles.fallbackAvatar}>
            <Text style={styles.initials}>{getInitials(profile.username)}</Text>
          </View>
        )}
        {isEditing && (
          <TouchableOpacity onPress={selectImage} style={styles.cameraIcon}>
            <Text style={styles.cameraText}>📷</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        {fields.map(({ key, label }) => (
          <View key={key} style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>

            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={profile?.[key] || ''}
                  onChangeText={text => handleChange(key, text)}
                  placeholder={`Enter ${label}`}
                />
                {key === 'username' && usernameError ? (
                  <Text style={{ color: 'red', fontSize: 12 }}>
                    {usernameError}
                  </Text>
                ) : null}
                {key === 'email' && emailError ? (
                  <Text style={{ color: 'red', fontSize: 12 }}>
                    {emailError}
                  </Text>
                ) : null}
                {key === 'phone' && phoneError ? (
                  <Text style={{ color: 'red', fontSize: 12 }}>
                    {phoneError}
                  </Text>
                ) : null}
                {key === 'dob' && dobError ? (
                  <Text style={{ color: 'red', fontSize: 12 }}>
                    {dobError}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.readOnlyText}>{profile?.[key] || 'N/A'}</Text>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#16213E',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#C956A8',
  },
  fallbackAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#394867',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 100,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
  },
  cameraText: {
    fontSize: 16,
  },
  card: {
    backgroundColor: '#F2ECE1',
    borderRadius: 16,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#444',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#C956A8',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
