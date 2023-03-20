import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, PermissionsAndroid, Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('screen');
export default function App(){

    const [region, setRegion] = useState(null);
    const [marcadores, setMarcadores] = useState([]);

    useEffect(()=>{
      pegandoLocalizacao()

  }, [])

    function pegandoLocalizacao() {
      Geolocation.getCurrentPosition(info =>{
        console.log("LAT ", info.coords.latitude)
        console.log("LONG ", info.coords.longitude)

        setRegion({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      },
      () => {console.log("ERRO")}, {
        enableHighAccuracy : true,
        timeout: 2000,
    })
    }

    function novoMarcador(e){
      console.log(e.nativeEvent.coordinate.latitude);

      let dados = {
        key: marcadores.length,
        coords: {
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude
        },
        pinColor: 'red'
      }
      setRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })

      setMarcadores(Array => [...Array, dados])

    }
    
return (
    <View style ={styles.container}>
      <MapView
      onMapReady={() => {
        Platform.OS === 'android' ?
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
          .then(() => {
            console.log("USUARIO ACEITOU")
          })
          : ''
      }}
      style = {{width:width, height:height}}
      region = {region}
      zoomEnabled = {true}
      minZoomLevel = {17}
      showsUserLocation = {true}
      loadingEnabled = {true} 
      onPress={(e) => novoMarcador(e)}
      >
        {marcadores.map( marcador =>{
          return (
            <Marker key = {marcador.key} coordinate={marcador.coords} pinColor={marcador.pinColor}/>
          )
        })}
        </MapView>
    </View>
);
}

const styles = StyleSheet.create({
  container:{
  flex:1,
  alignItems:'center'
},
})
