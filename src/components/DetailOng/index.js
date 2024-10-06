import {
  SafeAreaView, View, StyleSheet, Text,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ActivityIndicator } from 'react-native';
export default function DetailOng(data) {
  const isActive = useIsFocused();
  const [value, setValue] = useState(0);
  const [name, setName] = useState('');
  const [about, setAbout] = useState();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState();
  const [location, setLocation] = useState('');
  const [imageFullOpen, setImageFullOpen] = useState(false);
  useEffect(() => {
    setLoading(true);
    async function getData() {
      try {
        const ongProfile = await firestore().collection('ongs').doc(data?.userId).get();
        const ongData = ongProfile.data();
        setName(ongData?.name);
        setValue(ongData?.balance);
        setLocation(ongData?.location);
        setAbout(ongData?.about);
      } catch (error) {
        console.error("Usuario sem internet ctz: ", error);
      }
      try {
        let response = await storage().ref('ongs').child(data?.userId).getDownloadURL();
        setUrl(response);
        setLoading(false);
      } catch (error) {
        console.log("Ctz que não tem foto");
        setLoading(false);
      }
    }
    getData();
  }, [data, isActive])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#353840' }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={50} color="#00B2FF" />
        </View>
      ) : (
        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
          {url ?
            <TouchableOpacity
              onPress={() => setImageFullOpen(true)}
            >
              <Image
                source={{ uri: url }}
                style={style.avatar}
              />
            </TouchableOpacity>
            :
            <View style={style.nullAvatar}><Text>.</Text></View>
          }
          <Text style={style.text}><Text style={{ fontWeight: 'bold' }}>Nome da Ong:</Text> {name}</Text>
          <Text style={style.text}><Text style={{ fontWeight: 'bold' }}>Localidade:</Text>{location}</Text>
          <Text style={style.text}>
            <Text style={{ fontWeight: 'bold' }}>Saldo da Ong:</Text> R${value}
          </Text>
          <Text style={[style.text, { fontWeight: 'bold' }]}>
            Sobre nós:
          </Text>
          <Text style={style.text}>
            {about}
          </Text>
        </View>
      )}
      <Modal animationType="fade" transparent={true} visible={imageFullOpen}>
        <View style={style.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setImageFullOpen(false)}>
            <View style={style.modal}></View>
          </TouchableWithoutFeedback>
          <Image
            source={{ uri: url }}
            style={style.photoFull}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: '#fff',
    margin: 5,
    textAlign: 'center'
  },
  avatar: {
    marginTop: '5%',
    marginBottom: '5%',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  nullAvatar: {
    marginTop: '5%',
    marginBottom: '5%',
    backgroundColor: '#FFF',
    width: 165,
    height: 165,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)'
  },
  modal: {
    flex: 1,
  },
  photoFull: {
    width: 350,
    height: 350,
    borderRadius: 180,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -175,
    marginTop: -175,
  }
})