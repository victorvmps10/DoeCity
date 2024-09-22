import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TextInput } from 'react-native';

import firestore from '@react-native-firebase/firestore';

import Feather from 'react-native-vector-icons/Feather'

import SearchList from '../../components/SearchList';

export default function Search() {
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (input === '' || input === undefined) {
            setUsers([]);
            return;
        }

        const subscriber = firestore().collection('ongs')
            .where('name', '>=', input)
            .where('name', '<=', input + "\uf8ff")
            .onSnapshot(snapshot => {
                const listUsers = [];

                snapshot.forEach(doc => {
                    listUsers.push({
                        ...doc.data(),
                        id: doc.id,
                    })
                })

                setUsers(listUsers);


            })


        return () => subscriber();

    }, [input])

    return (
        <SafeAreaView style={style.container}>
            <View style={style.areaInput}>
                <Feather
                    name="search"
                    size={20}
                    color="#E52246"
                />
                <TextInput
                style={style.input}
                    placeholder="Procurando alguma ONG especifica?"
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholderTextColor="#353840"
                />
            </View>

            <FlatList
                data={users}
                renderItem={({ item }) => <SearchList data={item} />}
            />

        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        paddingTop: 14,
        flex: 1,
        backgroundColor: '#353840'
    },
    areaInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1f1f1',
        margin: 10,
        borderRadius: 4,
        padding: 5,
    },
    input: {
        width: '90%',
        backgroundColor: '#F1f1f1',
        height: 40,
        paddingLeft: 8,
        fontSize: 17,
        color: '#121212'
    }
})