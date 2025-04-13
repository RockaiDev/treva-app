import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { BounceInUp, FadeInDown, FadeInUp, SlideInUp, ZoomInUp } from 'react-native-reanimated'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import LottieView from 'lottie-react-native'
import { ConstantStyles } from '@/constants/constantStyles'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import { Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons'
import { Fonts } from '@/constants/Fonts'
import axios from 'axios'
import Constants from 'expo-constants'



export default function SignUp() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const animation = useRef<LottieView>(null)
  const role = 'student'
  const SignUpHandling = async () => {
    if (confirmPassword !== password) {
      alert('Password Must Be Similar')
      return
    }
    try {
      axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/register`, { name, username, mobile, password, role })
        .then(res => {
          if (res.data.status == 'ok') {
            alert('User Registered Successfully')
            router.push('/LogInScreen')
          } else {
            alert('User Already Exist')
          }
        })
        .catch(err => alert(err))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{
      flex: 1,
      backgroundColor: Colors.mainColor,
    }}>
      <StatusBar barStyle='light-content' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        contentContainerStyle={styles.container}
      >

        <ScrollView style={styles.CenterScreen}>
          <Animated.View style={styles.headerSignIn}
            entering={FadeInUp.duration(1000).delay(100)}>
            <LottieView
              ref={animation}
              source={require('../../assets/animations/SignUp.json')}
              autoPlay
              loop
              style={{ width: 250, height: 250 }}
            />
          </Animated.View>
          <View style={[styles.centerObjects, { marginVertical: 10 }]}>
            <Text style={ConstantStyles.Title1}>تسجيل دخول لاول مرة</Text>
          </View>
          <View style={[styles.centerObjects, { width: '100%', paddingHorizontal: 20, alignItems: 'flex-start', direction: 'rtl' }]}>
            <View style={ConstantStyles.inputContainer}>
              <Ionicons name="person-circle-outline" size={24} color="black" />
              <TextInput
                style={ConstantStyles.inputText}
                keyboardType="default"
                placeholder='اسمك بالعربي'
                placeholderTextColor={"#ccc"}
                defaultValue=''
                value={name}
                onChangeText={(e) => setName(e)}
              />
            </View>
          </View>
          <View style={[styles.centerObjects, { width: '100%', paddingHorizontal: 20, alignItems: 'flex-start', direction: 'rtl' }]}>
            <View style={ConstantStyles.inputContainer}>
              <MaterialIcons name="alternate-email" size={24} color="black" />
              <TextInput
                style={ConstantStyles.inputText}
                keyboardType="default"
                placeholder='اسم المستخدم بالانجليزية'
                placeholderTextColor={"#ccc"}
                value={username}
                onChangeText={(e) => setUsername(e)}
              />
            </View>
          </View>
          <View style={[styles.centerObjects, { width: '100%', paddingHorizontal: 20, alignItems: 'flex-start', direction: 'rtl' }]}>
            <View style={ConstantStyles.inputContainer}>
              <Octicons name="device-mobile" size={24} color="black" />
              <TextInput
                style={ConstantStyles.inputText}
                keyboardType="phone-pad"
                placeholder='رقم الهاتف'
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
                defaultValue=''
                secureTextEntry={true}
                value={password}
                onChangeText={(e) => setPassword(e)}
              />
            </View>
          </View>
          <View style={[styles.centerObjects, { width: '100%', paddingHorizontal: 20, alignItems: 'flex-start', direction: 'rtl' }]}>
            <View style={ConstantStyles.inputContainer}>
              <MaterialIcons name="password" size={24} color="black" />
              <TextInput
                style={ConstantStyles.inputText}
                keyboardType='default'
                placeholder='تأكيد كلمة المرور'
                placeholderTextColor={"#ccc"}
                defaultValue=''
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(e) => setConfirmPassword(e)}
              />
            </View>
          </View>
          <View style={[styles.centerObjects, { paddingBottom: 50 }]}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title={'تسجيــل'} action={SignUpHandling} />
            <Text style={ConstantStyles.normalText}>بالفعل لديك حساب ؟ <Link style={{ color: Colors.mainColor, fontFamily: Fonts.boldText }} href={'/LogInScreen'}>تسجيل دخول</Link></Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.calmWhite
  },
  CenterScreen: {
    flexGrow: 2,
    position: 'relative',
    width: Dimensions.get('window').width,
    backgroundColor: Colors.calmWhite,
  },
  headerSignIn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor,
    borderBottomStartRadius: 50,
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