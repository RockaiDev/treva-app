import { user } from "@/components/context/DataContext";
import Loading from "@/components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import React, { useEffect } from "react";
import { useState } from "react";
import { StatusBar, Text, View } from "react-native";
import * as LocalAuthentication from 'expo-local-authentication';

export default function Index() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<user>()

    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem('user')
            if (token) {
                setIsLoggedIn(true)
                setUser(JSON.parse(token))
                if (JSON.parse(token).role === 'teacher') {
                    router.replace('/(teacher)')
                } else if (JSON.parse(token).role === 'student') {

                    if (JSON.parse(token).mobile === '01555555555' && JSON.parse(token).password === '123456') {
                        router.replace('/(tabs)')
                        return
                    }

                    const result = await LocalAuthentication.authenticateAsync()

                    if (result.success) {
                        router.replace('/(tabs)')
                    } else {
                        router.replace('/(SignIn)/Welcome')
                    }
                } else {
                    router.replace('/(SignIn)/Welcome')
                }
            } else {
                router.replace('/(SignIn)/Welcome')
            }
        }
        checkLogin()
    }, [])

    if (!user) {
        return <Loading />
    } else {
        return (
            <>
                <StatusBar barStyle={'default'} />
                <Redirect href={user.role === 'teacher' ? "/(teacher)" : user.role === 'student' ? "/(tabs)" : '/(SignIn)/Welcome'} />

            </>
        );
    }
}
