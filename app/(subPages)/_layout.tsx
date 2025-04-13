import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

export default function Layout() {
  return (
    <Stack screenOptions={{
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 20, width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
        >
          <AntDesign name="back" size={24} color="black" />
        </TouchableOpacity>
      )
    }}>
      <Stack.Screen name='index'
        options={{
          title: "الرئيسية",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name='Contact'
        options={{
          title: "التواصل",
          headerTitleAlign: 'center',

        }}
      />
      <Stack.Screen name='Payment'
        options={{
          title: "الدفع",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name='Results'
        options={{
          title: "نتائج",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name='EditUser'
        options={{
          title: "تعديل المستخدم",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name='search'
        options={{
          headerShown: false
        }} />
      <Stack.Screen name='Leaderboard'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name='About'
        options={{
          title: 'عن المنصة'
        }}
      />
    </Stack>
  )
}