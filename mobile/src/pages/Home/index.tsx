import React from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, Text, StyleSheet, ImageBackground } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const B = (props) => <Text style={{
  fontFamily: 'OpenSans_600SemiBold',
  color: '#333'
}}>{props.children}</Text>

const Home = () => {
    const navigation = useNavigation();
    
    function handleNavigateToPoints() {
      navigation.navigate('Points');
    }

    return (
        <ImageBackground source={ require('../../assets/background-home.png') } style={styles.container}>
            
            <View style={styles.container}>
                
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <Text style={styles.title}>Vamos fortalecer os pequenos negócios</Text>
                    <Text style={styles.description}>Seja durante ou depois da quarentena, dentro do possível, escolha comprar direto de quem faz. Assim teremos comunidades mais fortes, unidas e <B>preparadas para diferentes cenários.</B></Text>
                    <Text style={styles.description}>E você vai conhecer trabalhos e pessoas incríveis  🧡</Text>
                </View>


            </View>


            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                  <View style={styles.buttonIcon}>
                    <Text>
                      <Icon name="arrow-right" color="#FFF" size={24} />
                    </Text>
                  </View>
                  <Text style={styles.buttonText}>Explorar pequenos negócios</Text>                  
                </RectButton>
            </View>
            
        </ImageBackground> 
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Raleway_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'OpenSans_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#E55933',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
  }
});

export default Home;
