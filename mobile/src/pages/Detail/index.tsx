import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView, Linking, ScrollView  } from 'react-native';
import Constants from 'expo-constants';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string,
    biz_name: string,
    email: string,
    whatsapp: string,
    instagram: string,
    facebook: string,
    site: string,
    city: string,
    state: string,
    neighborhood: string,
    full_address: string,
    working_hours: string,
    curator_review: string

  },
  categories: [{
    id: number,
    name: string
  }]
}

const Detail = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const [data, setData] = useState<Data>({} as Data);

    const routeParams = route.params as Params;

    useEffect( () => {
      api.get(`negocios-locais/${routeParams.point_id}`)
        .then( response => {
          setData(response.data);          
        })
    }, []);

    console.log(routeParams.point_id)

    function handleNavigateBack () {
      navigation.goBack();
    }


    function handleWhatsapp () {
      Linking.openURL(`whatsapp://send?phone=+55${data.point.whatsapp}`);
    }

    function handleInstagram () {
      Linking.openURL(`https://instagram.com/${data.point.instagram}`);
    }

    if (!data.point) {
      return null;
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={25} color="#E55933" /> 
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.point.image }} />

                <Text style={styles.pointName}>{data.point.biz_name}</Text>
                <Text style={styles.description}>{data.categories[0].name}</Text>

                <ScrollView persistentScrollbar>
                  <View style={styles.curatorReview}>
                      <Text style={styles.curatorReviewTitle}>Descrição</Text>
                      <Text style={styles.curatorReviewContent}>{data.point.curator_review}</Text>
                  </View>
                  
                  <View style={styles.neighborhood}>
                      <Text style={styles.neighborhoodTitle}>Bairro</Text>
                      <Text style={styles.neighborhoodContent}>{data.point.neighborhood}</Text>
                  </View>
                  
                  { data.point.full_address != '' && data.point.full_address != null && (
                    <View style={styles.address}>
                      <Text style={styles.addressTitle}>Endereço completo</Text>
                      <Text style={styles.addressContent}>{data.point.full_address}</Text>
                    </View>
                  )}

                  { data.point.site != '' && data.point.site != null && (
                    <View style={styles.site}>
                        <Text style={styles.siteTitle}>Site</Text>
                        <Text
                          onPress={ () => Linking.openURL(data.point.site)}
                          style={styles.siteContent}
                        >
                          {data.point.site}
                        </Text>
                        
                    </View>
                  )}
  
                  { data.point.working_hours != '' && data.point.working_hours != null && (
                    <View style={styles.workingHours}>
                        <Text style={styles.workingHoursTitle}>Horário de Funcionamento</Text>
                        <Text style={styles.workingHoursContent}>{data.point.working_hours}</Text>
                    </View>
                  )}
  
                  { data.point.facebook != '' && data.point.facebook != null && (
                    <View style={styles.facebook}>
                        <Text style={styles.facebookTitle}>Facebook</Text>
                        <Text
                          onPress={ () => Linking.openURL( `https://www.facebook.com/${data.point.facebook}`) }
                          style={styles.facebookContent}
                        >
                          facebook.com/{data.point.facebook}
                        </Text>
                    </View>
                  )}

                  

                </ScrollView>
                  
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#555" />
                    <Text style={styles.buttonText}>Whatsapp</Text>                    
                </RectButton>
                <RectButton style={styles.button} onPress={handleInstagram}>
                    <FontAwesome name="instagram" size={20} color="#555" />
                    <Text style={styles.buttonText}>Instagram</Text>                    
                </RectButton>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: Constants.statusBarHeight + 20
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'OpenSans_400Regular',
    marginTop: 24,
  },

  description: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
    paddingBottom: 16
  },

  curatorReview: {
    marginTop: 32,
  },
  
  curatorReviewTitle: {
    color: '#322153',
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
  },

  curatorReviewContent: {
    fontFamily: 'OpenSans_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  neighborhood: {
    marginTop: 32,
  },
  
  neighborhoodTitle: {
    color: '#322153',
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
  },

  neighborhoodContent: {
    fontFamily: 'OpenSans_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'OpenSans_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  site: {
    marginTop: 32,
  },
  
  siteTitle: {
    color: '#322153',
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
  },

  siteContent: {
    fontFamily: 'OpenSans_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  workingHours: {
    marginTop: 32,
  },
  
  workingHoursTitle: {
    color: '#322153',
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
  },

  workingHoursContent: {
    fontFamily: 'OpenSans_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  facebook: {
    marginTop: 32,
  },
  
  facebookTitle: {
    color: '#322153',
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
  },

  facebookContent: {
    fontFamily: 'OpenSans_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 30,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#F2C14E',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
});

export default Detail;