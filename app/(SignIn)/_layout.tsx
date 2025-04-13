import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'

export default function Layout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='Welcome' />
      <Stack.Screen name='SignUp' />
      <Stack.Screen name='LogInScreen' />
    </Stack>
  )
}