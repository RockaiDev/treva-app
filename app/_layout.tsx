import { SplashScreen, Stack } from "expo-router";
import React from 'react'
import { useFonts } from 'expo-font'
import { useEffect } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import DataProvider from "@/components/context/DataContext";
import { usePreventScreenCapture } from 'expo-screen-capture';
import { I18nManager } from "react-native";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false); 

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  usePreventScreenCapture()
  const insets = useSafeAreaInsets()

  const [loaded] = useFonts({
    'Beiruti-Black': require('../assets/fonts/Beiruti-Black.ttf'),
    'Beiruti-Bold': require('../assets/fonts/Beiruti-Bold.ttf'),
    'Beiruti-Medium': require('../assets/fonts/Beiruti-Medium.ttf'),
    'Beiruti-Regular': require('../assets/fonts/Beiruti-Regular.ttf'),
    'Beiruti-Light': require('../assets/fonts/Beiruti-Light.ttf'),  
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }

  }, [loaded])


  if (!loaded) {
    return null
  }

  return (
    <>
      <SafeAreaProvider>
        <DataProvider>

          <Stack screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="index" />

            <Stack.Screen name="(SignIn)" options={{
              title: 'Registration',
            }} />

            <Stack.Screen name="(tabs)" options={{
              title: 'Home',
            }} />

            <Stack.Screen name="(subPages)" options={{
              title: 'Home',
            }} />
          </Stack>
        </DataProvider>
      </SafeAreaProvider>
    </>
  )
}
