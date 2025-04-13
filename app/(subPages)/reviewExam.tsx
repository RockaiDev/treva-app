import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ConstantStyles } from '@/constants/constantStyles'
import { useDataContext } from '@/components/context/DataContext'
import Loading from '@/components/Loading'
import { Feather, MaterialIcons } from '@expo/vector-icons'

export default function reviewExam() {
  const { exam } = useLocalSearchParams()
  const { lessons } = useDataContext()
  const ExamData = typeof exam === 'string' ? JSON.parse(exam) : null

  // Find Lesson From the title of Exam
  const lesson = lessons?.find(lesson => lesson.exam.title === ExamData?.title)

  if (!ExamData || !lesson) {
    return <Loading />

  } else {

    return (
      <ScrollView style={ConstantStyles.page}>
        <View>
          <Text style={ConstantStyles.Title1}>مراجعة الامتحان</Text>
          <Text style={ConstantStyles.normalText}>الامتحان: {ExamData?.title}</Text>
          <Text style={ConstantStyles.normalText}>الدرجة: {ExamData?.totalPoints}</Text>
        </View>
        {/* Answers */}
        <View style={{ marginVertical: 10 }}>
          <Text style={ConstantStyles.Title2}>الاجابات</Text>
          {ExamData?.answers.map((question: any, index: any) => (
            <View key={index} style={{ marginVertical: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', direction: 'rtl' }}>
                <Text style={[ConstantStyles.normalText, {marginLeft: 10}]}>{index + 1}. {question.question}</Text>
                {question.points == 0 ? (
                  <Feather name="x" size={24} color="red" />
                ) : (
                  <MaterialIcons name="done" size={24} color="green" />
                )}
              </View>
              <Text style={ConstantStyles.normalText}>الاجابة: {question.answer}</Text>
              <Text style={ConstantStyles.normalText}>الدرجة: {question.points}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({})