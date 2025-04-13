import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Layout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name='index' options={{
                    title: 'نظرة عامة',
                    headerTitleAlign: 'center',
                }} />
                <Stack.Screen name='VideosAnalysis' />
                <Stack.Screen name='ResultsExams' />
            </Stack>
        </SafeAreaView>
    )
}