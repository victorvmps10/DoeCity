import React, { useState, createContext, useEffect } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [donor, setDonor] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        async function loadStoarge() {
            const storageUser = await AsyncStorage.getItem('@doecity');

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false);
            }


            setLoading(false);

        }

        loadStoarge();
    }, [])



    async function signUp(email, password, name, code, location) {
        setLoadingAuth(true);
        if(!donor){
            if(code !== 'Duda'){
                Alert.alert('Codigo de verificação incorreto!')
                setLoadingAuth(false);
                return;
            }
        }
        await auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                if (donor) {
                    await firestore().collection('users')
                        .doc(uid).set({
                            name: name,
                            email: email,
                            balance: 0,
                            typeUser: 'Donor',
                            createdAt: new Date(),
                            location: location,
                        })
                        .then(() => {
                            let data = {
                                uid: uid,
                                name: name,
                                email: value.user.email,
                                typeUser: 'Donor',
                                about: '',
                                site: '',
                            }

                            setUser(data);
                            storageUser(data);
                            setLoadingAuth(false);
                        })
                } else {
                    await firestore().collection('ongs')
                        .doc(uid).set({
                            name: name,
                            email: email,
                            balance: 0,
                            typeUser: 'Ong',
                            createdAt: new Date(),
                            site: `https://www.google.com/search?q=${name}`,
                            location: location,
                            about: '',
                        })
                        .then(() => {
                            let data = {
                                uid: uid,
                                name: name,
                                email: value.user.email,
                                typeUser: 'Ong',
                                site: `https://www.google.com/search?q=${name}`,
                                about: ''
                            }
                            Alert.alert('Aviso', 'Vá em conta e insira o site e um texto sobre vcs!!!')
                            setUser(data);
                            storageUser(data);
                            setLoadingAuth(false);
                        })
                }
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('Erro', `${error}`);
                setLoadingAuth(false);
            })
    }


    async function signIn(email, password) {
        setLoadingAuth(true);
        await auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                const userProfile = await firestore().collection('users')
                    .doc(uid).get();
                if (userProfile.exists) {
                    let data = {
                        uid: uid,
                        name: userProfile.data().name,
                        email: value.user.email,
                        typeUser: 'Donor',
                        about: '',
                        site: '',
                    };
                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                } else {
                    const ongProfile = await firestore().collection('ongs')
                        .doc(uid).get();
                    let data = {
                        uid: uid,
                        name: ongProfile.data().name,
                        email: value.user.email,
                        typeUser: 'Ong',
                        about: ongProfile.data().about,
                        site: ongProfile.data().site,
                    };
                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                }
            })
            .catch((error) => {
                console.log(error);
                setLoadingAuth(false);
            })
    }

    async function recoveryAccount(email) {
        auth().sendPasswordResetEmail(email)
            .then(() => Alert.alert('Atenção', 'Email de redefinição enviado!!!'))
    }
    async function storageUser(data) {
        await AsyncStorage.setItem('@doecity', JSON.stringify(data))
    }
    async function signOut() {
        auth().signOut()
            .then(() =>
                AsyncStorage.clear()
                    .then(() => {
                        setUser(null)
                    })
            )
    }
    return (
        <AuthContext.Provider
            value={{
                signIn, signUp, recoveryAccount, signed: !!user,
                loading, user, loadingAuth, setUser, storageUser,
                signOut, setDonor, donor
            }}>
            {children}
        </AuthContext.Provider>
    )
}