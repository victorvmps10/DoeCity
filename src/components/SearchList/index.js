import React from 'react';

import { useNavigation } from '@react-navigation/native'
import { Text, TouchableOpacity } from 'react-native';

export default function SearchList({ data }) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("PostsOng", { title: data.name, userId: data.id })}
            style={{ margin: 5, backgroundColor: '#222227', padding: 10, borderRadius: 4 }}
        >
            <Text style={{ color: '#FFF', fontSize: 17 }}>{data.name}</Text>
        </TouchableOpacity>
    )
}
