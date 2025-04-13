import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import Button from '@/components/Button'
import { router } from 'expo-router'
import Animated, { FadeInDown, RotateInDownLeft } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'

export default function Welcome() {
  const animation = useRef<LottieView>(null)


  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{
      flex: 1,
      backgroundColor: Colors.calmWhite,
    }}>
      <View style={[styles.CenterScreen, { backgroundColor: Colors.calmWhite }]}>
        <Animated.View entering={FadeInDown.duration(500).delay(1000).springify()}>
          <LottieView
            ref={animation}
            source={require('../../assets/animations/WelcomBooks.json')}
            autoPlay
            loop
            style={{width: 300 , height: 300}}
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(500).delay(1300).springify()}>
          <Text style={[ConstantStyles.Title1, { textAlign: 'center', marginVertical: 10, fontSize: 38, color: Colors.textColor }]}>رحلة الثانوية العامة محتاجة رفيق، و <Text style={{ color: Colors.mainColor, fontSize: 44 }}>Treva</Text> هيكون رفيقك في الرحلة دي خطوة بخطوة.</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(500).delay(1600).springify()}>
          <Text style={[ConstantStyles.Title3, { color: Colors.mainColor }]} >جاهز عشان تكون من الأوائل ؟</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(500).delay(1900).springify()}>
          <Button title={'يلا بينا'} action={() => router.push('/SignUp')} />
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  CenterScreen: {
    flex: 1,
    padding: 10,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
})