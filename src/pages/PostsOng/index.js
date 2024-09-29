import React, { useLayoutEffect, useState, useCallback, useContext } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth'

import firestore from '@react-native-firebase/firestore';

import PostsList from '../../components/PostsList';
import PhotosList from '../../components/PhotosList';

export default function PostsOng() {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [photosOng, setPhotosOng] = useState(false);
    const [financeOng, setFinanceOng] = useState(false);
    const [title, setTitle] = useState(route.params?.title);
    const [posts, setPosts] = useState([]);
    const [postsPhotos, setPostsPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: title === '' ? '' : title,
            headerRight: () => (
                user.typeUser === 'Donor' ?
                    <TouchableOpacity
                        style={style.button}
                        onPress={() => navigation.navigate('Donate', { title: title, userId: route.params?.userId })}>
                        <Text style={{ color: '#fff' }}>Doar</Text>
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
            firestore()
                .collection('postsPhotos')
                .where('userId', '==', route.params?.userId)
                .orderBy('created', 'desc')
                .get()
                .then((snapshot) => {
                    const postPhotoList = [];

                    snapshot.docs.map(u => {
                        postPhotoList.push({
                            ...u.data(),
                            id: u.id
                        })
                    })

                    if (isActive) {
                        setPostsPhotos(postPhotoList);
                        setLoading(false);
                    }

                })

            return () => {
                isActive = false;
            }
        }, [])
    )
    if (financeOng) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#36393F' }}>
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={50} color="#00B2FF" />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={style.containerType}>
                            <TouchableOpacity
                                style={[style.typeButton]}
                                onPress={() => { setPhotosOng(false); setFinanceOng(false) }}
                            >
                                <Text style={style.typeText}>Posts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.typeButton]}
                                onPress={() => { setPhotosOng(true); setFinanceOng(false) }}>
                                <Text style={style.typeText}>Fotos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.typeButton, { backgroundColor: '#51C880' }]}
                                onPress={() => { setPhotosOng(false); setFinanceOng(true) }}
                            >
                                <Text style={style.typeText}>Relatorio</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            style={{ flex: 1, backgroundColor: '#36393F' }}
                            showsVerticalScrollIndicator={false}
                            data={postsPhotos}
                            renderItem={({ item }) => <ListPosts data={item} userId={user.uid} />}
                        />
                    </View>

                )}
            </SafeAreaView>
        )
    }
    if (photosOng) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#36393F' }}>
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={50} color="#00B2FF" />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={style.containerType}>
                            <TouchableOpacity
                                style={[style.typeButton]}
                                onPress={() => { setPhotosOng(false); setFinanceOng(false) }}
                            >
                                <Text style={style.typeText}>Posts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.typeButton, { backgroundColor: '#51C880' }]}
                                onPress={() => { setPhotosOng(true); setFinanceOng(false) }}>
                                <Text style={style.typeText}>Fotos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.typeButton]}
                                onPress={() => { setPhotosOng(false); setFinanceOng(true) }}
                            >
                                <Text style={style.typeText}>Relatorio</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            style={{ flex: 1, backgroundColor: '#36393F' }}
                            showsVerticalScrollIndicator={false}
                            data={postsPhotos}
                            renderItem={({ item }) => <PhotosList data={item} userId={user.uid} />}
                        />
                    </View>

                )}
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#36393F' }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={50} color="#00B2FF" />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={style.containerType}>
                        <TouchableOpacity
                            style={[style.typeButton, { backgroundColor: '#51C880' }]}
                            onPress={() => { setPhotosOng(false); setFinanceOng(false) }}
                        >
                            <Text style={style.typeText}>Posts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[style.typeButton]}
                            onPress={() => { setPhotosOng(true); setFinanceOng(false) }}>
                            <Text style={style.typeText}>Fotos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[style.typeButton]}
                            onPress={() => { setPhotosOng(false); setFinanceOng(true) }}
                        >
                            <Text style={style.typeText}>Relatorio</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ flex: 1, backgroundColor: '#36393F' }}
                        showsVerticalScrollIndicator={false}
                        data={posts}
                        renderItem={({ item }) => <PostsList data={item} userId={user.uid} />}
                    />
                </View>

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
    },
    typeButton: {
        justifyContent: 'center',
        margin: 5,
        alignItems: 'center',
        borderRadius: 15,
        padding: 5,
        width: '30%'
    },
    typeText: {
        fontSize: 15,
        color: '#Fff',
    },
    containerType: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})