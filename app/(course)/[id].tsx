import { Alert, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { AntDesign, Feather, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { ConstantStyles } from '@/constants/constantStyles'
import { Fonts } from '@/constants/Fonts'
import { useDataContext } from '@/components/context/DataContext'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '@/components/Loading'
import Constants from 'expo-constants'

export default function Course() {
  const { id, lesson, user } = useLocalSearchParams()
  const { users, lessons } = useDataContext()
  const [hasLesson, setHasLesson] = useState(false)

  const userData = Array.isArray(user) ? JSON.parse(user[0]) : JSON.parse(user)
  const lessonData = lessons?.find(lesson => lesson._id === id)

  const MonthlyPaymentBills = userData.bills.filter((bill: any) => {
    const billDate = typeof (bill.date) === 'string' ? null : bill
    return billDate
  })

  useEffect(() => {
    // check if user has this lesson and if the available time for this lesson is not expired
    if (userData.lessons.find((les: any) => les._id === lessonData?._id) || userData.type === 'TrevaIn') {
      if (userData.type === 'TrevaIn') {
        if (MonthlyPaymentBills[MonthlyPaymentBills.length - 1]?.date !== undefined) {
          const lastBill = MonthlyPaymentBills[MonthlyPaymentBills.length - 1]
          if (new Date(lastBill.date).getTime() + (30 * 24 * 60 * 60 * 1000) > Date.now() && lastBill.cost >= 400) {
            setHasLesson(true)
          } else {
            Alert.alert('يجب عليك دفع الاشتراك الشهري لطلاب المعهد', ' قيمة الاشتراك 400 جنية مصري شهرياً', [
              {
                text: 'دفع الاشتراك',
                onPress: () => {
                  router.push('/(tabs)/Wallet')
                }
              },
              {
                text: 'الغاء',
                onPress: () => { }
              }
            ])
            setHasLesson(false)
          }
        } else {
          Alert.alert('يجب عليك دفع الاشتراك الشهري لطلاب المعهد', ' قيمة الاشتراك 400 جنية مصري شهرياً', [
            {
              text: 'دفع الاشتراك',
              onPress: () => {
                router.push('/(tabs)/Wallet')
              }
            },
            {
              text: 'الغاء',
              onPress: () => { }
            }
          ])
          setHasLesson(false)
        }
      } else {
        const lessonwithDate = userData.lessons.find((les: any) => les._id === lessonData?._id)
        if (lessonwithDate.date + +(lessonData?.availableFor ?? 0) * 24 * 60 * 60 * 1000 < Date.now()) {
          Alert.alert('انتهت صلاحية المحاضرة', 'لقد انتهت صلاحية المحاضرة يرجى شراء المحاضرة للوصول اليها')
          setHasLesson(false)
        } else {
          setHasLesson(true)
        }
      }
    } else {
      setHasLesson(false)
    }

  }, [])


  // Techer Data from lessonData
  const techerData = users?.find(user => user.name === lessonData?.teacher)

  // update user Data with new video in database
  const updateExplainVideo = async (video: { title: any }) => {
    if (!hasLesson || userData.videos.find((video: { title: string }) => video.title === lessonData?.explainVideo.title)) {
      router.push({
        pathname: '/(course)/explainVideo',
        params: {
          lesson: JSON.stringify(lessonData),
          user: JSON.stringify(userData)
        }
      })
    } else {

      if (userData.type === 'TrevaIn' && userData.lessons.find((les: any) => les._id === lessonData?._id) === undefined) {
        router.push({
          pathname: '/(course)/explainVideo',
          params: {
            lesson: JSON.stringify(lessonData),
            user: JSON.stringify(userData)
          }
        })
      } else {
        const updatedUser = { ...userData, videos: [...userData.videos, video] }
        try {
          await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, updatedUser)
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
          alert('تم اضافة الفيديو بنجاح')
          router.push({
            pathname: '/(course)/explainVideo',
            params: {
              lesson: JSON.stringify(lessonData),
              user: JSON.stringify(userData)
            }
          })
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  const updateHomeWorkVideo = async (video: { title: any }) => {
    if (!hasLesson || userData.videos.find((video: { title: string }) => video.title === lessonData?.homeWorkVideo.title)) {
      router.push({
        pathname: '/(course)/HWReview',
        params: {
          lesson: JSON.stringify(lessonData),
          user: JSON.stringify(userData)
        }
      })
    } else {
      const updatedUser = { ...userData, videos: [...userData.videos, video] }
      await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, updatedUser).then(res => {
        AsyncStorage.setItem('user', JSON.stringify(updatedUser))
        alert('تم اضافة الفيديو بنجاح')
        router.push({
          pathname: '/(course)/HWReview',
          params: {
            lesson: JSON.stringify(lessonData),
            user: JSON.stringify(userData)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }

  }
  const updateExamVideo = async (video: { title: any }) => {
    if (!hasLesson || userData.videos.find((video: { title: string }) => video.title === lessonData?.examVideo.title)) {
      router.push({
        pathname: '/(course)/examVideo',
        params: {
          lesson: JSON.stringify(lessonData),
          user: JSON.stringify(userData)
        }
      })
    } else {
      const updatedUser = { ...userData, videos: [...userData.videos, video] }
      await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, updatedUser).then(res => {
        AsyncStorage.setItem('user', JSON.stringify(updatedUser))
        alert('تم اضافة الفيديو بنجاح')
        router.push({
          pathname: '/(course)/examVideo',
          params: {
            lesson: JSON.stringify(lessonData),
            user: JSON.stringify(userData)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }

  // update user Data with new exam in database
  const updateExam = async (title: any) => {
    if (hasLesson) {
      if (userData?.exams?.find((ex: any) => ex.title === title)) {
        const exam = userData?.exams?.find((ex: any) => ex.title === title)
        alert('لقد قمت بحل هذا الامتحان من قبل')
        router.push({
          pathname: '/(subPages)/reviewExam',
          params: {
            exam: JSON.stringify(exam)
          }
        })
      } else {
        router.replace({
          pathname: '/(course)/Exam',
          params: {
            exam: JSON.stringify(lessonData?.exam),
            user: JSON.stringify(userData),
            id: lessonData?._id
          }
        })
      }
    } else {
      alert('يجب شراء المحاضرة اولاً')
    }
  }


  const subjects = [
    { image: require('../../assets/images/subjects/arabic.png'), name: 'اللغة العربية' },
    { image: require('../../assets/images/subjects/english.png'), name: 'اللغة الانجليزية' },
    { image: require('../../assets/images/subjects/french.png'), name: 'اللغة الفرنسية' },
    { image: require('../../assets/images/subjects/german.png'), name: 'اللغة الالمانية' },
    { image: require('../../assets/images/subjects/italy.png'), name: 'اللغة الايطالية' },
    { image: require('../../assets/images/subjects/spanish.png'), name: 'اللغة الاسبانية' },
    { image: require('../../assets/images/subjects/chinese.png'), name: 'اللغة الصينية' },
    { image: require('../../assets/images/subjects/calculating.png'), name: 'الرياضيات' },
    { image: require('../../assets/images/subjects/physics.png'), name: 'الفيزياء' },
    { image: require('../../assets/images/subjects/chemistry.png'), name: 'الكيمياء' },
    { image: require('../../assets/images/subjects/biology.png'), name: 'الاحياء' },
    { image: require('../../assets/images/subjects/geology.png'), name: 'الجيولوجيا' },
    { image: require('../../assets/images/subjects/history.png'), name: 'التاريخ' },
    { image: require('../../assets/images/subjects/geography.png'), name: 'الجغرافيا' },
    { image: require('../../assets/images/subjects/psychology.png'), name: 'الفلسفة' },
    { image: require('../../assets/images/subjects/philosophy.png'), name: 'علم النفس' },
  ]


  if (!lessonData || !users || !userData) {
    return <Loading />

  } else {

    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={Colors.mainColor} />
        <Stack.Screen options={{
          title: lessonData?.title,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 20, width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
            >
              <FontAwesome name="chevron-left" size={24} color={Colors.calmWhite} />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors.mainColor,
          },
          headerTintColor: Colors.calmWhite,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}

        />

        <ScrollView style={ConstantStyles.page}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.teacherContainer}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={{ uri: techerData?.image || 'https://res.cloudinary.com/db152mwtg/image/upload/v1743082684/Treva%20Edu%20App/users/k021hfrs8bxmlvbd5nit.png' }} style={{ width: 50, height: 50, borderRadius: 10 }} />
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 10 }}>
                <Text style={[ConstantStyles.Title1, { fontSize: 26 }]}>{lessonData?.teacher}</Text>
                <Text style={[ConstantStyles.Title2, { fontSize: 18, color: 'gray' }]}>{techerData?.subject} . {techerData?.username}@</Text>
              </View>
            </View>
            <View>
              <Image source={subjects.find(subject => subject.name === lessonData?.subject)?.image} style={{ width: 50, height: 50 }} />
            </View>
          </View>
          {/* Teacher Data */}
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', direction: 'rtl', marginBottom: 10 }}>
            <Text style={[ConstantStyles.Title1, { fontSize: 26 }]}>{lessonData?.title}</Text>
            <Text style={[ConstantStyles.Title2, { fontSize: 22, color: 'gray' }]}>{lessonData?.grade}</Text>
          </View>
          {/* Description */}
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginVertical: 10 }}>
            <Text style={[ConstantStyles.Title1, { fontSize: 24 }]}>الوصف</Text>
            <Text style={[ConstantStyles.normalText, { fontSize: 16, color: Colors.textColor, textAlign: 'left' }]}>{lessonData?.description.slice(0, 30)}..</Text>
          </View>

          {/* Videos and Exams */}
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginVertical: 10 }}>
            <Text style={[ConstantStyles.Title1, { fontSize: 24 }]}>الفيديوهات</Text>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', direction: 'rtl' }}>
              <TouchableOpacity style={styles.linkVideo} onPress={() => {
                updateExplainVideo({ title: lessonData?.explainVideo.title })
              }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require('../../assets/images/lesson/presentation.png')} style={{ width: 50, height: 50 }} />
                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginHorizontal: 10 }}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 22 }]}>شرح الدرس</Text>
                    <Text style={[ConstantStyles.normalText, { fontSize: 16, color: Colors.textColor }]}>{lessonData?.explainVideo.title.split(' ').slice(0, 6).join(' ')}..</Text>
                  </View>
                </View>
                <View>
                  {userData?.videos?.find((video: { title: string | undefined }) => video.title === lessonData?.explainVideo.title) ? <MaterialIcons name="done" size={30} color={Colors.mainColor} /> : <AntDesign name="plus" size={30} color={Colors.mainColor} />}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkVideo} onPress={() => {
                updateHomeWorkVideo({ title: lessonData?.homeWorkVideo.title })
              }
              }>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require('../../assets/images/lesson/homework.png')} style={{ width: 50, height: 50 }} />
                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginHorizontal: 10 }}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 22 }]}>حل الواجب</Text>
                    <Text style={[ConstantStyles.normalText, { fontSize: 16, color: Colors.textColor }]}>{lessonData?.homeWorkVideo.title.split(' ').slice(0, 6).join(' ')}..</Text>
                  </View>
                </View>
                <View>
                  {userData?.videos?.find((video: { title: string | undefined }) => video.title === lessonData?.homeWorkVideo.title) ? <MaterialIcons name="done" size={30} color={Colors.mainColor} /> : <AntDesign name="plus" size={30} color={Colors.mainColor} />}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkVideo} onPress={() => {
                updateExamVideo({ title: lessonData?.examVideo.title })
              }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require('../../assets/images/lesson/exam.png')} style={{ width: 50, height: 50 }} />
                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginHorizontal: 10 }}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 22 }]}>الامتحان</Text>
                    <Text style={[ConstantStyles.normalText, { fontSize: 16, color: Colors.textColor }]}>{lessonData?.examVideo.title.split(' ').slice(0, 6).join(' ')}..</Text>
                  </View>
                </View>
                <View>
                  {userData?.videos?.find((video: { title: string | undefined }) => video.title === lessonData?.examVideo.title) ? <MaterialIcons name="done" size={30} color={Colors.mainColor} /> : <AntDesign name="plus" size={30} color={Colors.mainColor} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Exam */}
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginVertical: 10, marginBottom: 50 }}>
            <Text style={[ConstantStyles.Title1, { fontSize: 24 }]}>الامتحان</Text>
            {lessonData?.exam?.questions?.length === 0 ? <Text style={[ConstantStyles.normalText, { fontSize: 22, marginTop: 10, color: Colors.textColor }]}>{lessonData?.exam?.title} لا يوجد امتحان</Text> : (

              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', direction: 'rtl' }}>
                <TouchableOpacity style={styles.linkVideo} onPress={() => {
                  updateExam(lessonData?.exam.title)
                }}>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../assets/images/lesson/exam.png')} style={{ width: 50, height: 50 }} />
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginHorizontal: 10 }}>
                      <Text style={[ConstantStyles.Title1, { fontSize: 18 }]}>{lessonData?.exam.title.split(' ').slice(0, 6).join(' ')}..</Text>
                      <Text style={[ConstantStyles.normalText, { fontSize: 16, color: Colors.textColor }]}>{lessonData?.exam.description.split(' ').slice(0, 6).join(' ')}</Text>
                    </View>
                  </View>
                  <View>
                    {userData?.exams?.find((exam: { title: string | undefined }) => exam.title === lessonData?.exam.title) ? <MaterialIcons name="done" size={30} color={Colors.mainColor} /> : <AntDesign name="plus" size={30} color={Colors.mainColor} />}
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView >
      </>
    )
  }
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.calmWhite,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.mainColor,
  },
  teacherContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    direction: 'rtl',
  },
  controllers: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.mainColor,
    padding: 10,
  },
  linkVideo: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.calmWhite,
    marginVertical: 5,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  }
})