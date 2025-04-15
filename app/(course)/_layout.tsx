import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name='[id]' />
      <Stack.Screen name='Exam' />
      <Stack.Screen name='examVideo' />
      <Stack.Screen name='explainVideo' />
      <Stack.Screen name='HWReview' />
      <Stack.Screen name='StudentReview' />
    </Stack>
  )
}