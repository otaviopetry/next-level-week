import React from 'react';

import { AppLoading } from 'expo';
import { StatusBar, View } from 'react-native';

import { Raleway_700Bold } from '@expo-google-fonts/raleway';
import { OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_400Regular_Italic, useFonts } from '@expo-google-fonts/open-sans';

import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway_700Bold,
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );
}