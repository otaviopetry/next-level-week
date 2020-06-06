import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Category {
  id: number,
  name: string,
  image_url: string
}

interface Point {
  id: number,
  image: string,
  image_url: string,
  biz_name: string,
  latitude: number,
  longitude: number
}

const Points = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [points, setPoints] = useState<Point[]>([]);

    useEffect( () => {
      async function loadPosition() {
        const { status } = await Location.requestPermissionsAsync();

        if (status !== 'granted' ) {
          Alert.alert('Ooooops...', 'Precisamos de sua permissão para obter a localização');
          return;
        }

        const location = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = location.coords;

        console.log(latitude, longitude);

        setInitialPosition([
          latitude,
          longitude
        ])

      }

      loadPosition();
    }, []);

      

    useEffect( () => {
      api.get('categorias').then(response => {
        setCategories(response.data)
      });
    });

    useEffect( () => { 
      api.get('negocios-locais', {
        params: {
          city: 'Porto Alegre',
          state: 'RS',
          categories: selectedCategory
        }
      }).then( response => {
        setPoints(response.data);
      })
    }, [selectedCategory] );

    function handleNavigateBack () {
      navigation.goBack();
    }

    function handleNavigateToDetail (id: number) {
      navigation.navigate('Detail', { point_id: id });
    }

    function handleSelectItem (id: number) {

        if ( selectedCategory[0] === id ) {
            setSelectedCategory([0]);
        } else {
            setSelectedCategory([id]);
        }
    }

    return (
      <>
        <View style={styles.container}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={20} color="#E55933" onPress={handleNavigateBack} /> 
          </TouchableOpacity>

          <Text style={styles.title}>Explore o mapa</Text>
          <Text style={styles.description}>Escolha uma categoria e conheça pequenos negócios da nossa comunidade</Text>

          <View style={styles.mapContainer}>
            { initialPosition[0] !== 0 && (
              <MapView 
                style={styles.map}
                initialRegion={{
                  latitude: initialPosition[0],
                  longitude: initialPosition[1],
                  latitudeDelta: 0.024,
                  longitudeDelta: 0.024
                }} 
              >

                {points.map( point => (
                  <Marker
                    key={String(point.id)}
                    style={styles.mapMarker}
                    onPress={() => handleNavigateToDetail(point.id)}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude
                    }}
                  >
                    
                    <View style={styles.mapMarkerContainer}>
                      <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                      <Text style={styles.mapMarkerTitle}>{point.biz_name}</Text>
                    </View>

                  </Marker>                  
                ))}
                

              </MapView>
            )}          
          </View>
        </View>
        <View style={styles.itemsContainer}>

          {categories.map( category => (
            <TouchableOpacity 
              style={[
                styles.item,
                selectedCategory[0] === category.id ? styles.selectedItem : {}  
              ]} 
              onPress={ () => handleSelectItem(category.id) } 
              key={String(category.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={category.image_url} />
              <Text style={styles.itemTitle}>{category.name}</Text>
            </TouchableOpacity>
          ))}

        </View>
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Raleway_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'OpenSans_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 120,
    backgroundColor: '#F2C14E',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'OpenSans_600SemiBold',
    color: '#555',
    lineHeight: 23,
    fontSize: 7,
    textAlign: 'center'
  },

  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#E55933',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8
  },
});

export default Points;