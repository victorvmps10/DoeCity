import React, { useState, useContext, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../contexts/auth'
import firestore from '@react-native-firebase/firestore';

import Header from '../../components/Header'
import ListPosts from '../../components/ListPosts';

export default function Home() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingRefresh, setLoadingRefresh] = useState(false)
  const [lastItem, setLastItem] = useState('');
  const [emptyList, setEmptyList] = useState(false);


  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      function fetchPosts() {
        firestore().collection('posts')
          .orderBy('created', 'desc')
          .limit(5)
          .get()
          .then((snapshot) => {

            if (isActive) {
              setPosts([]);
              const postList = [];

              snapshot.docs.map(u => {
                postList.push({
                  ...u.data(),
                  id: u.id,
                })
              })

              setEmptyList(!!snapshot.empty)
              setPosts(postList);
              setLastItem(snapshot.docs[snapshot.docs.length - 1])
              setLoading(false);


            }

          })

      }

      fetchPosts();


      return () => {
        isActive = false;
      }

    }, [])
  )


  async function handleRefreshPosts() {
    setLoadingRefresh(true);

    firestore().collection('posts')
      .orderBy('created', 'desc')
      .limit(5)
      .get()
      .then((snapshot) => {

        setPosts([]);
        const postList = [];

        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.id,
          })
        })

        setEmptyList(false)
        setPosts(postList);
        setLastItem(snapshot.docs[snapshot.docs.length - 1])
        setLoading(false);

      })

    setLoadingRefresh(false);


  }


  async function getListPosts() {
    if (emptyList) {
      setLoading(false);
      return null;
    }

    if (loading) return;

    firestore().collection('posts')
      .orderBy('created', 'desc')
      .limit(5)
      .startAfter(lastItem)
      .get()
      .then((snapshot) => {
        const postList = [];

        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.id,
          })
        })

        setEmptyList(!!snapshot.empty)
        setLastItem(snapshot.docs[snapshot.docs.length - 1])
        setPosts(oldPosts => [...oldPosts, ...postList]);
        setLoading(false);

      })



  }

  return (
    <SafeAreaView style={style.container}>
      <Header name='list' />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={50} color="#00B2FF" />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={style.listPosts}
          data={posts}
          renderItem={({ item }) => (
            <ListPosts
              data={item}
              userId={user?.uid}
            />
          )}

          refreshing={loadingRefresh}
          onRefresh={handleRefreshPosts}

          onEndReached={() => getListPosts()}
          onEndReachedThreshold={0.1}

        />
      )}

      {user.typeUser == 'Donor' ? null :
        <TouchableOpacity
          style={style.buttonPost}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("NewPost")}
        >
          <Feather
            name="edit-2"
            color="#FFF"
            size={25}
          />
        </TouchableOpacity>
      }

    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#36393F'
  },
  buttonPost: {
    position: 'absolute',
    bottom: '2%',
    right: '6%',
    width: 60,
    height: 60,
    backgroundColor: '#202225',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
  listPosts: {
    flex: 1,
    backgroundColor: '#36393F'
  }

})