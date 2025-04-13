import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDataContext } from '@/components/context/DataContext'
import Loading from '@/components/Loading'
import { ConstantStyles } from '@/constants/constantStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors } from '@/constants/Colors'
import LottieView from 'lottie-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { SlideInDown } from 'react-native-reanimated'

export default function Leaderboard() {
  const [user, setuser] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('user')
      if (user) {
        setuser(JSON.parse(user))
      }
    }
    fetchUser()
  }, [])

  const { users } = useDataContext()

  if (!users || !user) {
    return <Loading />
  } else {

    const students = users.filter((user: any) => user.role === 'student')

    const studentScore = (student: any) => {
      let score = 0

      student.videos.forEach((video: any) => {
        score += 25
      })

      student.exams.forEach((exam: any) => {
        score += +exam.totalPoints
      })

      return score

    }

    students.sort((a, b) => studentScore(b) - studentScore(a))

    return (
      <>
        <LinearGradient style={[ConstantStyles.page, { justifyContent: 'flex-end', alignItems: 'center', backgroundColor: Colors.itemBgColor, height: Dimensions.get('screen').height, padding: 10, paddingVertical: 50 }]}
          colors={[Colors.bgColor ,Colors.itemBgColor, Colors.bgColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            source={require('../../assets/images/circlesBG.png')}
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height,
              position: 'absolute',
              top: 0,
              zIndex: 0,
            }}
          />
          <View style={{
            width: '100%',
            height: 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            zIndex: 100,
          }}>
            <LottieView
              source={require('../../assets/animations/party.json')}
              autoPlay
              loop
              style={{ width: 300, height: 300, alignSelf: 'center' }}
            />
          </View>
          <Text style={[ConstantStyles.Title1, { color: Colors.textColor }]}>الترتيب</Text>

          <View style={{
            width: '100%',
            height: 180,
            marginTop: 50,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
            <Animated.View
              entering={SlideInDown.duration(1000).delay(100)}
              style={{
                width: `${100 / 3}%`,
                height: '60%',
                backgroundColor: Colors.textColor,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                borderWidth: 1,
                borderColor: Colors.itemBgColor,
              }}>
              <View style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image source={{ uri: students[2].image ? students[2].image : 'https://res.cloudinary.com/db152mwtg/image/upload/v1734695620/Treva%20Edu%20App/users/tx4dze4uiwb1in8hkz0z.png' }} style={{ width: 50, height: 50, borderRadius: 25, position: 'absolute', top: -25, backgroundColor: Colors.itemBgColor, borderWidth: 1, borderColor: Colors.itemBgColor }} />
                <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{students[2].name}</Text>
                <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{studentScore(students[2])} - 3rd</Text>

              </View>
            </Animated.View>
            <Animated.View
              entering={SlideInDown.duration(1000).delay(500)}
              style={{
                width: `${100 / 3}%`,
                height: '80%',
                backgroundColor: Colors.textColor,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                borderWidth: 1,
                borderColor: Colors.itemBgColor,
              }}>
              <View style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image source={{ uri: students[1].image ? students[1].image : 'https://res.cloudinary.com/db152mwtg/image/upload/v1734695620/Treva%20Edu%20App/users/tx4dze4uiwb1in8hkz0z.png' }} style={{ width: 60, height: 60, borderRadius: 30, position: 'absolute', top: -30, backgroundColor: Colors.itemBgColor, borderWidth: 1, borderColor: Colors.itemBgColor }} />
                <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{students[1].name}</Text>
                <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{studentScore(students[1])} - 2nd</Text>
              </View>
            </Animated.View>
            <Animated.View
              entering={SlideInDown.duration(1000).delay(1000)}
              style={{
                width: `${100 / 3}%`,
                height: '100%',
                backgroundColor: Colors.textColor,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                borderWidth: 1,
                borderColor: Colors.itemBgColor,
              }}>
              <View style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image source={{ uri: students[0].image ? students[0].image : 'https://res.cloudinary.com/db152mwtg/image/upload/v1734695620/Treva%20Edu%20App/users/tx4dze4uiwb1in8hkz0z.png' }} style={{ width: 70, height: 70, borderRadius: 35, position: 'absolute', top: -35, backgroundColor: Colors.itemBgColor, borderWidth: 1, borderColor: Colors.itemBgColor }} />
                <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{students[0].name}</Text>
                <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{studentScore(students[0])} - 1st</Text>

              </View>
            </Animated.View>
          </View>

          <View style={{ width: '100%', padding: 10, height: Dimensions.get('screen').height * 0.4, backgroundColor: Colors.textColor, borderRadius: 10, marginTop: 5 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: Colors.bgColor }}>
              <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite, paddingVertical: 10 }]}>الترتيب</Text>
              <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite, paddingVertical: 10 }]}>الاسم</Text>
              <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite, paddingVertical: 10 }]}>النقاط</Text>
            </View>

            <ScrollView style={{ width: '100%', padding: 10, height: Dimensions.get('screen').height * 0.5 }}>
              {students.map((user, index) => (
                <View key={index} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 10 }}>
                  <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{index + 1}</Text>
                  <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{user.name}</Text>
                  <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>{studentScore(user)}</Text>
                </View>
              )).slice(3, students.length)}

            </ScrollView>
          </View>
        </LinearGradient>
      </>
    )
  }
}

const styles = StyleSheet.create({})