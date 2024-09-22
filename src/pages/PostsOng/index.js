import React, { useLayoutEffect, useState, useCallback, useContext } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth'

import firestore from '@react-native-firebase/firestore';

import ListPosts from '../../components/ListPosts';

export default function PostsOng() {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const [title, setTitle] = useState(route.params?.title);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: title === '' ? '' : title,
            headerRight: () => (
                user.typeUser === 'Donor' ? 
                <TouchableOpacity
                style={style.button}
                onPress={() =>navigation.navigate('Donate', { title: title, userId: route.params?.userId })}>
                  <Text style={{color: '#fff'}}>Doar</Text>
                </TouchableOpacity>
                : null
              )
        })
    }, [navigation, title])

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            firestore()
                .collection('posts')
                .where('userId', '==', route.params?.userId)
                .orderBy('created', 'desc')
                .get()
                .then((snapshot) => {
                    const postList = [];

                    snapshot.docs.map(u => {
                        postList.push({
                            ...u.data(),
                            id: u.id
                        })
                    })

                    if (isActive) {
                        setPosts(postList);
                        setLoading(false);
                    }

                })


            return () => {
                isActive = false;
            }
        }, [])
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#36393F' }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={50} color="#00B2FF" />
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1, backgroundColor: '#36393F' }}
                    showsVerticalScrollIndicator={false}
                    data={posts}
                    renderItem={({ item }) => <ListPosts data={item} userId={user.uid} />}
                />
            )}
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    button: {
      marginRight: 7,
      padding: 5,
      backgroundColor: '#418cfd',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center'
    }
  })