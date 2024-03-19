import { StatusBar } from 'expo-status-bar';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState, useRef } from 'react';

import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native';

import * as MediaLibrary from 'expo-media-library'

export default function App() {
  const cameraRef= useRef(null)

  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [photo, setPhoto] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  async function CapturePhoto() {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri)

      setOpenModal(true)
      console.log(photo)
    }
  }

  function ClearPhoto() {
    setPhoto(null)

    setOpenModal(false)
  }

  async function SavePhoto() {
    if (photo) {
      try {
        // Salvando a foto na galeria com uma identificação
        const asset = await MediaLibrary.createAssetAsync(photo, { id: 'foto_customizada' });
  
        // Se a foto for salva com sucesso, exiba uma mensagem de sucesso
        Alert.alert('Sucesso', 'Foto salva na galeria');
      } catch (error) {
        // Se houver um erro ao salvar a foto, exiba uma mensagem de erro
        Alert.alert('Erro', 'Erro ao salvar foto na galeria: ' + error.message);
      }
    }
  }
  
  async function DeletePhoto() {
    try {
      // Obtendo a identificação da última foto da galeria
      const lastPhotoId = await getLastPhotoId();
  
      // Verificando se a identificação foi obtida com sucesso
      if (lastPhotoId) {
        // Excluindo a última foto da galeria
        await MediaLibrary.deleteAssetsAsync([lastPhotoId]);
  
        // Exibindo uma mensagem de sucesso
        Alert.alert('Sucesso', 'Última foto apagada da galeria');
      } else {
        // Se a identificação não foi obtida, exiba uma mensagem informando
        Alert.alert('Aviso', 'Não foi encontrada nenhuma foto na galeria');
      }
    } catch (error) {
      // Se houver um erro ao excluir a foto, exiba uma mensagem de erro
      Alert.alert('Erro', 'Erro ao excluir última foto da galeria: ' + error.message);
    }
  }
  
  async function getLastPhotoId() {
    try {
      // Recuperando todas as fotos da galeria, ordenadas pela data de criação
      const mediaLibraryAssets = await MediaLibrary.getAssetsAsync({
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        mediaType: [MediaLibrary.MediaType.photo],
      });
      
      // Verificando se há pelo menos uma foto na galeria
      if (mediaLibraryAssets && mediaLibraryAssets.assets.length > 0) {
        // Retornando a identificação da última foto
        return mediaLibraryAssets.assets[0].id;
      } else {
        // Se não houver fotos na galeria, retorne null
        return null;
      }
    } catch (error) {
      // Se houver um erro ao obter as fotos, imprima o erro e retorne null
      console.error('Erro ao obter a última foto da galeria:', error);
      return null;
    }
  }
  
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync()

      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync()
    })();
  }, [])

  return (
    <View style={styles.container}>
      <Camera
       ref={cameraRef}
        type={cameraType}
        style={styles.camera}

      >
        <View style={styles.viewFlip}>
          <TouchableOpacity style={styles.bntFLip} onPress={() => setCameraType(cameraType == CameraType.front ? CameraType.back : CameraType.front)}>
            <Text style={styles.txtFlip}>Trocar</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity style={styles.bntCapture} onPress={() => CapturePhoto()}>
        <FontAwesome name='camera' size={23} color={'#fff'}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bntLastPhoto} onPress={async () => {
        const lastPhotoId = await getLastPhotoId();
        if (lastPhotoId) {
          Alert.alert('Última foto na galeria', 'ID da última foto: ' + lastPhotoId);
        } else {
          Alert.alert('Aviso', 'Não foi encontrada nenhuma foto na galeria');
        }
      }}>
        <Text style={styles.textLastPhoto}>Obter última foto</Text>
      </TouchableOpacity>

      <Modal animationType='slide' transparent={false} visible={openModal}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30}}>
        <Image style={{width: '100%', height: 500, borderRadius: 10}} source={{uri: photo}}/>

        <View style={{margin: 15, flexDirection: 'row'}}>
          <TouchableOpacity 
            style={styles.btnCancel}
            onPress={() => DeletePhoto()}
          >
            <FontAwesome name='trash' size={35} color={'#ff0000'}/>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnUpload}
            onPress={() => SavePhoto()}
          >
            <FontAwesome name='save' size={35} color={'#121212'}/>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>
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
  camera: {
    flex: 1,
    height: '80%',
    width: '100%'
  },
  viewFlip: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bntFLip: {
    padding: 15
  },
  txtFlip: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20
  },
  bntCapture: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bntLastPhoto: {
    margin: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#4287f5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textLastPhoto: {
    fontSize: 18,
    color: '#fff'
  },
  btnCancel: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnUpload: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
