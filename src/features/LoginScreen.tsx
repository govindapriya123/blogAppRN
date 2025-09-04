import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from '../utils/hooks';
import { loginUser, setProfilePicture, setUserFromStorage } from '../store/slices/authSlice';
import { profilePicURL } from '../helpers/Util';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');
const Container=styled(View)(props=>({
  backgroundColor:props.theme.primaryBackground,
    flex: 1,
    padding: 24,
    justifyContent: 'center'
}));
const Header=styled(Text)(props=>({
  color:props.theme.headerText,
  fontSize: 32,
    fontWeight: '700',
    // color: '#333',
    marginBottom: 4,
}));
const subHeader=styled(Text)(props=>({
  fontSize: 16,
  color: props.theme.headerText,
  marginBottom: 24,
}));
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch=useAppDispatch();

  const handleLogin = async() => {
    if(!username||!password){
      Alert.alert("Missing Fields","Please enter username and password");
      return;
    }
    console.log('Logging in with email:', email, 'password:', password);
    try{
      const resultAction=await dispatch(loginUser({username,password}));
      console.log("--resultAction--",resultAction);
      if(loginUser.fulfilled.match(resultAction)){
        const {profileCompleted,loggedInUser}=resultAction.payload;
        dispatch(setUserFromStorage(loggedInUser));
        dispatch(setProfilePicture({uri:`${profilePicURL}/${loggedInUser.username}.jpg`}));
        // if(!profileCompleted){
        //   Alert.alert('Profile Incomplete', 'Please complete your profile');
        //   navigation.navigate('Profile');
        // }else{
          Alert.alert('Login Successful', 'Welcome back!');
          navigation.navigate('AppDrawer');
        // }

      }else{
        Alert.alert('Login Failed',resultAction.payload as string);
      }
    }catch(error){
       Alert.alert('Error','Something went wrong.Please try again');
    }
  };
  return (
    <Container>
      <Header>Welcome</Header>
      <Text style={styles.subHeader}>Sign in to your account</Text>

      <View style={styles.inputContainer}>
        <Icon name="user" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#B0B0B0"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcon name="email" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0B0B0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.buttonWrapper}>
        <LinearGradient colors={['#D68073', '#C956A8']} style={styles.gradient}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Log In</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  icon: {
    fontSize: 20,
    color: '#9A9A9A',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  forgotText: {
    alignSelf: 'flex-end',
    marginTop: 8,
    color: '#C956A8',
    fontSize: 14,
  },
  buttonWrapper: {
    marginTop: 24,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
  },
});
