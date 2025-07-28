import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
const SplashScreen=({navigation})=>{
    useEffect(()=>{
     setTimeout(()=>{
      navigation.replace('Login');
     },2000)
    },[navigation]);
    return(
        <View>
            <Text>Loading...</Text>
        </View>
    )
};
export default SplashScreen;