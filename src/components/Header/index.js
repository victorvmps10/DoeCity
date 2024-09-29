import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
export default function Header({name, press}) {
    return (
        <View style={style.container}>
            <Text style={[style.title, { color: '#FFF' }]}>Doe<Text style={{ color: '#00B2FF' }}>City</Text></Text>
            
            <TouchableOpacity 
            style={style.button}
            onPress={press}
            >
                <Feather name={name} size={30} color='#D9D9D9'/>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        backgroundColor: '#2E2E2E',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 25,
    },
    button:{
        position: 'absolute',
        right: 10,
    }
})