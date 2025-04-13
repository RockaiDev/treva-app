import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDataContext, user } from '@/components/context/DataContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useLocalSearchParams } from 'expo-router'
import { ConstantStyles } from '@/constants/constantStyles'
import Loading from '@/components/Loading'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function ResultsExams() {
    const [studentsFilter, setStudentsFilter] = useState('')
    const [studentType, setStudentType] = useState('')

    const [teacher, setTeacher] = useState<user>()
    const { users, lessons } = useDataContext()
    const { data, lesson } = useLocalSearchParams()
    const studentsDoneExam = typeof data === 'string' ? JSON.parse(data) : data
    const lessonData = typeof lesson === 'string' ? JSON.parse(lesson) : lesson

    const lessonExamTotalPoints = () => {
        return lessonData.exam.questions.reduce((acc: number, question: any) => {
            return acc + +question.points
        }, 0)
    }

    const fetchUser = async () => {
        const userExist = await AsyncStorage.getItem('user')
        if (userExist) {
            setTeacher(JSON.parse(userExist))
            const user = users?.find(user => user._id === JSON.parse(userExist)._id)
            if (user) {
                await AsyncStorage.setItem('user', JSON.stringify(user))
                setTeacher(user)
            }
        } else {
            router.push('/(SignIn)')
        }

    }
    useEffect(() => {
        fetchUser()
    }, [])

    if (!users || !lessons || !teacher) {
        return <Loading />
    } else {

        const filterStudens = studentsDoneExam.filter((student: user) => {
            const matchedName = !studentsFilter || student.name.toLocaleLowerCase().includes(studentsFilter.toLocaleLowerCase())
            return matchedName
        })

        return (
            <LinearGradient
                colors={[Colors.bgColor, Colors.itemBgColor, Colors.bgColor]}
                style={{ flex: 1 }}
            >

                <ScrollView style={[ConstantStyles.page]}>
                    <View>
                        <Text style={[ConstantStyles.Title2, { fontSize: 26 }]}>نتائج الامتحان</Text>
                        <Text style={[ConstantStyles.Title2, { fontSize: 22 }]}>الطلاب الذين قاموا بالامتحان</Text>
                        <Text style={[ConstantStyles.Title2, { fontSize: 22 }]}>عدد الطلاب: {studentsDoneExam.length}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, backgroundColor: Colors.calmWhite, borderRadius: 20, padding: 10, direction: 'rtl' }}>
                        <MaterialCommunityIcons name='account-search' size={24} color={Colors.mainColor} />
                        <TextInput
                            style={[ConstantStyles.normalText, { width: '80%', textAlign: 'right' }]}
                            placeholder='ابحث عن طالب'
                            placeholderTextColor={Colors.mainColor}
                            value={studentsFilter}
                            onChangeText={setStudentsFilter}
                        />
                    </View>
                    <View>
                        {filterStudens.map((student: user, index: number) => {
                            return (
                                <TouchableOpacity key={index} style={[ConstantStyles.shadowContainer, { flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginVertical: 10, backgroundColor: Colors.calmWhite, borderRadius: 10, direction: 'rtl', alignItems: 'center' }]}
                                    onPress={() => router.push({
                                        pathname: '/(subPages)/reviewExam',
                                        params: {
                                            exam: JSON.stringify(student.exams.find(exam => exam.title === lessonData.exam.title))
                                        }
                                    })}
                                >
                                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                        <Text style={[ConstantStyles.Title2, { fontSize: 18 }]}>{student.name}</Text>
                                        <Text style={[ConstantStyles.Title2, { fontSize: 18 }]}>{student.grade}</Text>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                        <Text style={[ConstantStyles.Title2, { fontSize: 18 }]}>الدرجة</Text>

                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            {student.exams?.find(exam => exam.title === lessonData.exam.title)?.totalPoints! > lessonExamTotalPoints() / 2 ? <MaterialCommunityIcons name="check" size={20} color={Colors.mainColor} /> : <MaterialCommunityIcons name="close" size={20} color={Colors.mainColor} />}
                                            <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 0, marginRight: 5 }]}>{student.exams.find(exam => exam.title === lessonData.exam.title)?.totalPoints} / {lessonExamTotalPoints()}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }).reverse()}
                    </View>
                </ScrollView>
            </LinearGradient>
        )
    }
}
const styles = StyleSheet.create({})