import { SafeAreaView, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

export default function Discover() {
  const navigation = useNavigation();
  function navigateSearch(){
    navigation.navigate('Search')
  }
 return (
   <SafeAreaView style={{flex:1}}>
    <Header name='search' press={navigateSearch}/>
    <View style={style.container}>

    </View>
   </SafeAreaView>
  );
}

const style= StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#36393F'
  }
})