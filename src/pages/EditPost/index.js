import React, { useState, useLayoutEffect, useContext } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native'
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
export default function EditPost() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState("");
  const [ongData, setOngData] = useState({});
  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(null);

  useLayoutEffect(() => {
    const options = navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={style.button}
          onPress={() => handlePost()}>
          <Text style={{ color: '#fff' }}>Editar</Text>
        </TouchableOpacity>
      )
    })

  }, [navigation, post, type, url])

  useLayoutEffect(() => {
    setType(route.params?.type)
    console.log(user)
    setLoading(true)
    setPost(route.params?.data.content)
    async function getData() {
      try {
        const response = await firestore().collection('postsPhotos').doc(route.params?.data.id).get();
        let urlResponse = {
          url: response.data().photo,
        }
        setUrl(urlResponse.url)
        setLoading(false)
      } catch (error) {
        
      }
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

      const uploadFileFirebase = async () => {
        try {
          const storageRef = storage().ref('postsPhotos').child(route.params?.data.photo);
          let response = await storageRef.putFile(url);
          const downloadURL = await storageRef.getDownloadURL();
          return downloadURL;
        } catch (error) {
          console.error('Error uploading file to Firebase:', error);
        }
      };

      try {
        const photoUrl = await uploadFileFirebase();
        console.log(route.params?.data.id)
        await firestore().collection('postsPhotos').doc(route.params?.data.id)
          .update({
            autor: user?.name,
            userId: user?.uid,
            avatarUrl: avatarUrl,
            photo: photoUrl,
            content: post,
          })
          .then(() => {
            setPost('');
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

    await firestore().collection('posts').doc(route.params?.data.id)
      .update({
        content: post,
        autor: user?.name,
        userId: user?.uid,
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
          placeholder={route.params?.data.content}
          value={post}
          onChangeText={(text) => setPost(text)}
          autoCorrect={false}
          multiline={true}
          placeholderTextColor="#DDD"
          maxLength={50}
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
        maxLength={50}
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
})