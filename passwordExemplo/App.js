import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default function App() {
  const [history, setHistory] = useState({})
  const [biometricExist, setBiometricExist] = useState(false);
  const [authenticated, setAuthenticated] = useState(false)

  async function CheckExistAuthenticates() {

    //Validar se o aparelho tem acesso a biometria
    const compatible = await LocalAuthentication.hasHardwareAsync()

    setBiometricExist(compatible)

    //Consultar as validações existentes
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()

    console.log(LocalAuthentication.AuthenticationType[types[0]])
  }

  async function SetHistory(){
    const objAuth = {
      dateAuthenticate: moment().format("DD/MM/YYYY HH:mm:ss")
    }

    await AsyncStorage.setItem("authenticate", JSON.stringify(objAuth))

    setHistory(objAuth)
  }

  async function GetHistory(){
    const objAuth = await AsyncStorage.getItem("authenticate")

    if(objAuth){
      setHistory(JSON.parse(objAuth))
    }
  }

  async function handleAuthentication(){
    const biometric = await LocalAuthentication.isEnrolledAsync();

    //validar se existe uma biometria cadastrada
    if(!biometric){
      return Alert.alert(
        "Falha ao logar",
        "Não foi encontrada nenhuma biometria cadastrada."
      )
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage : "Login com biometria"
    });
    setAuthenticated(auth.success)

    if(auth.success){
      SetHistory()
    }
  }

  async function handleClearAuthentication() {
    await AsyncStorage.removeItem("authenticate");
    setHistory({});
    setAuthenticated(false);
  }

  useEffect(() => {
    CheckExistAuthenticates();

    GetHistory();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {biometricExist 
          ? "Seu dispositivo é compatível com a biometria" 
          : "Seu dispositivo não suporta  o faceId / biometria"}
      </Text>

      <TouchableOpacity 
        onPress={() => handleAuthentication()}
        style={styles.btnAuth}>
          <Text style={styles.txtAuth}>Autenticar acesso</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handleClearAuthentication()}
        style={[styles.btnAuth, { backgroundColor: 'red' }]}>
          <Text style={styles.txtAuth}>Apagar autenticação</Text>
      </TouchableOpacity>

      <Text style={[styles.txtReturn, {color: authenticated ? "green" : "red"}]}>
        {authenticated ? "Autenticado" : "Não autenticado"}
      </Text>

      {
        history.dateAuthenticate 
        ? 
        <Text style={styles.txtHistory}>Último acesso em {history.dateAuthenticate}</Text>
        :
        null
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20, 
    textAlign: "center",
    lineHeight: 30,
    width: "70%"
  },
  btnAuth: {
    padding: 16,
    borderRadius: 15,
    margin: 10,
    backgroundColor: "#9FE2BF",
    elevation: 3
  },
  txtAuth: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  txtReturn: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 50
  },
  txtHistory:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#858383',
    position:'absolute' ,
    bottom: 120 
  }
});
