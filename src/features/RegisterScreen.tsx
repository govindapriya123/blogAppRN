import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
 //const imageSource = require('../resources/LoginImage.jpg'); // Adjust the path as needed
  const handleRegister = () => {
    console.log('Logging in with email:', email, 'password:', password);
    async function fetchData() {
      // try {
         await axios.post('http://192.168.0.126:8086/auth/register', {
          username: username,
          password: password,
          email: email,
        },{headers:{"Content-Type":"application/json"}}).then(response=>{
          if(response.status===200){
            navigation.navigate('Login');
            Alert.alert("Registration completed successfully!");
          }
          console.log(response.data);
        }).catch(error=>{
          if (error.response && error.response.status === 409) {
            console.error("Error: Username already exists. Please choose another one.");
         Alert.alert ("Username already exists. Please choose another one.");
          } else {
            console.error("Error:", error.response ? error.response.data : error.message);
          }

        });
        // Handle successful registration
      // } catch (error) {
      //   console.error(error);
      // }
    }

    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={{marginHorizontal:20,marginVertical:20}}>
      <Text style={styles.helloText}>Create an Account</Text>
      </View>
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
        <MaterialIcon  name={"email"}
        style={styles.inputIcon}
        size={24}
        color={"#9A9A9A"}
        />
       <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      /> 
      </View>
      <View style={styles.inputContainer}>
        <Icon name={"lock"}
        style={styles.inputIcon}
        size={24}
        color={"#9A9A9A"}
        />
       <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      /> 
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
    <LinearGradient
      colors={["#D68073", "#C956A8"]}
      style={styles.gradient}
    >
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Register</Text>
        <Icon name="arrow-right" size={25} color="white" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  helloText:{
   textAlign:'center',
   fontSize:30,
   fontWeight:'condensedBold',
   color:'#262626'
  },
  signInText:{
    color:'#262626',
    textAlign:'center',
    fontSize:25
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
  inputIcon:{
  marginLeft:10
  },
  forgotPasswordText:{
    color:'#BEBEBE',
    textAlign:'right',
    width:'90%',
    fontSize:15,
  },
  signInContainer:{
   borderRadius:20,
   width:'90%',
  },
  linkText: {
    color: 'black',
    marginTop: 10,
    textDecorationLine: 'underline',
    textAlign:'center',
    fontSize:13,
  },
  button: {
    borderRadius: 5,
    overflow: 'hidden',
    alignSelf:'flex-end',
    marginVertical:15,
    marginHorizontal:25,
  },
  gradient: {
    borderRadius: 10,
    width:'30%',
  },
  buttonContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    marginRight: 10,
  },
});

export default RegisterScreen;
