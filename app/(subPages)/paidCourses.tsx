import { View, Text, RefreshControl, ScrollView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { lesson, useDataContext, user } from '@/components/context/DataContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import LessonComponent from '@/components/elements/LessonComponent'
import { Colors } from '@/constants/Colors'

export default function paidCourses() {
    const [user, setUser] = useState<user | null>(null)
    const [lessonsInStorage, setLessonsInStorage] = useState<lesson[]>([])
    const { lessons, users } = useDataContext()

    const fetchUser = async () => {
        const userExist = await AsyncStorage.getItem('user')
        const lastLessons = userExist ? JSON.parse(userExist).lessons : null
        if (userExist) {
            setUser(JSON.parse(userExist))
            if (user) {
                const userExist = users?.find(userDB => userDB._id === user._id)
                if (userExist && JSON.stringify(userExist) !== JSON.stringify(user)) {
                    setUser(userExist)
                    AsyncStorage.setItem('user', JSON.stringify(userExist))
                }
            }
        } else {
            router.push('/(SignIn)/Welcome')
        }

        if (lastLessons) {
            // find the lessons and update from database
            if (lessons) {
                setLessonsInStorage(lessons);
            }

            const updatedLessons = lessons?.filter(lesson => {
                return JSON.parse(lastLessons).some((lessonInStorage: lesson) => lessonInStorage._id === lesson._id)
            })

            if (updatedLessons) {
                AsyncStorage.setItem('lastLessons', JSON.stringify(updatedLessons))
                setLessonsInStorage(updatedLessons.reverse())
            }
        }

    }

    useEffect(() => {
        fetchUser()
    }, [users])


    const lessonUserWatchedIds = user?.lessons ? (user.lessons as { _id: string; date: number }[]).map((lesson) => lesson._id) : null

    const filteredLessonsOnStorage = lessonsInStorage.filter(lesson => {
        const matchedGradeOfUser = user?.grade === lesson.grade
        const exsistsInLessonsThatUserWatched = lessonUserWatchedIds?.includes(lesson._id)
        return matchedGradeOfUser && exsistsInLessonsThatUserWatched
    }).reverse()

    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={Colors.itemBgColor} />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.itemBgColor, width: '100%', paddingBottom: 20 }}
                style={{ flex: 1, backgroundColor: '#fff', width: '100%' }}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={() => fetchUser()} />
                }
            >
                {filteredLessonsOnStorage.length > 0 && user ? filteredLessonsOnStorage.map((lesson, index) => (
                    <LessonComponent key={index} lesson={lesson} user={user} />
                )) : <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 20 }}>لا توجد دروس مدفوعة</Text>}
            </ScrollView>
        </>
    )

}