import React, { useState, useLayoutEffect, useContext } from 'react';

import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../contexts/auth';
import { ActivityIndicator, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewPost() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState("");
  const [ongData, setOngData] = useState({});
  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(true);
  useLayoutEffect(() => {

    const options = navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={style.button}
          onPress={() => handlePost()}>
          <Text style={{ color: '#fff' }}>Compartilhar</Text>
        </TouchableOpacity>
      )
    })

  }, [navigation, post])
  useLayoutEffect(() => {
    console.log(user)
    setLoading(true)
    setOpen(true)
    async function getData() {
      const ongProfile = await firestore().collection('ongs')
        .doc(user?.uid).get();
      let data = {
        site: ongProfile.data().site,
        location: ongProfile.data().location,
      };

      setOngData(data)
      setLoading(false)
    }
    getData()
  }, [navigation])

  async function handlePost() {
    if (post === '') {
      console.log("Seu post contem conteudo invalido.");
      return;
    }

    let avatarUrl = null;

    try {
      let response = await storage().ref('ongs').child(user?.uid).getDownloadURL();
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
        location: ongData.location,
        site: ongData.site
      })
      .then(() => {
        setPost('')
        console.log(ongData.location)
        console.log(ongData.site)
      })
      .catch((error) => {
        console.log("ERRO AO CRIAR O POST ", error)
      })

    navigation.goBack();

  }
  if (loading) {
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={50} color="#00B2FF" />
    </View>
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
      <Modal visible={open} animationType="slide" transparent={true}>
        <View style={style.modalContainer}>
          <TouchableOpacity
            style={style.buttonBack}
            onPress={() => navigation.goBack()}>
            <Feather
              name="arrow-left"
              size={22}
              color='#000'
            />
            <Text style={{ color: '#000' }}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ backgroundColor: "#428cfd" }, style.buttonModal]}
            onPress={() => { setType(true); setOpen(false) }}>
            <Text style={[{ color: "#fff" }, style.buttonTextModal]}>POST DE TEXTO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ backgroundColor: "#428cfd" }, style.buttonModal]}
            onPress={() => { setType(true); setOpen(false) }}>
            <Text style={[{ color: "#fff" }, style.buttonTextModal]}>POST COM FOTO</Text>
          </TouchableOpacity>
        </View>

      </Modal>
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
  },
  buttonModal: {
    marginTop: 16,
    width: '80%',
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextModal: {
    fontSize: 18
  },
  modalContainer: {
    width: '100%',
    height: '50%',
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  buttonBack: {
    position: 'absolute',
    top: 15,
    left: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
})