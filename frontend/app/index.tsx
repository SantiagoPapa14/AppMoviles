import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './(mainTabs)/createTab'; // Ensure this path is correct
import LoginScreen from './login'; // Ensure this path is correct
import RegisterScreen from './register'; // Ensure this path is correct
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from 'expo-router';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
      } catch (e) {
      console.error('Failed to load user token', e);
      } finally {
      setIsLoading(false);
      }
    };
    checkLoginStatus();
    setTimeout(async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userLoggedIn = !!userToken;
      setIsLoggedIn(userLoggedIn);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return isLoggedIn ? <Redirect href='/homeTab' /> :  <Redirect href='/login'/> 
};

export default App;
  
