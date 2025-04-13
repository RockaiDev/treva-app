import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/Colors'
import { useDataContext, user } from '@/components/context/DataContext'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '@/components/Loading'
import { Image } from 'react-native'

export default function Overview() {
    const [teacher, setTeacher] = useState<user>()
    const { users, lessons } = useDataContext()

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

        const lessonsMatchedWithUserData = lessons.filter(lessons => {
            const matchedTecher = lessons.teacher === teacher.name
            return matchedTecher
        })

        const students = users.filter(user => user.role === 'student')

        const studentsHaveSeen = students.filter((student) => {
            const matchedLesson = lessonsMatchedWithUserData.filter(lesson => student.lessons.some((studentLesson: { _id: string }) => studentLesson._id === lesson._id))
            return matchedLesson
        })
        const TotalViews = () => {
            let totalViews = 0


            studentsHaveSeen.forEach(student => {
                student.videos.forEach(video => {
                    const explainVideo = lessonsMatchedWithUserData.filter(lesson => lesson.explainVideo && lesson.explainVideo.title === video.title)
                    const homeworkVideo = lessonsMatchedWithUserData.some(lesson => lesson.homeWorkVideo && lesson.homeWorkVideo.title === video.title)
                    const examVideo = lessonsMatchedWithUserData.some(lesson => lesson.exam && lesson.exam.title === video.title)
                    if (homeworkVideo) {
                        totalViews += 1
                    }
                    if (examVideo) {
                        totalViews += 1
                    }
                    if (explainVideo) {
                        totalViews += 1
                    }
                })
            })
            return totalViews
        }

        const lastExamDetails = () => {
            const studentsDoneExam = studentsHaveSeen.filter(student => student.exams.some(exam => exam.title === lessonsMatchedWithUserData[lessonsMatchedWithUserData.length - 1].exam.title))
            const studentsDoneExamCount = studentsDoneExam.length
            const studentsDoneExamPercentage = Math.round((studentsDoneExamCount / studentsHaveSeen.length) * 100)
            const avrage = studentsDoneExam.reduce((acc, student) => {
                const studentExam = student.exams.find(exam => exam.title === lessonsMatchedWithUserData[lessonsMatchedWithUserData.length - 1].exam.title)
                return acc + (studentExam?.totalPoints ?? 0)
            }, 0) / studentsDoneExamCount
            const totalPoints = lessonsMatchedWithUserData[lessonsMatchedWithUserData.length - 1].exam.questions.reduce((acc, question) => acc + +question.points, 0)
            return {
                studentsDoneExamCount,
                studentsDoneExamPercentage,
                avrage,
                studentsDoneExam,
                totalPoints
            }

        }

        const countOfStudentsSeenThisLesoson = ({ lessonId }: { lessonId: string }) => {
            const studentsDoneExam = studentsHaveSeen.filter(student => {
                const matchedLesson = student.lessons.filter((studentLesson: { _id: string }) => studentLesson._id === lessonId)
                return matchedLesson
            })
            return studentsDoneExam.length
        }

        return (
            <LinearGradient
                colors={[Colors.bgColor, Colors.itemBgColor, Colors.bgColor]}
                start={[0, 0]}
                end={[0, 1]}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ScrollView style={[ConstantStyles.page, { padding: 10 }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', direction: 'rtl', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.mainColor, paddingBottom: 10 }}>
                        <Text style={[ConstantStyles.Title1, { fontSize: 26, color: Colors.textColor, marginBottom: 5 }]}>م/ {teacher.name}, مرحباً بك في تريـڤـا</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl', width: '100%' }}>
                            <Text style={ConstantStyles.Title2}>مدرس مادة {teacher.subject}</Text>
                            <TouchableOpacity onPress={() => { 
                                AsyncStorage.removeItem('user')
                                router.push('/(SignIn)/Welcome')
                            }}>
                            <Image source={require('@/assets/images/logout.png')} style={{ width: 30, height: 30, borderRadius: 50, marginLeft: 10 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={[ConstantStyles.Title1, { fontSize: 40, color: Colors.textColor }]}>النظرة العامة</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', direction: 'rtl' }}>
                        <View style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: 150, height: 150, borderRadius: 20, backgroundColor: Colors.mainColor, margin: 10, padding: 10 }]}>
                            <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite }]}>المشاهدات</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
                                <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite, fontSize: 45, marginLeft: 5 }]}>{TotalViews()}</Text>
                                <Text style={[ConstantStyles.normalText, { color: Colors.calmWhite, marginBottom: 12 }]}>مشاهدة</Text>
                            </View>
                            <Image source={require('@/assets/images/eye.png')} style={{
                                width: 40,
                                height: 40,
                                position: 'absolute',
                                top: 55,
                                left: 10

                            }} />
                        </View>
                        <View style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: 150, height: 150, borderRadius: 20, backgroundColor: Colors.mainColor, margin: 10, padding: 10 }]}>
                            <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite }]}>الطلاب</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
                                <Text style={[ConstantStyles.Title1, { color: Colors.calmWhite, fontSize: 45, marginLeft: 5 }]}>{studentsHaveSeen.length}</Text>
                                <Text style={[ConstantStyles.normalText, { color: Colors.calmWhite, marginBottom: 12 }]}>طالب</Text>
                            </View>
                            <Image source={require('@/assets/images/students.png')} style={{
                                width: 40,
                                height: 40,
                                position: 'absolute',
                                top: 55,
                                left: 10
                            }} />
                        </View>
                    </View>

                    {/* last Exam */}
                    <View style={{ display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'flex-start', justifyContent: 'center', }}>
                        <Text style={[ConstantStyles.Title1, { marginTop: 20, color: Colors.textColor }]}>اخر امتحان</Text>
                        <View style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: 20, borderRadius: 10, backgroundColor: Colors.calmWhite, direction: 'rtl', marginVertical: 20, height: 250 }]}>
                            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                                <Text style={[ConstantStyles.Title1, { fontSize: 20, color: Colors.textColor }]}>{lessonsMatchedWithUserData[lessonsMatchedWithUserData.length - 1].exam.title}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '60%' }}>
                                    <Text style={[ConstantStyles.normalText, { color: Colors.textColor, marginBottom: 5 }]}>الصف: {lessonsMatchedWithUserData[lessonsMatchedWithUserData.length - 1].grade}</Text>
                                    <Text style={[ConstantStyles.normalText, { color: Colors.textColor, marginBottom: 5 }]}>عدد الطلاب: {lastExamDetails().studentsDoneExamCount}</Text>
                                    <Text style={[ConstantStyles.normalText, { color: Colors.textColor, marginBottom: 5 }]}>نسبة النجاح: {lastExamDetails().studentsDoneExamPercentage}%</Text>
                                    <Text style={[ConstantStyles.normalText, { color: Colors.textColor, marginBottom: 5 }]}>المعدل: {lastExamDetails().totalPoints} / {lastExamDetails().avrage} </Text>

                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40%' }}>
                                    <Image source={require('@/assets/images/exam.png')} style={{ width: 100, height: 100 }} />
                                </View>
                            </View>
                            <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: Colors.mainColor, padding: 10, borderRadius: 10 }}
                                onPress={() => {
                                    router.push({
                                        pathname: '/(teacher)/ResultsExams',
                                        params: {
                                            data: JSON.stringify(lastExamDetails().studentsDoneExam),
                                            lesson: JSON.stringify(lessonsMatchedWithUserData[lessonsMatchedWithUserData.length - 1]),
                                        }
                                    })
                                }}
                            >
                                <Text style={[ConstantStyles.Title3, { color: Colors.calmWhite }]}>عرض النتائج</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* All Exams */}
                    <View style={{ display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 20 }}>
                        <Text style={[ConstantStyles.Title1, { color: Colors.textColor }]}>الامتحانات</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%', direction: 'rtl', marginVertical: 10 }} pagingEnabled>

                            {lessonsMatchedWithUserData.map((lesson, index) => (
                                lesson.exam && (
                                    <TouchableOpacity key={index} style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: Dimensions.get('screen').width - 20, padding: 20, borderRadius: 10, backgroundColor: Colors.calmWhite, marginVertical: 10 }]}
                                        onPress={() => router.push({
                                            pathname: '/(teacher)/ResultsExams',
                                            params: {
                                                data: JSON.stringify(lastExamDetails().studentsDoneExam),
                                                lesson: JSON.stringify(lesson),
                                            }
                                        })}
                                    >
                                        <Text style={[ConstantStyles.Title3, { color: Colors.textColor, marginBottom: 10 }]}>{lesson.exam.title}</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '60%' }}>
                                                <Text style={[ConstantStyles.normalText, { color: Colors.textColor }]}>الصف: {lesson.grade}</Text>
                                                <Text style={[ConstantStyles.normalText, { color: Colors.textColor }]}>عدد الأسئلة: {lesson.exam.questions.length}</Text>
                                            </View>
                                            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40%' }}>
                                                <Image source={require('@/assets/images/exam.png')} style={{ width: 60, height: 60 }} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            )).reverse()}
                        </ScrollView>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'column', direction: 'rtl', width: '100%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 20 }}>
                        <Text style={[ConstantStyles.Title1, { color: Colors.textColor }]}>الدروس</Text>
                        {lessonsMatchedWithUserData.map((lesson, index) => (
                            <TouchableOpacity key={index} style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 20, borderRadius: 10, backgroundColor: Colors.calmWhite, direction: 'rtl', marginVertical: 10 }]}
                                onPress={() => router.push({
                                    pathname: '/(teacher)/VideosAnalysis',
                                    params: {
                                        lesson: JSON.stringify(lesson),
                                        user: JSON.stringify(teacher)
                                    }
                                })}
                            >
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '60%' }}>
                                    <Text style={[ConstantStyles.Title2, { color: Colors.textColor }]}>{lesson.title}</Text>
                                    <Text style={[ConstantStyles.normalText, { color: Colors.textColor }]}>الصف: {lesson.grade}</Text>
                                    <Text style={[ConstantStyles.normalText, { color: Colors.textColor }]}>عدد الطلاب: {countOfStudentsSeenThisLesoson({ lessonId: lesson._id })}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40%' }}>
                                    <Image source={require('@/assets/images/lesson.png')} style={{ width: 60, height: 60 }} />
                                </View>
                            </TouchableOpacity>
                        )).reverse()}
                    </View>
                </ScrollView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({})