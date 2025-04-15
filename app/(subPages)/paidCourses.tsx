import { View, Text, RefreshControl, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { lesson, useDataContext, user } from '@/components/context/DataContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import LessonComponent from '@/components/elements/LessonComponent'

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


    const filteredLessonsOnStorage = Array.from(
        new Map(lessonsInStorage.map(lesson => [lesson._id, lesson])).values()
    ).reverse();

    return (
        <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}
            refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => fetchUser()} />
            }
        >
            {filteredLessonsOnStorage.length > 0 && user ? filteredLessonsOnStorage.map((lesson, index) => (
                <LessonComponent key={index} lesson={lesson} user={user} />
            )) : <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 20 }}>لا توجد دروس مدفوعة</Text>}
        </ScrollView>
    )

}