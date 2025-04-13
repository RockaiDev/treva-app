import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={{
            flex: 1,
            backgroundColor: Colors.mainColor,
        }}>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    gap: 10,
                    direction: 'rtl',
                    backgroundColor: Colors.calmWhite,
                    paddingBottom: 10,
                    height: 75,
                },
                tabBarLabelStyle: {
                    marginTop: 5,
                    fontFamily: Fonts.boldText,
                    fontSize: 14,
                    textAlign: 'center'
                }
            }}>
                <Tabs.Screen name='index' options={{
                    title: 'الرئيسية',
                    tabBarActiveTintColor: Colors.mainColor,
                    tabBarInactiveBackgroundColor: Colors.calmWhite,
                    tabBarActiveBackgroundColor: Colors.calmWhite,
                    tabBarInactiveTintColor: Colors.textColor,
                    tabBarHideOnKeyboard: true,
                    tabBarAllowFontScaling: true,
                    tabBarIcon: ({ color }) => <AntDesign name="home" size={30} color={color} />
                }} />
                <Tabs.Screen name='Courses' options={{
                    title: 'المحاضرات',
                    tabBarActiveTintColor: Colors.mainColor,
                    tabBarInactiveBackgroundColor: Colors.calmWhite,
                    tabBarActiveBackgroundColor: Colors.calmWhite,
                    tabBarInactiveTintColor: Colors.textColor,
                    tabBarHideOnKeyboard: true,
                    tabBarAllowFontScaling: true,
                    tabBarIcon: ({ color }) => <Ionicons name="logo-electron" size={30} color={color} />
                }} />
                <Tabs.Screen name='Wallet' options={{
                    title: 'المحفظة',
                    tabBarActiveTintColor: Colors.mainColor,
                    tabBarInactiveBackgroundColor: Colors.calmWhite,
                    tabBarActiveBackgroundColor: Colors.calmWhite,
                    tabBarInactiveTintColor: Colors.textColor,
                    tabBarHideOnKeyboard: true,
                    tabBarAllowFontScaling: true,
                    tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={30} color={color} />
                }} />
                <Tabs.Screen name='Profile' options={{
                    title: 'بياناتـــك',
                    tabBarActiveTintColor: Colors.mainColor,
                    tabBarInactiveBackgroundColor: Colors.calmWhite,
                    tabBarActiveBackgroundColor: Colors.calmWhite,
                    tabBarInactiveTintColor: Colors.textColor,
                    tabBarHideOnKeyboard: true,
                    tabBarAllowFontScaling: true,
                    tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={30} color={color} />
                }} />
            </Tabs>
        </SafeAreaView>
    )
}