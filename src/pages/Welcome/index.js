
import AppIntroSlider from 'react-native-app-intro-slider';
import Slides from '../../components/Slides';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text, View, ActivityIndicator, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Slide1 from '../../assets/Slide1.jpg';
import Slide2 from '../../assets/Slide2.jpg';
import Slide3 from '../../assets/Slide3.jpg';
import Slide4 from '../../assets/Slide4.jpg';
import { useContext, useState } from 'react';
export default function Welcome() {
  const navigation = useNavigation();
  const DATA = [
    {
      id: 1,
      title: 'O que é donation city',
      text: 'Uma plataforma que ajuda a garantir que a sua doação chegue sem nenhum desvio de verba.',
      img: Slide1
    },
    {
      id: 2,
      title: 'Futuro',
      text: 'Planejamos abranger todas as cidades e estados do Brasil, já que somos um projeto 100% brasileiro, e, quem sabe, no futuro, o mundo todo.',
      img: Slide2
    },
    {
      id: 3,
      title: '100% na prática',
      text: 'Nós somos um indexador de links diretamente para os sites das ONGs, permitindo também fazer as transações via app, para fornecer relatórios sobre o status da sua doação e garantir que não ocorra nenhum desvio.',
      img: Slide3
    },
    {
      id: 4,
      title: 'Segurança',
      text: 'Para garantir que não sejam feitas fraudes de doações em seu nome ou e-mail, é necessário ter uma conta para assegurar a sua segurança e a da ONG destinada.',
      img: Slide4
    },
  ]
  return (
    <View style={{ flex: 1, backgroundColor: '#36393F' }}>
      <AppIntroSlider
        data={DATA}
        renderItem={({ item }) =>
          <Slides
            title={item.title}
            text={item.text}
            img={item.img}
          />
        }
        keyExtractor={item => String(item.id)}
        activeDotStyle={{
          backgroundColor: '#009CFF',
          width: 30,
        }}
        renderSkipButton={() => <Text style={{ color: '#FFF' }}>PULAR</Text>}
        showSkipButton={true}
        renderNextButton={() => <Text style={{ color: '#FFF' }}>PRÓXIMO</Text>}
        renderDoneButton={() => <Text style={{ color: '#FFF' }}>INICIAR</Text>}

        onDone={() => { navigation.navigate('Login') }}
      />
      
    </View>
  );
}