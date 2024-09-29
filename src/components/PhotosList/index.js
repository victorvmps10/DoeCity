import React, { useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Image, Linking, Modal, SafeAreaView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
export default function PhotosList({ data, userId }) {
  const navigation = useNavigation();
  const [likePost, setLikePost] = useState(data?.likes);
  const [open, setOpen] = useState(false);
  const [URL, setURL] = useState('');
  const [likeActive, setLikeActive] = useState(true);
  const isActive = useIsFocused();
  async function handleLikePost(id, likes) {

    const docId = `${userId}_${id}`;
    const doc = await firestore().collection('likes')
      .doc(docId).get();
    if (doc.exists) {
      await firestore().collection('postsPhotos')
        .doc(id).update({
          likes: likes - 1
        })

      await firestore().collection('likes').doc(docId)
        .delete()
        .then(() => {
          setLikePost(likes - 1)
          setLikeActive(false)
        })

      return;

    }


    await firestore().collection('likes')
      .doc(docId).set({
        postId: id,
        userId: userId
      })

    await firestore().collection('postsPhotos')
      .doc(id).update({
        likes: likes + 1
      })
      .then(() => {
        setLikePost(likes + 1)
        setLikeActive(true)
      })


  }

  function formatTimePost() {
    const datePost = new Date(data.created.seconds * 1000);

    return formatDistance(
      new Date(),
      datePost,
      {
        locale: ptBR
      }
    )
  }

  useEffect(() => {
    async function loadAvatar() {
      setURL(data.site);
      const docId = `${userId}_${data.id}`;
      const doc = await firestore().collection('likes')
        .doc(docId).get();

      if (!doc.exists) {
        setLikeActive(false)
      }
    }
    loadAvatar();
    return () => loadAvatar();
  }, [isActive])
  return (
    <SafeAreaView style={style.container}>
      <TouchableOpacity
        style={style.header}
        onPress={() => setOpen(true)}>
        {data.avatarUrl ? (
          <Image
            source={{ uri: data.avatarUrl }}
            style={style.avatar}
          />
        ) : (
          <Image
            source={require('../../assets/avatar.png')}
            style={style.avatar}
          />
        )}
        <Text numberOfLines={1} style={style.name}>
          {data?.autor}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View style={style.actions}>
          <View style={style.content}>
            <Text style={{ color: '#121212', maxWidth: '65%' }} numberOfLines={4} >{data?.content}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleLikePost(data.id, likePost)}
            style={style.likeButton}>
            <Text style={{ color: '#121212' }}>
              {likePost === 0 ? '' : likePost}
            </Text>
            <MaterialCommunityIcons
              name={likeActive ? 'cards-heart' : 'heart-plus-outline'}
              size={20}
              color="#E52246"
            />
          </TouchableOpacity>

          <Text style={style.timePost}>
            {formatTimePost()}
          </Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={{ uri: data.photo }}
            style={style.photo}
          />
        </View>
      </View>
      <Modal visible={open} animationType="slide" transparent={true}>
        <View style={style.modalContainer}>
          <TouchableOpacity
            style={style.buttonBack}
            onPress={() => setOpen(false)}>
            <Feather
              name="arrow-left"
              size={22}
              color='#000'
            />
            <Text style={{ color: '#000' }}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ backgroundColor: "#428cfd" }, style.buttonModal]}
            onPress={() => {
              setOpen(false)
              navigation.navigate("PostsOng", { title: data.autor, userId: data.userId })
            }}>
            <Text style={[{ color: "#fff" }, style.buttonTextModal]}>POSTS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ backgroundColor: "#F64B57" }, style.buttonModal]}
            onPress={() => {
              setOpen(false)
              Linking.openURL(`http:${URL}`)
            }
            }>
            <Text style={[{ color: "#fff" }, style.buttonTextModal]}>SITE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ backgroundColor: "#51C880" }, style.buttonModal]}
            onPress={() => {
              setOpen(false)
              navigation.navigate('Donate', { title: data.autor, userId: data.userId })
            }}>
            <Text style={[{ color: "#fff" }, style.buttonTextModal]}>DOAR</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    marginTop: 8,
    margin: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 3,
    padding: 11,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    color: '#000'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 6,
  },
  content: {
    margin: 4,
    marginBottom: 20
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  timePost: {
    marginTop: 10,
    color: '#000',
  },
  likeButton: {
    width: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  like: {
    color: '#E52246',
    marginRight: 6,
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
  photo: {
    width: 125,
    height: 125,
    borderRadius: 5,
    marginLeft: 5
  }
})
