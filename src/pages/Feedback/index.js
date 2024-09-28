import {
  View, SafeAreaView, StyleSheet, TouchableOpacity, Text, ScrollView, TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
export default function Feedback() {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [defaultRating, setDefaultRating] = useState(4);
  const [loading, setLoading] = useState(false);
  async function SendFeedback() {
    if (name != '') {
      setLoading(true)
      await firestore().collection('Feedbacks').add({
        name: name,
        comment: comment,
        note: defaultRating + "/5",
      })
        .then(() => {
          setLoading(false)
          Alert.alert('Enviado', 'Obrigado por avaliar');
          navigation.navigate("InfoPage")
        })

    } else {
      await firestore().collection('Feedbacks').add({
        name: 'Anonimo',
        comment: comment,
        note: defaultRating + "/5",
      })
        .then(() => {
          setLoading(false)
          Alert.alert('Enviado', 'Obrigado por avaliar');
          navigation.navigate("InfoPage")
        })
    }

  }
  const navigation = useNavigation();
  const RatingBar = () => {
    return (
      <SafeAreaView style={style.containerRating}>

        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              style={{ margin: 5 }}
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}>
              {
                item <= defaultRating
                  ? <AntDesign name="star" size={40} color="#ff0" />
                  : <AntDesign name="staro" size={40} color="#000" />
              }
            </TouchableOpacity>
          );
        })}
      </SafeAreaView>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#36393F'}}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <Text style={style.text}>NOME:</Text>
        <TextInput
          style={style.input}
          placeholder="Digite seu nome..."
          value={name}
          onChangeText={(text) => setName(text)}
          placeholderTextColor="#000"
        />
        <Text style={style.text}>NOTA:</Text>
        <RatingBar />
        <Text style={style.text}>COMENTARIO:</Text>
        <TextInput
          style={style.input}
          placeholder="Digite seu comentario..."
          value={comment}
          onChangeText={(text) => setComment(text)}
          placeholderTextColor="#000"
        />
        <TouchableOpacity
          style={style.button}
          onPress={SendFeedback}>
           {loading ? (
              <ActivityIndicator color='#FFF' size={20} />
            ) : (
              <Text style={style.textButton}>Cadastrar</Text>
            )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  rankingContainer: {
    backgroundColor: '#a9a9a9',
    margin: 10,
    borderRadius: 15,
    height: 100,
  },
  rankingTitle: {
    color: '#FFF',
    margin: 5,
    fontSize: 30,
  },
  rankingText: {
    color: '#FFF',
    margin: 5,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#00B2FF',
    height: 40,
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 25,
    marginTop: 15,
  },
  textButton: {
    color: '#fff'
  },
  text: {
    color: '#FFF',
    margin: 10,
    fontSize: 25,
  },
  input: {
    backgroundColor: '#D9D9D9',
    margin: 5,
    borderRadius: 15,
    height: 45,
    color: '#000',
    padding: 10,
    fontSize: 15,
    marginHorizontal: 25,
  },
  containerRating: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
})