import {
  ActivityIndicator,
  Alert, Image, KeyboardAvoidingView, Modal, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../components/Header';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Account() {
  const isActive = useIsFocused();
  const navigation = useNavigation();
  const { signOut, user, setUser, storageUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name);
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState('');
  const [site, setSite] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  function openEdit() {
    setOpen(true)
  }
  function handleSignOut() {
    Alert.alert('Atenção', 'Quer mesmo sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          onPress: () => signOut()
        }
      ]
    )
  }
  function handlePagaments() {
    navigation.navigate('Pagaments')
  }
  async function updateProfile() {
    if (name === '') {
      return;
    }
    setLoading(true)
    if (user.typeUser === 'Donor') {
      await firestore().collection('users')
        .doc(user?.uid)
        .update({
          name: name
        })
    } else {
      await firestore().collection('ongs')
        .doc(user?.uid)
        .update({
          name: name,
          about: about,
          site: site
        })
    }
    const postDocs = await firestore().collection('posts')
      .where('userId', '==', user?.uid).get();
    postDocs.forEach(async doc => {
      await firestore().collection('posts').doc(doc.id)
        .update({
          autor: name
        })

    })
    const postImageDocs = await firestore().collection('postsPhotos')
      .where('userId', '==', user?.uid).get();
    postImageDocs.forEach(async doc => {
      await firestore().collection('postsPhotos').doc(doc.id)
        .update({
          autor: name
        })

    })
    if (user.typeUser === 'Ong') {
      let data = {
        uid: user.uid,
        name: name,
        email: user.email,
        about: about,
        site: site,
        typeUser: 'Ong'
      }
      setLoading(false)
      setUser(data);
      storageUser(data);
      setOpen(false);
      return;
    }
    let data = {
      uid: user.uid,
      name: name,
      email: user.email,
      about: about,
      site: site,
      typeUser: 'Donor'
    }
    setLoading(false)
    setUser(data);
    storageUser(data);
    setOpen(false);
  }


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
        uploadFileFirebase(response)
          .then(() => {
            uploadAvatarPosts();
          })

        console.log("URI DA FOTO ", response.assets[0].uri)
        setUrl(response.assets[0].uri)

      }
    })

  }

  const getFileLocalPath = (response) => {
    return response.assets[0].uri;
  }

  const uploadFileFirebase = async (response) => {
    const fileSource = getFileLocalPath(response);
    if (user.typeUser === 'Donor') {
      const storageRef = storage().ref('users').child(user?.uid);

      return await storageRef.putFile(fileSource)
    } else {
      const storageRef = storage().ref('ongs').child(user?.uid);

      return await storageRef.putFile(fileSource)
    }


  }


  const uploadAvatarPosts = async () => {
    if (user.typeUser === 'Donor') {
      const storageRef = storage().ref('users').child(user?.uid);
      const url = await storageRef.getDownloadURL()
        .then(async (image) => {
          const postDocs = await firestore().collection('posts')
            .where('userId', '==', user.uid).get();

          postDocs.forEach(async doc => {
            await firestore().collection('posts').doc(doc.id).update({
              avatarUrl: image
            })
          })

        })
        .catch((error) => {
          console.log("ERROR AO ATUALIZAR FOTO DOS POSTS ", error)
        })
    } else {
      const storageRef = storage().ref('ongs').child(user?.uid);
      const url = await storageRef.getDownloadURL()
        .then(async (image) => {
          const postDocs = await firestore().collection('posts')
            .where('userId', '==', user.uid).get();

          postDocs.forEach(async doc => {
            await firestore().collection('posts').doc(doc.id).update({
              avatarUrl: image
            })
            .catch((error) => {
              console.log("ERROR AO ATUALIZAR FOTO DOS POSTS ", error)
            })
          })
            
          const postPhotosDocs = await firestore().collection('postsPhotos')
            .where('userId', '==', user.uid).get();

            postPhotosDocs.forEach(async doc => {
            await firestore().collection('postsPhotos').doc(doc.id).update({
              avatarUrl: image
            })
            .catch((error) => {
              console.log("ERROR AO ATUALIZAR FOTO DOS POSTS ", error)
            })
          })
        })

    }
  }
  useEffect(() => {

    async function loadAvatar() {
      setLoadingData(true)
      try {
        if (user.typeUser === 'Donor') {
          let response = await storage().ref('users').child(user?.uid).getDownloadURL();
          setUrl(response);
          setLoadingData(false)
        } else {
          let response = await storage().ref('ongs').child(user?.uid).getDownloadURL();
          setUrl(response);
          setLoadingData(false)
        }
      } catch (err) {
        console.log("NAO ENCONTRAMOS NENHUMA FOTO")
        setLoadingData(false)
      }
    }

    loadAvatar();
    return () => loadAvatar();
  }, [isActive])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loadingData ? (
        <View style={[style.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator size={50} color="#00B2FF" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Header name='settings' press={openEdit} />
          <View style={style.container}>
            {url ? (
              <TouchableOpacity
                style={style.uploadButton}
                onPress={() => uploadFile()}>
                <Image
                  source={{ uri: url }}
                  style={style.avatar}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={style.uploadButton}
                onPress={() => uploadFile()}>
                <Text style={style.uploadText}>+</Text>
              </TouchableOpacity>
            )}

            <Text style={style.name}>{user?.name}</Text>
            <Text style={style.email}>{user?.email}</Text>
            <TouchableOpacity style={[{ backgroundColor: "#51C880" }, style.button]} onPress={handlePagaments}>
              <Text style={[{ color: "#FFF" }, style.buttonText]}>Financeiro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[{ backgroundColor: "#F64B57" }, style.button]} onPress={handleSignOut}>
              <Text style={[{ color: "#FFF" }, style.buttonText]}>Sair</Text>
            </TouchableOpacity>

            <Modal visible={open} animationType="fade" transparent={true}>
              <View style={style.modalContainer}>
                <TouchableWithoutFeedback onPress={() => setOpen(false)}>
                  <View style={style.modal}></View>
                </TouchableWithoutFeedback>
                <KeyboardAvoidingView
                  style={style.modalContent}
                  behavior={Platform.OS === 'android' ? '' : 'padding'}>
                  <TouchableOpacity
                    style={style.buttonBack}
                    onPress={() => setOpen(false)}>
                    <Feather
                      name="arrow-left"
                      size={22}
                      color="#000"
                    />
                    <Text style={{ color: '#000' }}>Voltar</Text>
                  </TouchableOpacity>

                  <TextInput
                    placeholder={user?.name}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={style.input}
                    placeholderTextColor='#000'
                  />
                  {user?.typeUser === 'Ong' && (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                      <TextInput
                        placeholder={user?.about || 'Digite sobre a ONG'}
                        value={about}
                        onChangeText={(text) => setAbout(text)}
                        style={style.input}
                        placeholderTextColor='#000'
                      />
                      <TextInput
                        placeholder={user?.site || 'Digite o site da ONG'}
                        value={site}
                        onChangeText={(text) => setSite(text)}
                        style={style.input}
                        placeholderTextColor='#000'
                      />
                    </View>
                  )}
                  <TouchableOpacity style={[{ backgroundColor: "#428cfd" }, style.button]} onPress={updateProfile}>
                    {loading ? (
                      <ActivityIndicator color='#FFF' size={20} />
                    ) : (
                      <Text style={[{ color: "#fff" }, style.buttonText]}>Salvar</Text>
                    )}
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </View>
            </Modal>

          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#353840'
  },
  name: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  email: {
    color: '#FFF',
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    fontSize: 18,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 16,
    width: '80%',
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18
  },
  uploadButton: {
    marginTop: '20%',
    backgroundColor: '#FFF',
    width: 165,
    height: 165,
    borderRadius: 90,
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
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
  input: {
    backgroundColor: '#DDD',
    width: '90%',
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)'
  },
  modal: {
    flex: 1,
  },
})