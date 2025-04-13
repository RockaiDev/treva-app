import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/Colors'
import { ConstantStyles } from '@/constants/constantStyles'
import { useDataContext, user } from '@/components/context/DataContext'
import Loading from '@/components/Loading'
import { useLocalSearchParams } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function VideosAnalysis() {
    const [studentsFilter, setStudentsFilter] = useState('')
    const [studentType, setStudentType] = useState('')
    const [videoWatched, setVideoWatched] = useState('')

    const { users } = useDataContext()
    const { lesson, user } = useLocalSearchParams()
    const lessonData = typeof lesson === 'string' ? JSON.parse(lesson) : lesson
    const userData = typeof user === 'string' ? JSON.parse(user) : user



    if (!users) {
        return <Loading />
    } else {

        const students = users.filter(user => user.role === 'student')
        const studentsSeenThisLesson = students.filter(student => {
            const matchedLesson = student.lessons.find(lesson => lesson === lessonData._id)
            return matchedLesson
        })


        const filterStudens = studentsSeenThisLesson.filter((student: user) => {
            const matchedName = !studentsFilter || student.name.toLocaleLowerCase().includes(studentsFilter.toLocaleLowerCase())
            const matchedVideoShowed = !videoWatched || student.videos.find(video => video.title === videoWatched)
            return matchedName && matchedVideoShowed
        })

        return (
            <LinearGradient
                colors={[Colors.bgColor, Colors.itemBgColor, Colors.bgColor]}
                style={{ flex: 1 }}
            >
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[ConstantStyles.Title1, { color: Colors.textColor, marginBottom: 10 }]}>تحليل الفيديوهات</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '100%', padding: 10, direction: 'rtl' }}>
                        <Text style={[ConstantStyles.Title2, { color: Colors.textColor }]}>{lessonData.title}</Text>
                        <Text style={[ConstantStyles.normalText, { color: Colors.textColor }]}>المدرس: {userData.name}</Text>
                        <Text style={[ConstantStyles.normalText, { color: Colors.textColor }]}>الصف: {lessonData.grade}</Text>
                        <Text style={[ConstantStyles.normalText, { color: Colors.textColor }]}>عدد الطلاب: {filterStudens.length} طالب</Text>
                    </View>
                    <View style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, backgroundColor: Colors.calmWhite, borderRadius: 20, padding: 10, direction: 'rtl', width: '100%' }]}>
                        <MaterialCommunityIcons name='account-search' size={24} color={Colors.mainColor} />
                        <TextInput
                            style={[ConstantStyles.normalText, { width: '80%', textAlign: 'right' }]}
                            placeholder='ابحث عن طالب'
                            placeholderTextColor={Colors.mainColor}
                            value={studentsFilter}
                            onChangeText={setStudentsFilter}
                        />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, borderRadius: 20, padding: 10, direction: 'rtl', width: '100%' }}>
                        <TouchableOpacity style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: videoWatched === lessonData.explainVideo.title ? Colors.bgColor : Colors.calmWhite, borderRadius: 20, padding: 10, width: '30%' }]}
                            onPress={() => {
                                if (videoWatched === lessonData.explainVideo.title) {
                                    setVideoWatched('')
                                } else {
                                    setVideoWatched(lessonData.explainVideo?.title)
                                }
                            }}
                        >
                            <Text style={[ConstantStyles.normalText, { color: Colors.textColor, fontSize: 16 }]}>فيديو الشرح</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: videoWatched === lessonData.homeWorkVideo.title ? Colors.bgColor : Colors.calmWhite, borderRadius: 20, padding: 10, width: '30%' }]}
                            onPress={() => {
                                if (videoWatched === lessonData.homeWorkVideo.title) {
                                    setVideoWatched('')
                                } else {
                                    setVideoWatched(lessonData.homeWorkVideo?.title)
                                }
                            }}
                        >
                            <Text style={[ConstantStyles.normalText, { color: Colors.textColor, fontSize: 16 }]}>فيديو الواجب</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: videoWatched === lessonData.examVideo.title ? Colors.bgColor : Colors.calmWhite, borderRadius: 20, padding: 10, width: '30%' }]}
                            onPress={() => {
                                if (videoWatched === lessonData.examVideo.title) {
                                    setVideoWatched('')
                                } else {
                                    setVideoWatched(lessonData.examVideo?.title)
                                }
                            }}
                        >
                            <Text style={[ConstantStyles.normalText, { color: Colors.textColor, fontSize: 16 }]}>فيديو الامتحان</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={ConstantStyles.page}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        filterStudens.map((student, index) => {
                            return (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, padding: 10, borderWidth: 1, borderColor: Colors.mainColor, borderRadius: 5, direction: 'rtl' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: student.image ? student.image : 'https://res.cloudinary.com/db152mwtg/image/upload/v1734695620/Treva%20Edu%20App/users/tx4dze4uiwb1in8hkz0z.png' }} style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 1 }} />
                                        <Text style={[ConstantStyles.Title2, { fontSize: 18, marginRight: 10 }]}>{student.name}</Text>
                                    </View>
                                    <Text style={[ConstantStyles.Title2, { fontSize: 18 }]}>{student.lessons.find(lesson => lesson === lessonData._id) ? 'شاهد الدرس' : 'لم يشاهد الدرس'}</Text>
                                </View>
                            )
                        }).reverse()
                    }
                </ScrollView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({})