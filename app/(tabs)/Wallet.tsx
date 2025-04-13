import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDataContext, user } from '@/components/context/DataContext'
import Loading from '@/components/Loading'
import { Colors } from '@/constants/Colors'
import LessonComponent from '@/components/elements/LessonComponent'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios'
import Constants from 'expo-constants'

export default function Wallet() {
  const [user, setUser] = useState<user>()

  const { lessons } = useDataContext()



  const fetchUser = async () => {
    const userExist = await AsyncStorage.getItem('user')
    if (userExist) {
      setUser(JSON.parse(userExist))
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (!user) {
    return <Loading />
  } else {

    const TotalBillsCost = user.bills.reduce((acc, bill) => acc + +bill.cost, 0)

    const lessonMeanet = (lesson: any) => {
      const lessonMean = lessons?.find((l: any) => l._id === lesson)
      return lessonMean
    }

    const ChargePoints = () => {
      if (user.type === 'TrevaGo') {
        Alert.alert("الاشتراك الشهري", 'هل تريد الاشتراك الشهري لطلاب المعهد فقط ب 400 جنيه', [
          {
            text: 'نعم',
            onPress: async () => {
              if (user.points >= 400) {
                const bill = {
                  method: 'الاشتراك الشهري',
                  cost: 400,
                  date: new Date().getTime(),
                  code: `${new Date().getTime()}`
                }
                user.bills.push(bill)
                user.logs.push(`تم دفع ${bill.cost} جنيه للاشتراك الشهري`)
                user.points -= 400
                user.type = 'TrevaIn'
                setUser(user)
                await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, user).then(res => {
                  AsyncStorage.setItem('user', JSON.stringify(user))
                  Alert.alert('تم', 'تم الاشتراك بنجاح')
                })
              } else {
                Alert.alert('خطأ', 'رصيدك غير كافي')
              }
            }
          },
          {
            text: 'لا',
            onPress: () => { }
          }
        ])

      } else {
        Alert.alert("الاشتراك الشهري", 'هل تريد الاشتراك الشهري ب 400 جنيه', [
          {
            text: 'نعم',
            onPress: async () => {
              if (user.points >= 400) {
                const bill = {
                  method: 'الاشتراك الشهري',
                  cost: 400,
                  date: new Date().getTime(),
                  code: `${new Date().getTime()}`
                }
                user.bills.push(bill)
                user.logs.push(`تم دفع ${bill.cost} جنيه للاشتراك الشهري`)
                user.points -= 400
                setUser(user)
                console.log(user)
                await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, user).then(res => {
                  AsyncStorage.setItem('user', JSON.stringify(user))
                  Alert.alert('تم', 'تم الاشتراك بنجاح')
                })
              } else {
                Alert.alert('خطأ', 'رصيدك غير كافي')
              }
            }
          },
          {
            text: 'لا',
            onPress: () => { }
          }
        ])
      }
    }

    return (
      <>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          direction: 'rtl',
          padding: 10,
          backgroundColor: Colors.mainColor,
        }}>
          <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite }]}>المحفظة</Text>
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
            height: '100%',
            marginBottom: 80,
            flexGrow: 1
          }}
        >

          <ScrollView
            refreshControl={
              <RefreshControl
                colors={[Colors.mainColor]}
                progressBackgroundColor={Colors.bgColor}
                refreshing={false}
                onRefresh={() => fetchUser()}
              />
            }
            style={[ConstantStyles.page, { padding: 20, flexGrow: 1 }]}
          >
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: 'rtl',
              padding: 10,
              backgroundColor: Colors.calmWhite,
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl',
                width: '100%',
              }}>
                <Text style={[ConstantStyles.Title3, { fontSize: 20 }]}>الرصيد الحالي</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[ConstantStyles.Title1, { fontSize: 50 }]}>{user.points}.00</Text>
                  <Text style={[ConstantStyles.Title1, { fontSize: 20, marginTop: 5, marginRight: 5 }]}>ج.م</Text>
                </View>
              </View>
              {/* Charge */}
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl',
              }}>
                <TouchableOpacity style={[ConstantStyles.btn, { width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginVertical: 0 }]}
                  onPress={() => ChargePoints()}
                >
                  <Text style={[ConstantStyles.Title3, { fontSize: 20, color: Colors.calmWhite }]}>الاشتراك الشهري</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* StudentType */}
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: 'rtl',
              padding: 10,
              backgroundColor: Colors.calmWhite,
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl',
                width: '100%',
              }}>
                <Text style={[ConstantStyles.Title3, { fontSize: 20 }]}>اشتراك الطالب</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[ConstantStyles.Title1, { fontSize: 30, marginLeft: 10 }]}>{user.type}</Text>
                  {user.type === 'TrevaGo' ? (
                    <Image source={require('../../assets/images/trevaGo.png')} style={{ width: 50, height: 50 }} />
                  ) : (
                    <Image source={require('../../assets/images/trevaIn.png')} style={{ width: 50, height: 50 }} />
                  )}
                </View>
              </View>

              {/* Bills */}
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl',
                width: '100%',
                marginTop: 20,
              }}>
                <Text style={[ConstantStyles.Title3, { fontSize: 20 }]}>المدفوعات</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[ConstantStyles.Title1, { fontSize: 50 }]}>{TotalBillsCost}</Text>
                  <Text style={[ConstantStyles.Title1, { fontSize: 20, marginTop: 5, marginRight: 5 }]}>ج.م</Text>
                </View>
              </View>
            </View>

            {/* Lessons Had Pay */}
            <View style={{ display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 80 }}>
              {user.bills.map((bill, index) => {
                return (
                  <View key={index} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: 10,
                    backgroundColor: Colors.calmWhite,
                    marginVertical: 10,
                    borderRadius: 10,
                  }}>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                        <Text style={[ConstantStyles.Title2, { fontSize: 20 }]}>{bill.method}</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Text style={[ConstantStyles.Title3, { fontSize: 20 }]}>{(bill.cost).toLocaleString()} ج.م</Text>
                      <Text style={[ConstantStyles.normalText, { fontSize: 16, color: Colors.mainColor, textAlign: 'left' }]}>{typeof (bill.date) === 'number' ? new Date(bill.date).toLocaleDateString() : bill.date}</Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>

            {/* Lessons */}
            {/* <Text style={[ConstantStyles.Title2, { marginTop: 20 }]}>المحاضرات</Text>
        <View style={{ display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          {user.lessons.map((lesson, index) => {
            const lessonData = lessonMeanet(lesson);
            return lessonData && <LessonComponent key={index} lesson={lessonData} user={user} />;
          })}
          </View> */}
          </ScrollView>
        </LinearGradient>
      </>
    )
  }
}

const styles = StyleSheet.create({})