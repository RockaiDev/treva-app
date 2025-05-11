import { SplashScreen, Stack } from "expo-router";
import React from 'react'
import { useFonts } from 'expo-font'
import { useEffect } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import DataProvider from "@/components/context/DataContext";
import { I18nManager } from "react-native";
// import { RealtimeProvider } from '../contexts/RealtimeContext';
// import { requestNotificationPermissions } from '../services/notifications';
// import { addNotificationResponseListener, addNotificationReceivedListener } from '../services/notifications';

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
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

    // // Request notification permissions
    // requestNotificationPermissions();

    // // Set up notification listeners
    // const responseSubscription = addNotificationResponseListener((response) => {
    //   const data = response.notification.request.content.data;
    //   // Handle notification response (e.g., navigate to specific screen)
    //   console.log('Notification response:', data);
    // });

    // const receivedSubscription = addNotificationReceivedListener((notification) => {
    //   console.log('Notification received:', notification);
    // });

    // // Clean up listeners
    // return () => {
    //   responseSubscription.remove();
    //   receivedSubscription.remove();
    // };
  }, [loaded])


  if (!loaded) {
    return null
  }

  return (
    // <RealtimeProvider>
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

            <Stack.Screen name="(course)" options={{ headerShown: false }} />
            <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
          </Stack>
        </DataProvider>
      </SafeAreaProvider>
    // </RealtimeProvider>
  )
}
