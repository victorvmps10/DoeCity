import { Text, View, StyleSheet, Image } from 'react-native';

export default function Slides(props) {
 return (
   <View style={style.container}>
    <Image source={props.img} style={style.img}/>
    <Text style={style.title}>{props.title}</Text>
    <Text style={style.text}>{props.text}</Text>
   </View>
  );
}

const style = StyleSheet.create({
  container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  img:{
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF'
  },
  text:{
    marginTop: 10,
    margin: 10,
    fontSize: 15,
    textAlign: 'center',
    color: '#FFF'
  },
})