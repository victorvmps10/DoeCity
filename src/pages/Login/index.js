import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform,
  SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
export default function Login() {
  const [type, setType] = useState(false);
  const [recoveryType, setRecoveryType] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [ongType, setOngType] = useState(false);
  const [site, setSite] = useState('');
  const [code, setCode] = useState('');
  const { signed, loading, loadingAuth, signIn, signUp, recoveryAccount, setDonor } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const navigation = useNavigation();
  async function handleSingUp() {
    if (name === '' || email === '' || password === '') {
      Alert.alert('Atenção', 'Preencha os campos')
      return;
    }
    await signUp(email, password, name, code, site, location)
  }
  async function handleSignIn() {
    if (email === '' || password === '') {
      Alert.alert('Atenção', 'Preencha os campos')
      return;
    }
    await signIn(email, password)
  }
  async function handleRecovery() {
    if (email === '') {
      Alert.alert('Atenção', 'Preencha os campos')
      return;
    }
    await recoveryAccount(email)
  }
  function handleDonor() {
    Keyboard.dismiss()
    setOpen(false)
    setDonor(true)
    setOngType(false)
    setType(!type)
  }
  function handleOng() {
    Keyboard.dismiss()
    setOpen(false)
    setDonor(false)
    setOngType(true)
    setType(!type)
  }
  useEffect(() => {
    setName('')
    setEmail('')
    setPassword('')
    Keyboard.dismiss()
    setHidePass(true)
  }, [type, recoveryType])
  useEffect(() => {
    if (signed) {
      navigation.navigate('AppTabs')
    }
  }, [])
  if (recoveryType) {
    return (
      <SafeAreaView style={style.container}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View style={style.containerTitle}>
            <Animatable.Text
              animation='flipInY'
              style={[style.title, { color: '#FFF' }]}>Doe<Text style={{ color: '#00B2FF' }}>City</Text></Animatable.Text>
            <Text style={style.text}>Agir, Doar e Transformar vidas</Text>
          </View>
          <View style={style.areaInput}>
            <TextInput
              style={style.input}
              placeholder='email@gmail.com'
              placeholderTextColor='#000'
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <TouchableOpacity style={style.button} onPress={handleRecovery}>
            {loading || loadingAuth ? (
              <ActivityIndicator color='#FFF' size={20} />
            ) : (
              <Text style={style.textButton}>Recuperar</Text>
            )}
          </TouchableOpacity>
          <View style={style.areaButton}>
            <TouchableOpacity onPress={() => setRecoveryType(!recoveryType)}>
              <Text style={style.textAlterState}>Já recuperou? entre!!!</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  if (type) {
    return (
      <SafeAreaView style={style.container}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View style={style.containerTitle}>
            <Animatable.Text
              animation='flipInX'
              style={[style.title, { color: '#FFF' }]}>Doe<Text style={{ color: '#00B2FF' }}>City</Text></Animatable.Text>
            <Text style={style.text}>Agir, Doar e Transformar vidas</Text>
          </View>
          <View style={style.areaInput}>
            <TextInput
              style={style.input}
              placeholder='Seu Nome'
              placeholderTextColor='#000'
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={style.input}
              placeholder='email@gmail.com'
              placeholderTextColor='#000'
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <View style={style.areaInputPass}>
              <TextInput
                style={style.inputPassword}
                placeholder={hidePass ? '*******' : 'Senha123'}
                placeholderTextColor='#000'
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={hidePass}
              />
              <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
                <Feather
                  name={hidePass ? 'eye-off' : 'eye'}
                  size={20}
                  color='#000'
                  style={{ marginRight: 8 }} />
              </TouchableOpacity>
            </View>
            <View style={style.picker}>
              <Picker
                selectedValue={location}
                onValueChange={(itemValue, itemIndex) => { setLocation(itemValue) }}
                style={{color: '#000'}}
              >
                <Picker.Item label="Praia Grande - SP" value="Praia Grande - SP" />
                <Picker.Item label="Santos - SP" value="Santos - SP" />
                <Picker.Item label="Guaruja - SP" value="Guaruja - SP" />
                <Picker.Item label="São Vicente - SP" value="São Vicente - SP" />
                <Picker.Item label="São Paulo - SP" value="São Paulo - SP" />
                <Picker.Item label="Mongaguá - SP" value="Mongaguá - SP" />
                <Picker.Item label="Itanhaem - SP" value="Itanhaem - SP" />
              </Picker>
            </View>
            {ongType && (
              <View>
                <TextInput
                  style={style.input}
                  placeholder='www.nomeong.org'
                  placeholderTextColor='#000'
                  value={site}
                  onChangeText={(text) => setSite(text)}
                />
                <TextInput
                  style={style.input}
                  placeholder='Codigo de verificação'
                  placeholderTextColor='#000'
                  value={code}
                  onChangeText={(text) => setCode(text)}
                />
              </View>
            )}
          </View>

          <TouchableOpacity style={style.button} onPress={handleSingUp}>
            {loading || loadingAuth ? (
              <ActivityIndicator color='#FFF' size={20} />
            ) : (
              <Text style={style.textButton}>Cadastrar</Text>
            )}
          </TouchableOpacity>
          <View style={style.areaButton}>
            <TouchableOpacity onPress={() => setType(!type)}>
              <Text style={style.textAlterState}>Tem conta? entre!!!</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={style.container}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <View style={style.containerTitle}>
          <Animatable.Text
            animation='zoomIn'
            style={[style.title, { color: '#FFF' }]}>Doe<Text style={{ color: '#00B2FF' }}>City</Text></Animatable.Text>
          <Text style={style.text}>Agir, Doar e Transformar vidas</Text>
        </View>
        <View style={style.areaInput}>
          <TextInput
            style={style.input}
            placeholder='email@gmail.com'
            placeholderTextColor='#000'
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={style.areaInputPass}>
            <TextInput
              style={style.inputPassword}
              placeholder={hidePass ? '*******' : 'Digite sua senha'}
              placeholderTextColor='#000'
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={hidePass}
            />
            <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
              <Feather
                name={hidePass ? 'eye-off' : 'eye'}
                size={20}
                color='#000'
                style={{ marginRight: 8 }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setRecoveryType(!type)}>
            <Text style={style.textForgot}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={style.button} onPress={handleSignIn}>
          {loading || loadingAuth ? (
            <ActivityIndicator color='#FFF' size={20} />
          ) : (
            <Text style={style.textButton}>Entrar</Text>
          )}
        </TouchableOpacity>
        <View style={style.areaButton}>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={style.textAlterState}>Não tem conta? crie uma!!!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Modal visible={open} animationType="slide" transparent={true}>
        <View style={style.modalContainer}>
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
          <TouchableOpacity style={[{ backgroundColor: "#428cfd" }, style.buttonModal]} onPress={handleDonor}>
            <Text style={[{ color: "#fff" }, style.buttonTextModal]}>SOU DOADOR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{ backgroundColor: "#428cfd" }, style.buttonModal]} onPress={handleOng}>
            <Text style={[{ color: "#fff" }, style.buttonTextModal]}>SOU ONG</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    justifyContent: 'center'
  },
  containerTitle: {
    alignItems: 'center',

  },
  title: {
    fontSize: 70,
    fontWeight: 'bold'
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    marginBottom: 15
  },
  input: {
    backgroundColor: '#D9D9D9',
    margin: 5,
    borderRadius: 15,
    height: 45,
    color: '#000',
    padding: 10,
    fontSize: 15
  },
  inputPassword: {
    color: '#000',
    width: '90%',
    maxWidth: '90%',
    fontSize: 15
  },
  areaButton: {
    alignItems: 'center'
  },
  areaInput: {
    marginHorizontal: 20,
  },
  textForgot: {
    marginHorizontal: 7,
    marginBottom: 7,
    color: '#00B2FF',
    fontSize: 15,
    textDecorationLine: 'underline'
  },
  textAlterState: {
    color: '#fff'
  },
  button: {
    backgroundColor: '#00B2FF',
    height: 40,
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 25,
    marginTop: 5,
  },
  textButton: {
    color: '#fff'
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
  modalContainer: {
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
  areaInputPass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D9D9D9',
    margin: 5,
    borderRadius: 15,
    height: 45,
    padding: 2
  },
  picker: {
    borderRadius: 15,
    backgroundColor: '#D9D9D9',
    height: 45,
    margin: 5,
    justifyContent: 'center'
  }
})