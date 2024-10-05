import React, { useContext } from 'react';
import {View, ActivityIndicator, Text} from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { useNetInfo } from "@react-native-community/netinfo";


import { AuthContext } from '../contexts/auth'

export default function Routes(){
  const { signed, loading } = useContext(AuthContext);
  const { type, isConnected } = useNetInfo();

  if(!isConnected){
    return(
      <View 
      style={{
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#36393F'
      }}>
        <ActivityIndicator size={50} color="#00B2FF" />
        <Text style={{color: '#00B2FF'}}>Sem internet</Text>
      </View>
    )
  }
  if(loading){
    return(
      <View 
      style={{
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#36393F'
      }}>
        <ActivityIndicator size={50} color="#00B2FF" />
      </View>
    )
  }
  
  return(
    signed ? <AppRoutes/> : <AuthRoutes/>
  )
}