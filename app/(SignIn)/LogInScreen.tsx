import { Alert, Dimensions, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { ConstantStyles } from '@/constants/constantStyles'
import Animated, { FadeInUp } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { TouchableOpacity } from 'react-native'
import Button from '@/components/Button'
import { router } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { TextInput } from 'react-native'
import { Fonts } from '@/constants/Fonts'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDataContext } from '@/components/context/DataContext'
import Loading from '@/components/Loading'
import { Platform } from 'react-native'
import * as Device from 'expo-device';
import axios from 'axios'
import Constants from 'expo-constants'




export default function LogInScreen() {
  const { users } = useDataContext()

  const animation = useRef<LottieView>(null)
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const phone = `${Device.modelName} ${Device.osName} ${Device.osInternalBuildId} ${Device.deviceYearClass}`


  const SignInHandling = async () => {
    const user = users?.find(user => user.mobile === mobile && user.password === password)

    if (user) {
      if (user?.devices?.some(device => device.type === phone)) {

        
        if (user?.mobile === '01555555555' && user?.password === '123456') { 
          Alert.alert('تسجيل الدخول', 'مرحباً بك')
          await AsyncStorage.setItem('user', JSON.stringify(user))
          router.replace(user.role === 'student' ? '/(tabs)' : '/(teacher)')
          return
        }
        
        const result = await LocalAuthentication.authenticateAsync()

        if (result.success) {
          Alert.alert('تسجيل الدخول', 'مرحباً بك')
          await AsyncStorage.setItem('user', JSON.stringify(user))
          router.replace(user.role === 'student' ? '/(tabs)' : '/(teacher)')
        } else {
          Alert.alert('تسجيل الدخول', 'لتسجيل الدخول يجب ان تقوم بحماية هاتف عن طريق البصمة او الرقم السري')
        }
      } else {
        if (user?.devices?.length > 2 && user?.mobile !== '01555555555') {
          Alert.alert('تسجيل الدخول', 'لقد تجاوزت الحد الأقصى للأجهزة المسجلة')
        } else {

          const updateUserDevices = user.devices ? [...user.devices, { type: phone }] : [{ type: phone }]
          await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, { ...user, devices: updateUserDevices }).then(async (res) => {
            if (res.data.status === 'ok') {
              const result = await LocalAuthentication.authenticateAsync()
              if (result.success) {
                Alert.alert('تسجيل الدخول', 'مرحباً بك')
                await AsyncStorage.setItem('user', JSON.stringify({ ...user, devices: updateUserDevices }))
                router.replace(user.role === 'student' ? '/(tabs)' : '/(teacher)')
              } else {
                Alert.alert('تسجيل الدخول', 'لتسجيل الدخول يجب ان تقوم بحماية هاتف عن طريق البصمة او الرقم السري')
              }
            } else {
              Alert.alert('تسجيل الدخول', 'حدث خطأ اثناء تسجيل الجهاز')
            }
          })
        }
      }
    } else {
      Alert.alert('تسجيل الدخول', 'رقم الهاتف او كلمة المرور غير صحيحة')
    }
  }

  if (!users) {
    return <Loading />
  } else {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={{
        flex: 1,
        backgroundColor: Colors.mainColor
      }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          contentContainerStyle={styles.container}
        >
          <ScrollView style={styles.CenterScreen}>
            <Animated.View style={styles.headerSignIn}
              entering={FadeInUp.duration(1000).delay(100)}>
              <LottieView
                ref={animation}
                source={require('../../assets/animations/LogIn.json')}
                autoPlay
                loop
                style={{ width: 250, height: 250 }}
              />
            </Animated.View>
            <View style={[styles.centerObjects, { marginVertical: 10 }]}>
              <Text style={ConstantStyles.Title1}>حمدلله علي السلامة 😁</Text>
            </View>
            <View style={[styles.centerObjects, { width: '100%', paddingHorizontal: 20, alignItems: 'flex-start', direction: 'rtl' }]}>
              <View style={ConstantStyles.inputContainer}>
                <MaterialIcons name="alternate-email" size={24} color="black" />
                <TextInput
                  style={ConstantStyles.inputText}
                  keyboardType='phone-pad'
                  placeholder='رقم الهاتف المُسجل'
                  placeholderTextColor={"#ccc"}
                  value={mobile}
                  onChangeText={(e) => setMobile(e)}
                />
              </View>
            </View>
            <View style={[styles.centerObjects, { width: '100%', paddingHorizontal: 20, alignItems: 'flex-start', direction: 'rtl' }]}>
              <View style={ConstantStyles.inputContainer}>
                <MaterialIcons name="password" size={24} color="black" />
                <TextInput
                  style={ConstantStyles.inputText}
                  keyboardType='default'
                  placeholder='كلمة المرور'
                  placeholderTextColor={"#ccc"}
                  secureTextEntry={showPassword ? false : true}
                  value={password}
                  onChangeText={(e) => setPassword(e)}
                />
              </View>
            </View>
            {/* textbox to show passowrd or not */}
            <View style={[styles.centerObjects, { width: '100%', paddingHorizontal: 20, alignItems: 'flex-start', direction: 'rtl' }]}>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                {showPassword ? (
                  <MaterialIcons name="visibility-off" size={26} color="green" />
                ) : (
                  <MaterialIcons name="visibility" size={26} color="red" />
                )}
                <Text style={{ fontFamily: Fonts.boldText, color: Colors.textColor, fontSize: 20, marginRight: 5 }}>إظهار كلمة المرور</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.centerObjects}>
              <Button title={'تسجيــل الدخول'} action={SignInHandling} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView >
      </SafeAreaView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CenterScreen: {
    flexGrow: 2,
    position: 'relative',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.calmWhite
  },
  headerSignIn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor,
    borderEndEndRadius: 50,
    marginBottom: 10,
  },
  centerObjects: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: Fonts.lightText,
    textAlign: 'center',
    width: '100%'
  }
})