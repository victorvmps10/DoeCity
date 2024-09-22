import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { useNavigation } from '@react-navigation/native'

import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function PostsList({ data, userId }) {
  const navigation = useNavigation();
  const [likePost, setLikePost] = useState(data?.likes)

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


  return (
    <SafeAreaView style={style.container}>
      <TouchableOpacity 
      style={style.header}
      onPress={() => navigation.navigate("PostsOng", { title: data.autor, userId: data.userId })}>
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

      <View style={style.content}>
        <Text style={{color: '#121212'}}>{data?.content}</Text>
      </View>

      <View style={style.actions}>
        <TouchableOpacity 
        onPress={() => handleLikePost(data.id, likePost)}
        style={style.likeButton}>
          <Text style={{color: '#121212'}}>
            {likePost === 0 ? '' : likePost}
          </Text>
          <MaterialCommunityIcons
            name={likePost === 0 ? 'heart-plus-outline' : 'cards-heart'}
            size={20}
            color="#E52246"
          />
        </TouchableOpacity>

        <Text style={style.timePost}>
          {formatTimePost()}
        </Text>
      </View>


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
  }
})
