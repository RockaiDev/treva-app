import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import Animated, { ZoomInEasyUp, ZoomOutEasyDown } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Updates from 'expo-updates';
import { router } from 'expo-router'
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import { LinearGradient } from 'expo-linear-gradient'
import Constants from 'expo-constants'

export default function Profile() {
    const [user, setUser] = useState<any>()
    const name = user ? user.name : 'مجهول'
    const grade = user ? user.grade : 'غير محدد'
    const major = user ? user.major : 'غير محدد'

    const fetchUser = async () => {
        const userExist = await AsyncStorage.getItem('user')
        if (userExist) {
            setUser(JSON.parse(userExist))
        } else {
            router.push('/(SignIn)')
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])

    // Logout
    const Logout = async () => {
        const Confirm = Alert.alert('تسجيل الخروج', 'هل تريد تسجيل الخروج؟', [
            {
                text: 'نعم',
                onPress: async () => {
                    await AsyncStorage.removeItem('user')
                    await Updates.reloadAsync()
                }
            },
            {
                text: 'لا',
                style: 'cancel'
            }
        ])
    }



    return (
        <>
            <LinearGradient
                colors={[Colors.bgColor, Colors.itemBgColor, Colors.bgColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    direction: 'rtl',
                    padding: 10,
                    width: '100%',
                    backgroundColor: Colors.mainColor,
                }}>
                    <TouchableOpacity onPress={() => router.navigate('/(subPages)/EditUser')} style={styles.editIcon}>
                        <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite }]}>الملف الشخصي</Text>
                        <FontAwesome5 name="user-edit" size={24} color={Colors.calmWhite} />
                    </TouchableOpacity>
                    <View className='flex items-center justify-center w-full border-gray-200 py-5' style={{
                        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'ltr',
                        padding: 10, backgroundColor: Colors.mainColor, borderRadius: 10, marginBottom: 10, borderColor: Colors.calmWhite
                    }}>
                        <Animated.View
                            entering={ZoomInEasyUp.duration(500).delay(100).springify()}
                        >
                            <Image style={{
                                width: 100,
                                height: 100,
                                borderRadius: 100,
                                overflow: 'hidden',
                                borderWidth: 2,
                                borderColor: Colors.calmWhite,
                                marginBottom: 10,
                                backgroundColor: Colors.calmWhite,
                                padding: 5,
                            }} source={{ uri: user?.image || 'https://res.cloudinary.com/db152mwtg/image/upload/v1743082693/Treva%20Edu%20App/users/tvcrzrw1taqco4d6hpfy.png' }} width={100} height={100} />
                        </Animated.View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            direction: 'rtl',
                            width: '100%',
                            marginBottom: 10
                        }}>
                            <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite }]}>{name}</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            width: '100%',
                            direction: 'rtl',
                        }}>
                            <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite, marginBottom: 0, paddingBottom: 0 }]}>{grade}</Text>
                            <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite, marginBottom: 0, paddingBottom: 0 }]}>الشعبة/ {major}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={[Colors.mainColor]}
                            progressBackgroundColor={Colors.bgColor}
                            refreshing={false}
                            onRefresh={() => fetchUser()}
                        />
                    }
                    style={[ConstantStyles.page]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* More */}

                    <TouchableOpacity style={styles.buttonProfile} onPress={() => router.navigate('/(subPages)/EditUser')}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.IconForPage}>
                                <AntDesign name="edit" size={18} color={Colors.calmWhite} />
                            </View>
                            <Text style={styles.textBtnProfile}>تعديل البيانات</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonProfile} onPress={() => router.navigate("/(subPages)/paidCourses")}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.IconForPage}>
                                <AntDesign name="book" size={18} color={Colors.calmWhite} />
                            </View>
                            <Text style={styles.textBtnProfile}>دروس قمت بشرائها</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonProfile} onPress={() => router.navigate('/(course)/StudentReview')}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.IconForPage}>
                                <AntDesign name="filetext1" size={18} color={Colors.calmWhite} />
                            </View>
                            <Text style={styles.textBtnProfile}>الامتحانات</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonProfile} onPress={() => router.navigate('/(tabs)/Wallet')}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.IconForPage}>
                                <AntDesign name="creditcard" size={18} color={Colors.calmWhite} />
                            </View>
                            <Text style={styles.textBtnProfile}>المدفوعات</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonProfile} onPress={() => router.navigate('/(subPages)/About')}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.IconForPage}>
                                <AntDesign name="questioncircle" size={18} color={Colors.calmWhite} />
                            </View>
                            <Text style={styles.textBtnProfile}>عن تريڤا</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonProfile} onPress={() => router.navigate('/(subPages)/Contact')}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.IconForPage}>
                                <AntDesign name="contacts" size={18} color={Colors.calmWhite} />
                            </View>
                            <Text style={styles.textBtnProfile}>تواصل معنا</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonProfile} onPress={() => Logout()}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.IconForPage}>
                                <AntDesign name="logout" size={18} color={Colors.calmWhite} />
                            </View>
                            <Text style={styles.textBtnProfile}>تسجيل خروج</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.textColor} />
                    </TouchableOpacity>
                    {/* Version and Copyrights */}
                    <Text style={[ConstantStyles.normalText, { textAlign: 'center', marginTop: 20, color: 'gray' }]}>الاصدار 2.6.1</Text>
                    <Text style={[ConstantStyles.normalText, { textAlign: 'center', marginBottom: 200, color: 'gray' }]}>جميع الحقوق محفوظة لتريڤا</Text>
                </ScrollView>
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    editIcon: {
        zIndex: 100,
        direction: 'rtl',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    IconForPage: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: Colors.mainColor,
        color: Colors.calmWhite,
    },
    buttonProfile: {
        backgroundColor: Colors.calmWhite,
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        direction: 'rtl'
    },
    textBtnProfile: {
        color: Colors.textColor,
        fontFamily: Fonts.boldText,
        fontSize: 20,
        marginRight: 10,
    }
})