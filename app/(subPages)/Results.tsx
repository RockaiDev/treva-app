import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ConstantStyles } from '@/constants/constantStyles'
import { useDataContext, user } from '@/components/context/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '@/components/Loading';
import LessonComponent from '@/components/elements/LessonComponent';
import { Colors } from '@/constants/Colors';

export default function Results() {
  const [user, setUser] = useState<user>()
  const { data } = useLocalSearchParams()
  const { lessons, users } = useDataContext()
  const [teacher, setTeacher] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const userExist = await AsyncStorage.getItem('user')
      if (userExist) {
        setUser(JSON.parse(userExist))
        const user = users?.find(user => user._id === JSON.parse(userExist)._id)
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user))
          setUser(user)
        }
      } else {
        router.push('/(SignIn)')
      }

    }
    fetchUser()
  }, [])






  if (!users || !lessons || !user) {
    return <Loading />
  } else {

    const teachers = users.filter(user => user.role === 'teacher')
    const TeachersChoosenSubject = teachers.filter(teacher => teacher.subject === data)

    const lessonsMatchedWithUserData = lessons.filter(lessons => {
      const matchedGrade = lessons.grade === user.grade
      const matchedSubject = !data || lessons.subject === data
      const matchedTecher = !teacher || lessons.teacher === teacher
      return  matchedGrade && matchedSubject && matchedTecher 
    })

    return (
      <ScrollView style={[ConstantStyles.page]}>
        <View>
          <Text style={[ConstantStyles.Title1, { fontSize: 26 }]}>محاضرات: {data}</Text>
          {/* length */}
          <Text style={[ConstantStyles.Title2, { fontSize: 22 }]}>عدد المحاضرات: {lessonsMatchedWithUserData.length}</Text>
        </View>

        <View style={{ marginVertical: 10 , direction: 'rtl'}}>

          <FlatList
            data={TeachersChoosenSubject}
            keyExtractor={item => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                if (teacher === item._id) {
                  setTeacher('')
                } else {
                  setTeacher(item._id)
                }
              }}>
                <View style={{ padding: 10, margin: 10, backgroundColor: teacher === item._id ? Colors.itemBgColor : Colors.calmWhite, display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: 10 }}>
                  <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                  <Text style={[ConstantStyles.Title2, { fontSize: 22 }]}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
          {lessonsMatchedWithUserData.map(lesson => (
            <LessonComponent key={lesson._id} lesson={lesson} user={user} />
          ))}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({})