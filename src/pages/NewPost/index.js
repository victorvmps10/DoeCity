import React, { useState, useLayoutEffect, useContext } from 'react';

import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../contexts/auth';
import {
  ActivityIndicator, Modal, SafeAreaView, Image,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
  TouchableWithoutFeedback
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
export default function NewPost() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState("");
  const [ongData, setOngData] = useState({});
  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(null);
  function photoType() {
    setType(true);
    setOpen(false)
  }
  function textType() {
    setType(false);
    setOpen(false)
  }
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

  }, [navigation, post, type, url])

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
  const uploadFile = () => {
    const options = {
      noData: true,
      mediaType: 'photo'
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return
      } else if (response.error) {
        return
      } else {
        console.log("URI DA FOTO ", response.assets[0].uri)
        setUrl(response.assets[0].uri)
      }
    })
  }
  async function handlePost() {
    setLoading(true)
    let avatarUrl = null;

    try {
      let response = await storage().ref('ongs').child(user?.uid).getDownloadURL();
      avatarUrl = response;
    } catch (err) {
      avatarUrl = null;
    }
    if (type) {
      if (!url) {
        console.log("Sua foto contém conteúdo inválido.");
        setLoading(false)
        return;
      }

      const generateRandomCode = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      };

      const code = generateRandomCode(15);

      const uploadFileFirebase = async () => {
        try {
          const storageRef = storage().ref('postsPhotos').child(`${user?.uid}_${code}`);
          let response = await storageRef.putFile(url);
          const downloadURL = await storageRef.getDownloadURL();
          return downloadURL;
        } catch (error) {
          console.error('Error uploading file to Firebase:', error);
        }
      };

      try {
        const photoUrl = await uploadFileFirebase();
        await firestore().collection('postsPhotos')
          .add({
            created: new Date(),
            autor: user?.name,
            userId: user?.uid,
            likes: 0,
            avatarUrl: avatarUrl,
            location: ongData.location,
            site: ongData.site,
            photo: photoUrl,
            content: post
          })
          .then(() => {
            setPost('');
            console.log(ongData.location);
            console.log(ongData.site);

          })
          .catch((error) => {
            console.log("Erro ao criar o post com foto", error);
          });
        setLoading(false)
        navigation.goBack();
      } catch (error) {
        console.error("Error handling the post with photo", error);
      }

      return;
    }
    if (!post && !type) {
      console.log(type)
      console.log("Seu post contém conteúdo inválido.");
      setLoading(false)
      return;
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
        setPost('');
      })
      .catch((error) => {
        console.log("Erro ao criar o post", error);
      });
    setLoading(false)
    navigation.goBack();
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#404349' }}>
        <ActivityIndicator size={50} color="#00B2FF" />
      </View>
    )
  }
  if (type) {
    return (
      <SafeAreaView
        style={[style.container, { alignItems: 'center' }]}
      >
        {url ? (
          <TouchableOpacity
            style={style.uploadButton}
            onPress={() => uploadFile()}>
            <Image
              source={{ uri: url }}
              style={style.photo}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={style.uploadButton}
            onPress={() => uploadFile()}>
            <Text style={style.uploadText}>+</Text>
          </TouchableOpacity>
        )}
        <TextInput
          placeholder="O que está acontecendo?"
          value={post}
          onChangeText={(text) => setPost(text)}
          autoCorrect={false}
          multiline={true}
          placeholderTextColor="#DDD"
          maxLength={300}
          style={[style.input, { marginTop: 5 }]}
        />
      </SafeAreaView>
    )
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
      <Modal visible={open} animationType="fade" transparent={true}>
        <View style={style.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={style.modal}></View>
          </TouchableWithoutFeedback>
          <View style={style.modalContent}>
            <TouchableOpacity
              style={style.buttonBack}
              onPress={() => setOpen(false)}>
              <Feather
                name="x"
                size={22}
                color='#000'
              />
              <Text style={{ color: '#000' }}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[{ backgroundColor: "#428cfd" }, style.buttonModal]}
              onPress={textType}>
              <Text style={[{ color: "#fff" }, style.buttonTextModal]}>POST DE TEXTO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[{ backgroundColor: "#428cfd" }, style.buttonModal]}
              onPress={photoType}>
              <Text style={[{ color: "#fff" }, style.buttonTextModal]}>POST COM FOTO</Text>
            </TouchableOpacity>
          </View>
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
  modalContent: {
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
  uploadButton: {
    marginTop: '20%',
    backgroundColor: '#FFF',
    width: 165,
    height: 165,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 8,
  },
  uploadText: {
    fontSize: 55,
    position: 'absolute',
    color: '#428cfd',
    opacity: 0.5,
    zIndex: 99,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)'
  },
  modal: {
    flex: 1,
  },
})