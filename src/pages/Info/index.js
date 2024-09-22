import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import ListParticipants from '../../components/ListParticipants';

export default function Info() {
  const DATA = [
    {
      id: 1,
      name: 'Victor Valentim',
      yearOld: 16,
      work: 'Dev Mobile'
    },
    {
      id: 2,
      name: 'Raul Salvador',
      yearOld: 16,
      work: 'Banco de dados'
    },
    {
      id: 3,
      name: 'Michael Schumacher',
      yearOld: 16,
      work: 'Banco de dados'
    },
    {
      id: 4,
      name: 'Guilherme Murilo',
      yearOld: 16,
      work: 'Teste de Qualidade'
    },
    {
      id: 5,
      name: 'Eduardo Matheus',
      yearOld: 16,
      work: 'Dev FrontEnd(Site)'
    },
    {
      id: 6,
      name: 'Fernando Muniz',
      yearOld: 16,
      work: 'Teste de Qualidade'
    },
  ]
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header name='info' />
      <View style={style.container}>
        <Text style={style.text}>Participantes: </Text>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <ListParticipants DATA={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#36393F'
  },
  text: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center'
  }
})