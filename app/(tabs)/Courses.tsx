import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import { useDataContext, user } from '@/components/context/DataContext'
import { Image } from 'react-native'
import { router } from 'expo-router'
import { Fonts } from '@/constants/Fonts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LessonComponent from '@/components/elements/LessonComponent'
import Loading from '@/components/Loading'
import ExamComponent from '@/components/elements/ExamComponent'
import { Colors } from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
// import { useRealtime } from '../../contexts/RealtimeContext'

const allSubjects = [
  { image: require('../../assets/images/subjects/arabic.png'), name: 'اللغة العربية', key: 'arabic' },
  { image: require('../../assets/images/subjects/english.png'), name: 'اللغة الانجليزية', key: 'english' },
  { image: require('../../assets/images/subjects/french.png'), name: 'اللغة الفرنسية', key: 'french' },
  { image: require('../../assets/images/subjects/german.png'), name: 'اللغة الالمانية', key: 'german' },
  { image: require('../../assets/images/subjects/italy.png'), name: 'اللغة الايطالية', key: 'italy' },
  { image: require('../../assets/images/subjects/spanish.png'), name: 'اللغة الاسبانية', key: 'spanish' },
  { image: require('../../assets/images/subjects/calculating.png'), name: 'الرياضيات', key: 'math' },
  { image: require('../../assets/images/subjects/physics.png'), name: 'الفيزياء', key: 'physics' },
  { image: require('../../assets/images/subjects/chemistry.png'), name: 'الكيمياء', key: 'chemistry' },
  { image: require('../../assets/images/subjects/biology.png'), name: 'الاحياء', key: 'biology' },
  { image: require('../../assets/images/subjects/compSci.png'), name: 'علوم متكاملة', key: 'integratedScience' },
  { image: require('../../assets/images/subjects/geology.png'), name: 'الجيولوجيا', key: 'geology' },
  { image: require('../../assets/images/subjects/history.png'), name: 'التاريخ', key: 'history' },
  { image: require('../../assets/images/subjects/geography.png'), name: 'الجغرافيا', key: 'geography' },
  { image: require('../../assets/images/subjects/psychology.png'), name: 'علم النفس', key: 'psychology' },
  { image: require('../../assets/images/subjects/philosophy.png'), name: 'الفلسفة', key: 'philosophy' },
]

const getSubjectsForGrade = (grade: string, major?: string) => {
  // المواد الأساسية للصفوف الإعدادية
  const preparatorySubjects = ['arabic', 'english', 'math', 'history', 'geography']

  // المواد الأساسية للصفوف الثانوية
  const secondaryBaseSubjects = ['arabic', 'english', 'french', 'german', 'italy', 'spanish']

  // الصفوف الإعدادية (7-9)
  if (grade === 'الصف الاول الاعدادي' || grade === 'الصف الثاني الاعدادي' || grade === 'الصف الثالث الاعدادي') {
    return allSubjects.filter(subject => preparatorySubjects.includes(subject.key))
  }

  // الصف الأول الثانوي
  if (grade === 'الصف الاول الثانوي') {
    return allSubjects.filter(subject =>
      [...secondaryBaseSubjects, 'integratedScience', 'history', 'geography', 'psychology', 'math'].includes(subject.key)
    )
  }

  // الصف الثاني الثانوي
  if (grade === 'الصف الثاني الثانوي') {
    const subjects = [...secondaryBaseSubjects, 'math']

    if (major === 'علمي') {
      subjects.push('integratedScience')
    } else if (major === 'ادبي') {
      subjects.push('history', 'geography', 'philosophy', 'psychology')
    }

    return allSubjects.filter(subject => subjects.includes(subject.key))
  }

  // الصف الثالث الثانوي
  if (grade === 'الصف الثالث الثانوي') {
    const subjects = [...secondaryBaseSubjects]

    if (major === 'علمي رياضة') {
      subjects.push('physics', 'chemistry', 'math')
    } else if (major === 'علمي علوم') {
      subjects.push('physics', 'chemistry', 'biology', 'geology')
    } else if (major === 'ادبي') {
      subjects.push('history', 'geography', 'philosophy', 'psychology')
    }

    return allSubjects.filter(subject => subjects.includes(subject.key))
  }

  return allSubjects
}

export default function Courses() {
  // const { updates } = useRealtime()
  // const courses = updates.courses
  const [user, setUser] = useState<user>()
  const { users, lessons } = useDataContext()

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


  if (!users || !lessons || !user) {
    return <Loading />

  } else {

    const filteredLessons = lessons?.filter(lesson => lesson.grade === user?.grade).reverse()
    const subjects = getSubjectsForGrade(user.grade, user.major)

    const Exams = filteredLessons?.map(lesson => lesson.exam)

    return (
      <>
        <View style={{ display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: Colors.mainColor, padding: 10 }}>
          <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite }]}>المحاضرات</Text>
        </View>
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
            marginBottom: 80,
            height: '100%'
          }}
        >

          <ScrollView style={ConstantStyles.page}
            refreshControl={
              <RefreshControl
                colors={[Colors.mainColor]}
                progressBackgroundColor={Colors.bgColor}
                refreshing={false}
                onRefresh={() => fetchUser()}
              />
            }
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20, direction: 'rtl' }}>
              {subjects.map((subject, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.subject} onPress={() => {
                    router.push({
                      pathname: '/(subPages)/Results',
                      params: {
                        data: subject.name
                      }
                    })
                  }}>
                    <View style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: Colors.calmWhite, justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={subject.image} style={styles.subjectImage} />
                    </View>
                    <Text style={styles.subjectText}>{subject.name}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            {/* last Lessons */}
            <Text style={[ConstantStyles.Title1, { marginTop: 20 }]}>اخر المحاضرات</Text>
            <View style={{ display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 80 }}>
              {filteredLessons?.map((lesson, index) => {
                return (
                  <LessonComponent key={index} lesson={lesson} user={user} />
                )
              }).slice(0, 9).reverse()}
            </View>

            {/* last Exams
        <Text style={[ConstantStyles.Title2, { marginTop: 20 }]}>اخر الامتحانات</Text>
        <View style={{display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          {filteredLessons?.map((lesson, index) => (
            <View key={index} style={{display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              {lesson.exam && <ExamComponent key={index} lesson={lesson} user={user} />}
            </View>
          )) }
          </View>
          */}
          </ScrollView>
        </LinearGradient>
      </>
    )
  }
}

const styles = StyleSheet.create({
  subject: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subjectImage: {
    width: 30,
    height: 30,
  },
  subjectText: {
    marginTop: 5,
    fontSize: 13,
    fontFamily: Fonts.mediumText
  }
})