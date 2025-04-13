import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { lesson, user } from '../context/DataContext';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { FontAwesome6 } from '@expo/vector-icons';

interface LessonComponentProps {
    lesson: lesson;
    user: user;
}

export default function ExamComponent({ lesson, user }: LessonComponentProps) {

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


    const TotalExamPoints = lesson.exam.questions.reduce((acc, question) => {
        return acc + +question.points
    }, 0)

    // if user Done the exam give me the total points of the exam

    const userPoints = user.exams.find(exam => exam.title === lesson.exam.title)?.totalPoints

    return (
        <TouchableOpacity style={styles.ExamContainer} onPress={() => router.push({
            pathname: '/(course)/Exam',
            params: {
                exam: JSON.stringify(lesson.exam),
                user: JSON.stringify(user),
            }
        })}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image source={subjects.find(subject => subject.name === lesson.subject)?.image} style={{ width: 50, height: 50 }} />
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text numberOfLines={2} style={styles.text1}>{lesson.exam.title}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.text2}>{new Date(lesson.updatedAt).toLocaleDateString()}</Text>
                        <Text style={styles.text2}>{lesson.exam.questions.length} سؤال</Text>
                        <Text style={styles.text2}>
                            <FontAwesome6 name="stopwatch" size={16} color={'gray'} />  {lesson.exam.time}
                        </Text>
                    </View>
                </View>
            </View>
            <View>
                {user.exams.some(exam => exam.title === lesson.exam.title) ? (
                    <>
                        <Text style={{ fontSize: 18, fontFamily: Fonts.boldText, color: 'green' }}>تم الحل</Text>
                        <Text style={{ fontSize: 18, fontFamily: Fonts.boldText, color: 'red' }}>{userPoints? userPoints : 0} / {TotalExamPoints}</Text>
                    </>
                ) : (
                    <>
                        <Text style={{ fontSize: 18, fontFamily: Fonts.boldText, color: 'red' }}>لم يتم الحل</Text>
                    </>
                )}

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    ExamContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.mainColor,
        borderRadius: 5,
        direction: 'rtl'
    },
    text1: {
        fontSize: 18,
        fontFamily: Fonts.boldText,
        color: Colors.mainColor,
        marginRight: 10,
        maxWidth: 170,
        textAlign: 'left'
    },
    text2: {
        fontSize: 18,
        fontFamily: Fonts.boldText,
        color: 'gray',
        marginRight: 10
    }
})