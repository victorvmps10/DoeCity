import React, { useContext, useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { Alert, Image, Linking, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { AuthContext } from '../../contexts/auth';
export default function PostsList({ data, userId }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [likePost, setLikePost] = useState(data?.likes);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [owner, setOwner] = useState(false);
  const [open, setOpen] = useState(false);
  const [URL, setURL] = useState('');
  const [likeActive, setLikeActive] = useState(true);
  const isActive = useIsFocused();
  function EditPost() {
    if (data?.userId === user?.uid) {
      setEditPostOpen(true)
    }
  }
  async function deletePost() {
    Alert.alert('Atenção', 'Quer mesmo deletar o post?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          onPress: async () => await confirmDeletePost()
        }
      ]
    )

  }
  async function confirmDeletePost() {
    await firestore().collection('posts').doc(data?.id).delete()
      .then(async () => {
        Alert.alert('Aviso', 'Seu post foi deletado, de um refresh na tela')
        navigation.navigate('Account')
      })
  }
  async function handleLikePost(id, likes) {

    const docId = `${userId}_${id}`;
    const doc = await firestore().collection('likes')
      .doc(docId).get();
    if (doc.exists) {
      await firestore().collection('posts')
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

    await firestore().collection('posts')
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
      if(user?.uid === data.userId){
        setOwner(true)
      }
      const docId = `${userId}_${data.id}`;
      try {
        const uid = userId;
        const response = await firestore().collection('ongs').doc(uid).get();
        let urlResponse = {
          url: response.data().site,
        }
        setURL(urlResponse.url)
      } catch (error) {

      }
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={style.header}
          onPress={() => setOpen(true)}
          onLongPress={() => EditPost()}
        >
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
        {owner && (
          <TouchableOpacity 
          onPress={()=> EditPost()}
          style={{marginTop: 5}}
          >
          <Entypo
            name='dots-three-horizontal'
            size={20}
            color="#121212"
          />
        </TouchableOpacity>
        )}
      </View>
      <View style={style.content}>
        <Text style={{ color: '#121212' }}>{data?.content}</Text>
      </View>

      <View style={style.actions}>
        <View style={{ flexDirection: 'row' }}>
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
        </View>
        <Text style={style.timePost}>
          {formatTimePost()}
        </Text>
      </View>

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
        </View>
      </Modal>
      <Modal visible={editPostOpen} animationType="fade" transparent={true}>
        <View style={style.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setEditPostOpen(false)}>
            <View style={style.modal}></View>
          </TouchableWithoutFeedback>
          <View style={style.modalContent}>
            <TouchableOpacity
              style={style.buttonBack}
              onPress={() => setEditPostOpen(false)}>
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
                setEditPostOpen(false)
                navigation.navigate("EditPost", { title: data.autor, data: data })
              }}>
              <Text style={[{ color: "#fff" }, style.buttonTextModal]}>EDITAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[{ backgroundColor: "#F64B57" }, style.buttonModal]}
              onPress={async () => {
                setEditPostOpen(false)
                await deletePost()
              }
              }>
              <Text style={[{ color: "#fff" }, style.buttonTextModal]}>DELETAR</Text>
            </TouchableOpacity>
          </View>
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
    width: '95%',
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
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  timePost: {
    color: '#000'
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)'
  },
  modal: {
    flex: 1,
  },
})
