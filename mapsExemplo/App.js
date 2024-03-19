import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync, // Solicite o acesso a localizacao
  getCurrentPositionAsync,// Recebe a localizacao
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { mapskey } from './utils/mapsApiKey';

export default function App() {
  const mapsReference = useRef(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [finalPosition, setFinalPosition] = useState({
    latitude: -23.532877,
    longitude: -46.635338,
  })

  async function LocationCapture() {
    const { granted } = await requestForegroundPermissionsAsync()

    if (granted) {
      const captureLocation = await getCurrentPositionAsync()

      setInitialPosition(captureLocation)
      console.log(initialPosition)

    }
  }
  async function ReloadViewMap() {
    if (mapsReference.current && initialPosition) {
      await mapsReference.current.fitToCoordinates(
        [{ latitude: initialPosition.coords.latitude, longitude: initialPosition.coords.longitude },
        { latitude: finalPosition.latitude, longitude: finalPosition.longitude }
        ],
        {
          edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
          animated: true
        }
      )
    }
  }
  
  useEffect(() => {
    LocationCapture()

    watchPositionAsync({
      accuracy : LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, async (response) => {
      // recebe e guarda a nova localização
      await setInitialPosition(response)

      mapsReference.current?.animatedCamera({
        pitch: 60,
        center: response.coords
      })

      console.log(response)
    })

  }, [1000])

  useEffect(() => {
    ReloadViewMap()
  }, [initialPosition])


  return (
    <View style={styles.container}>
      {
        initialPosition != null ? (
          <MapView
            ref={mapsReference}
            initialRegion={{
              latitude: initialPosition.coords.latitude,
              longitude: initialPosition.coords.longitude,
              longitudeDelta: 0.005,
              latitudeDelta: 0.005
            }}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            customMapStyle={grayMapStyle}
          >
            <Marker
              coordinate={{
                latitude: initialPosition.coords.latitude,
                longitude: initialPosition.coords.longitude,
                longitudeDelta: 0.005,
                latitudeDelta: 0.005
              }}
              title='Posição inicial'
              pinColor='red'
            />

            <MapViewDirections
              origin={initialPosition.coords}
              destination={{
                latitude: -23.532877,
                longitude: -46.635338,
                longitudeDelta: 0.005,
                latitudeDelta: 0.005
              }}
              apikey={mapskey}
              strokeColor='#496BBA'
              strokeWidth={5}
            />

            <Marker
              coordinate={{
                latitude: -23.532877,
                longitude: -46.635338
              }}
              title='Destino'
              pinColor='purple'
            />
          </MapView>

        ) : (
          <>
            <Text>Finding location</Text>
            <ActivityIndicator />
          </>
        )
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
  map: {
    flex: 1,
    width: '100%'
  },

});

const grayMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#E1E0E7",
      },
    ],
  },
  {
    elementType: "geometry.fill",
    stylers: [
      {
        saturation: -5,
      },
      {
        lightness: -5,
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#FBFBFB",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#33303E",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#66DA9F",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1B1B1B",
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#C6C5CE",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#FBFBFB",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#ACABB7",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#8C8A97",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#8C8A97",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#8EA5D9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
];

