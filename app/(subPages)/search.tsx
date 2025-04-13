import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Fonts } from '@/constants/Fonts'
import { useDataContext, user } from '@/components/context/DataContext'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ConstantStyles } from '@/constants/constantStyles'

export default function Search() {
    const [search, setSearch] = useState('')
    const [user, setUser] = useState<user>()
    const { lessons, users } = useDataContext()

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

    const searchLessons = lessons?.filter(lesson => {
        const matchedGradeOfUser = user?.grade === lesson.grade
        const matchedLessonTitle = !search || lesson.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        const matchedSubject = !search || lesson.subject.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        const matchedteacher = !search || lesson.teacher.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        return matchedGradeOfUser && (matchedLessonTitle || matchedSubject || matchedteacher)
    })


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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.calmWhite, marginTop: 20 }}>
            <StatusBar backgroundColor={Colors.calmWhite} barStyle='dark-content' />
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'rtl', width: '100%' }}>
                <TextInput
                    style={[styles.inputText]}
                    placeholder="ابحث عن محاضرة"
                    placeholderTextColor={Colors.mainColor}
                    focusable={true}
                    autoFocus={true}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10, direction: 'rtl' }}>
                <Text style={[ConstantStyles.Title1, { fontSize: 26 }]}>نتائج البحث</Text>
                {/* length */}
                <Text style={[ConstantStyles.Title2, { fontSize: 22 }]}>عدد المحاضرات: {searchLessons?.length}</Text>
            </View>

            <ScrollView style={ConstantStyles.page}>
                {
                    searchLessons?.map((lesson, index) => {
                        return (
                            <TouchableOpacity key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, marginVertical: 20, padding: 10, borderWidth: 1, borderColor: Colors.mainColor, borderRadius: 5, direction: 'rtl', backgroundColor: Colors.calmWhite }}
                                onPress={() => router.push(
                                    {
                                        pathname: '/(course)/[id]',
                                        params: {
                                            id: lesson._id,
                                            lesson: JSON.stringify(lesson),
                                            user: JSON.stringify(user)
                                        }
                                    }
                                )}
                            >
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome name="book" size={22} color={Colors.mainColor} />
                                    <Text style={[ConstantStyles.Title2, { fontSize: 18, marginRight: 10 }]}>{lesson.title}</Text>
                                </View>
                                {/* Image of Subject */}
                                <Image source={subjects.find(subject => subject.name === lesson.subject)?.image} style={{ width: 30, height: 30 }} />
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputText: {
        padding: 6,
        fontSize: 24,
        fontFamily: Fonts.mediumText,
        width: Dimensions.get('screen').width - 20,
        textAlign: 'right',
        borderWidth: 2,
        borderColor: Colors.mainColor,
        borderRadius: 5,

    },
})