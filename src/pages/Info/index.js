import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Linking, TouchableWithoutFeedback } from 'react-native';
import Header from '../../components/Header';
import ParticipantsList from '../../components/ParticipantsList';
import Feather from 'react-native-vector-icons/Feather';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Victor from '../../assets/victor.jpg';
import Raul from '../../assets/raul.jpg';
import Michael from '../../assets/michael.jpg';
import Eduardo from '../../assets/eduardo.jpg';
import Avatar from '../../assets/avatar.png';
export default function Info() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const DATA = [
    {
      id: 1,
      name: 'Victor Valentim',
      yearOld: 16,
      work: 'Dev Mobile',
      insta: 'victorvmps10',
      github: 'victorvmps10',
      photo: Victor
    },
    {
      id: 2,
      name: 'Raul Salvador',
      yearOld: 16,
      work: 'Banco de dados',
      insta: '0llrayll0',
      github: '0llrayll0',
      photo: Raul
    },
    {
      id: 3,
      name: 'Michael Schumacher',
      yearOld: 16,
      work: 'Banco de dados',
      insta: 'michaelschumacher2644',
      photo: Michael
    },
    {
      id: 4,
      name: 'Eduardo Matheus',
      yearOld: 16,
      work: 'Dev FrontEnd(Site)',
      insta: 'edumtheusc',
      photo: Eduardo
    },
    {
      id: 5,
      name: 'Fernando Muniz',
      yearOld: 16,
      work: 'Teste de Qualidade',
      insta: 'cdp_fernando',
      photo: Avatar
    },
    {
      id: 6,
      name: 'Guilherme Murilo',
      yearOld: 16,
      work: 'Teste de Qualidade',
      photo: Avatar
    },
  ];
  function openInfo() {
    setOpen(true)
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header name='info' press={openInfo} />
      <View style={style.container}>
        <Text style={style.title}>Participantes: </Text>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <ParticipantsList DATA={item} />}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{height: '40%'}}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={style.title}>Detalhes Tecnicos:</Text>
          <Text
            style={[style.textTec, { fontWeight: 'bold', fontSize: 15, textAlign: 'center' }]}>
            Codigo no GitHub do Victor (Desenvolvedor do App)
          </Text>
          <Text
            style={[style.textTec, { fontWeight: 'bold', fontSize: 20 }]}>
            Ferramentas usadas:
          </Text>
          <Text style={style.textTec}>
            React Native: Uma estrutura de aplicativo móvel popular, baseada na linguagem
            JavaScript, que permite criar aplicativos móveis renderizados nativamente para
            iOS e Android. A estrutura permite criar um aplicativo para várias plataformas
            usando a mesma base de código.
          </Text>
          <Text style={style.textTec}>
            React Native Reanimated: Uma poderosa biblioteca de animações que facilita a
            criação de animações e interações suaves executadas no thread de UI.
          </Text>
          <Text style={style.textTec}>
            Picker: Biblioteca de opções
          </Text>
          <Text style={style.textTec}>Pacote de icones Vector.</Text>
          <Text style={style.textTec}>Banco de dados Google Firebase. (Com RNFirebase)</Text>
          <Text style={style.textTec}>react-native-app-intro-slider</Text>

        </ScrollView>
        <Modal visible={open} animationType="fade" transparent={true}>
          <View style={style.modalContainer}>
            <TouchableWithoutFeedback onPress={()=>setOpen(false)}>
              <View style={style.modal}></View>
            </TouchableWithoutFeedback>
            <View style={style.modalContent}>
              <TouchableOpacity
                style={style.buttonBack}
                onPress={() => setOpen(false)}>
                <Feather
                  name="arrow-left"
                  size={22}
                  color='#000'
                />
                <Text style={{ color: '#000' }}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[{ backgroundColor: "#428cfd" }, style.buttonModal]}
                onPress={() => {
                  setOpen(false)
                  navigation.navigate('Feedback')
                }}>
                <Text style={[{ color: "#fff" }, style.buttonTextModal]}>AVALIAR TRABALHO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[{ backgroundColor: "#F64B57" }, style.buttonModal]}
                onPress={() => {
                  setOpen(false)
                  Linking.openURL('https://sites.google.com/fortecpraiagrande.com.br/donationcity/in%C3%ADcio')
                }
                }>
                <Text style={[{ color: "#fff" }, style.buttonTextModal]}>SITE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[{ backgroundColor: "#51C880" }, style.buttonModal]}
                onPress={() => {
                  setOpen(false)
                  Linking.openURL('https://sites.google.com/fortecpraiagrande.com.br/donationcity/termos-de-uso-e-privacidade')
                }}>
                <Text style={[{ color: "#fff" }, style.buttonTextModal]}>TERMOS DE USO/PRIVACIDADE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#36393F'
  },
  title: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff'
  },
  textTec: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
    textAlign: 'justify',
  },
  containerButton: {
    backgroundColor: '#00f',
    margin: 5,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  TextButton: {
    color: '#FFF',
    fontSize: 25,
    margin: 5
  },
  buttonModal: {
    marginTop: 16,
    width: '80%',
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextModal: {
    fontSize: 18
  },
  modalContent: {
    width: '100%',
    height: '50%',
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  buttonBack: {
    position: 'absolute',
    top: 15,
    left: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)'
  },
  modal: {
    flex: 1,
  },
})