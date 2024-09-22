import {
    SafeAreaView, View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState, useContext, useReducer, useCallback } from 'react';
import { AuthContext } from '../../contexts/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
export default function Donate() {
    const route = useRoute();
    const isActive = useIsFocused();
    const [title, setTitle] = useState(route.params?.title);
    const [value, setValue] = useState('0');
    const [valueAdd, setValueAdd] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [verification, setVerification] = useState(false);
    const [type, setType] = useState(false);
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    useEffect(() => {
        navigation.setOptions({
            title: title === '' ? '' : `Doar para ${title}`,
        })
    }, [navigation, title])
    useEffect(() => {
        setLoading(true);
        async function getData() {
            try {
                const userProfile = await firestore().collection('users').doc(user.uid).get();

                if (!userProfile.exists) {
                    await getDataOng();
                } else {
                    const userData = userProfile.data();
                    setName(userData.name);
                    setValue(userData.balance);
                    setLocation(userData.city);
                    setType(false);
                }
            } catch (error) {
                console.error("Usuario sem internet ctz: ", error);
            } finally {
                setLoading(false);
            }
        }
        async function getDataOng() {
            try {
                const ongProfile = await firestore().collection('ongs').doc(user.uid).get();
                const ongData = ongProfile.data();

                if (ongData) {
                    setName(ongData.name);
                    setValue(ongData.balance);
                    setLocation(ongData.city);
                    setType(true);
                }
            } catch (error) {
                console.log("Usuario tá de hack: ", error);
            }
        }

        getData();
    }, [isActive])
    async function handleAdd(number) {
        const newValue = value - number;
        if (newValue < 0) {
            Alert.alert('Atenção', 'Saldo insuficiente');
            return;
        }
        setValue(newValue)
        await updateData(newValue, number)
    }
    async function updateData(newValue, number) {
        try {
            const userProfile = await firestore().collection('users').doc(user.uid).get()
            if(userProfile.exists){
                const currentProgress = userProfile.data().progress || 0; 
                const newProgress = currentProgress + (number * 5);
                await firestore().collection('users').doc(user.uid).update({
                    balance: newValue,
                    progress: newProgress
                })
            
            } 
        } catch (error) {
            console.log('Certeza que desconectou a internet')
        }

    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#353840' }}>
            {loading ?
                <View style={{ flex: 1 }}>
                    <View style={style.containerLoading}>
                        <ActivityIndicator size={80} color="#428cfd" />
                    </View>
                </View>
                :
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={style.text}>Seu Nome: {name}</Text>
                        <Text style={style.text}> Sua Localidade: {location}</Text>
                        <Text style={style.text}>
                            Seu saldo: R${value}
                        </Text>
                    </View>
                    {user.typeUser === 'Donor' ? (
                        <View>
                            <Text style={style.textAdd}>Adicionar Valor para doar:</Text>
                            <View style={style.containerAdd}>
                                <TextInput
                                    style={style.input}
                                    textContentType='number'
                                    keyboardType='number-pad'
                                    placeholder="Adicionar saldo"
                                    value={valueAdd}
                                    onChangeText={(text) => setValueAdd(text)}
                                    placeholderTextColor="#000"
                                />
                                <TouchableOpacity
                                    onPress={() => handleAdd(valueAdd)}
                                >
                                    <Ionicons name="send-sharp" size={40} color="black" />
                                </TouchableOpacity>
                            </View>
                            <Text style={style.textAdd}>Adicionar Valor Rápido:</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(1)}
                                >
                                    <Text style={style.textButtonAdd}>R$1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(2)}
                                >
                                    <Text style={style.textButtonAdd}>R$2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(5)}
                                >
                                    <Text style={style.textButtonAdd}>R$5</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(10)}
                                >
                                    <Text style={style.textButtonAdd}>R$10</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(20)}
                                >
                                    <Text style={style.textButtonAdd}>R$20</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(50)}
                                >
                                    <Text style={style.textButtonAdd}>R$50</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(100)}
                                >
                                    <Text style={style.textButtonAdd}>R$100</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(200)}
                                >
                                    <Text style={style.textButtonAdd}>R$200</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.containerButtonAdd}
                                    onPress={() => handleAdd(500)}
                                >
                                    <Text style={style.textButtonAdd}>R$500</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text style={style.textAdd}>ONGs não podem doar para outras ONGs</Text>
                        </View>
                    )}

                    <View style={{ position: 'absolute', bottom: 5, alignItems: 'center', marginHorizontal: 5 }}>
                        <Text style={style.textAlert}>
                            Obs: O sistema de pagamento do aplicativo é conceitual,
                            por conta das normas da Play Store/Apple Store e por
                            questões de segurança, pois é só a ideia de como seria.
                        </Text>
                    </View>
                </SafeAreaView>
            }
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    containerAdd: {
        width: '95%',
        color: "#000",
        borderWidth: 2,
        flexDirection: 'row',
        margin: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#D9D9D9',
    },
    textHeader: {
        color: 'black',
        fontSize: 40,
        marginLeft: 10
    },
    text: {
        fontSize: 20,
        color: '#fff',
        margin: 5,
        textAlign: 'center'
    },
    containerButtonAdd: {
        backgroundColor: '#00f',
        borderRadius: 10,
        margin: 10,
        padding: 5
    },
    textButtonAdd: {
        color: '#fff',
        fontSize: 15,
    },
    textAdd: {
        fontSize: 20,
        color: '#fff',
        margin: 5,
        marginLeft: 15
    },
    textAlert: {
        fontSize: 15,
        color: '#fff',
        margin: 5,
        textAlign: 'center',
    },
    rowAdd: {
        flexDirection: 'row',
        padding: 5,
    },
    buttonAdd: {
        backgroundColor: '#0000ff',
        padding: 5,
        margin: 5,
        borderRadius: 10
    },
    textButtonAdd: {
        color: '#fff',
        fontSize: 20
    },
    input: {
        margin: 10,
        borderRadius: 9,
        height: 40,
        width: '80%',
        color: '#000',
        fontSize: 15
    },
    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})