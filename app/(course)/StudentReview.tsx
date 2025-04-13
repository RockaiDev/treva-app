import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import { router, Stack } from 'expo-router'
import { user } from '@/components/context/DataContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors } from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function StudentReview() {
  const [user, setUser] = useState<user>()

  useEffect(() => {
    const fetchUser = async () => {
      const userExist = await AsyncStorage.getItem('user')
      if (userExist) {
        setUser(JSON.parse(userExist))
      } else {
        router.push('/(SignIn)')
      }

    }
    fetchUser()
  }, [])

  return (
    <>
      <Stack.Screen options={{
        title: "مراجعة درجات الطالب"
      }} />
      <ScrollView style={[ConstantStyles.page, { direction: 'ltr' }]}>
        <Text style={ConstantStyles.Title1}>الامتحانات</Text>
        <Text style={ConstantStyles.normalText}>الامتحانات التي تمت اجابتها: {user?.exams.length} امتحان</Text>
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
          {user?.exams.map((exam, index) => (
            <TouchableOpacity key={index} onPress={() => router.navigate({
              pathname: '/(subPages)/reviewExam',
              params: {
                exam: JSON.stringify(exam)
              }
            })}
              style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: 10,
              margin: 5,
              backgroundColor: Colors.calmWhite,
              borderRadius: 10,
              direction: 'rtl'
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 10
              }}>
                <MaterialCommunityIcons name="ab-testing" size={30} color={Colors.mainColor} />
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
                <Text style={[ConstantStyles.Title3]}>{exam.title.split(' ').slice(0,6).join(' ')}..</Text>
                <Text style={ConstantStyles.normalText}>الدرجة: {exam.totalPoints}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>

  )
}

const styles = StyleSheet.create({})