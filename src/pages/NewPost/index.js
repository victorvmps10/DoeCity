import React, { useState, useLayoutEffect, useContext } from 'react';

import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { AuthContext } from '../../contexts/auth';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function NewPost() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState("");

  useLayoutEffect(() => {

    const options = navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
        style={style.button}
        onPress={() => handlePost()}>
          <Text style={{color: '#fff'}}>Compartilhar</Text>
        </TouchableOpacity>
      )
    })

  }, [navigation, post])

  async function handlePost() {
    if (post === '') {
      console.log("Seu post contem conteudo invalido.");
      return;
    }

    let avatarUrl = null;

    try {
      let response = await storage().ref('users').child(user?.uid).getDownloadURL();
      avatarUrl = response;

    } catch (err) {
      avatarUrl = null;
    }

    await firestore().collection('posts')
      .add({
        created: new Date(),
        content: post,
        autor: user?.name,
        userId: user?.uid,
        likes: 0,
        avatarUrl: avatarUrl,
      })
      .then(() => {
        setPost('')
        console.log("POST CRIADO COM SUCESSO")
      })
      .catch((error) => {
        console.log("ERRO AO CRIAR O POST ", error)
      })

    navigation.goBack();

  }

  return (
    <SafeAreaView
    style={style.container}
    >
      <TextInput
        placeholder="O que está acontecendo?"
        value={post}
        onChangeText={(text) => setPost(text)}
        autoCorrect={false}
        multiline={true}
        placeholderTextColor="#DDD"
        maxLength={300}
        style={style.input}
      />
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404349',
  },
  input: {
    backgroundColor: 'transparent',
    margin: 10,
    color: '#FFF',
    fontSize: 20,
  },
  button: {
    marginRight: 7,
    padding: 5,
    backgroundColor: '#418cfd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
})