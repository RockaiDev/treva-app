import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { ConstantStyles } from '@/constants/constantStyles'
import { Colors } from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5 } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import Constants from 'expo-constants'

interface exam {
  title: string,
  description: string,
  Date: string,
  time: number,
  questions: {
    title: string,
    image: string,
    description: string,
    answers: {
      answer: string,
      isRight: string,
    }[], // {answer, isRight}
    points: number
  }[], // {question title, image, description } , {3 wrong answers, right answer} , points,
  students: {
    name: string,
    totalPoints: number,
    answers: {
      answer: string,
      points: number
    }[],
    comments: {

    }[]
  }[],
  comments: {

  }[]
}

export default function Exam() {
  const { id, exam: lessonExam, user } = useLocalSearchParams()
  const [startExam, setStartExam] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [examData, setExamData] = useState(() => {
    if (typeof lessonExam === 'string') {
      return JSON.parse(lessonExam);
    }
    return null;
  });
  const [userDate, setUser] = useState(() => {
    if (typeof user === 'string') {
      return JSON.parse(user);
    }
    return null;
  })


  const totalExamPoints = examData.questions.reduce((acc: any, question: any) => {
    return acc + +question.points
  }, 0)


  const StartExam = () => {
    if (userDate.exams.some((exam: any) => exam.title === examData.title)) {
      alert('انت قد قمت بحل هذا الامتحان من قبل')
      router.replace({
        pathname: "/(subPages)/reviewExam",
        params: {
          user: JSON.stringify(userDate.exams.find((exam: any) => exam.title === examData.title))
        }
      })
      return;
    } else {
      alert('انت الان تبدأ الامتحان')
      setStartExam(true)
    }
  }

  const [minutes, setMinutes] = useState(Math.ceil(examData.time));
  const [seconds, setSeconds] = useState(0);

  const Timer = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          clearInterval(interval)
          setShowScore(true)
        } else {
          if (seconds === 0) {
            setMinutes(minutes - 1)
            setSeconds(59)
          } else {
            setSeconds(seconds - 1)
          }
        }
      }, 1000)
      return () => clearInterval(interval)
    }, [minutes, seconds])

    return (
      <Text style={[ConstantStyles.normalText, { fontSize: 20, color: Colors.textColor, direction: 'ltr', position: 'absolute', top: 3, right: 20 }]}>{minutes} : {seconds}</Text>
    )
  }

  const [exam, setExam] = useState<{
    name: string,
    title: string,
    totalPoints: number,
    answers: { question: string, answer: string, points: number }[],
  }>({
    name: userDate.name,
    title: examData.title,
    totalPoints: 0,
    answers: [],
  })

  const [nextShow, setNextShow] = useState(false)
  const [submitExam, setSubmitExam] = useState(false)

  const handelAnswers = (ans: any) => {
    // Check if the answer is already selected
    if (exam.answers[currentQuestion]) {
      return;
    }

    let answer = {
      question: examData.questions[currentQuestion].title,
      answer: ans.answer,
      points: ans.isRight === 'true' ? examData.questions[currentQuestion].points : 0
    }

    // Update the answer for the current question
    const updatedAnswers = [...exam.answers];
    updatedAnswers[currentQuestion] = answer;

    setExam({ ...exam, answers: updatedAnswers });

    // Update the score if the answer is correct
    if (ans.isRight === 'true') {
      setScore(score + +answer.points);
      setExam(prevExam => ({ ...prevExam, totalPoints: +prevExam.totalPoints + +answer.points }));
    }

    // Move to the next question or submit the exam if it's the last question
    if (currentQuestion < examData.questions.length - 1) {
      setNextShow(true);
    } else {
      setSubmitExam(true);
      setNextShow(false);
    }
  }

  const submitExamHandler = async () => {
    setShowScore(true);
    try {
      await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, {
        _id: userDate._id,
        exams: [...userDate.exams, exam]
      }).then(res => {
        console.log(res.data)
      })
      const updatedUser = { ...userDate, exams: [...userDate.exams, exam] };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      await axios.post(`${Constants.expoConfig?.extra?.API_URL}/lessons/updateLesson`, {
        _id: id,
        students: [...examData.students, exam]
      }).then(res => {
        console.log(res.data)
      })

    } catch (error) {
      console.error(error);
    }
  }



  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
      }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: startExam ? Colors.mainColor : Colors.calmWhite }}>
        <StatusBar backgroundColor={Colors.mainColor} barStyle={startExam ? "light-content" : 'dark-content'} />
        {startExam && !showScore ? (
          <>
            <ScrollView showsVerticalScrollIndicator={false} style={[ConstantStyles.page, { padding: 10, backgroundColor: Colors.mainColor }]}>
              <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 30, direction: 'rtl' }}>
                <View style={{
                  width: '100%',
                  height: 30,
                  backgroundColor: '#ccc',
                  borderRadius: 20,
                  marginBottom: 10,
                }}>
                  <View style={{
                    width: `${(currentQuestion / examData.questions.length) * 100}%`,
                    height: 30,
                    backgroundColor: Colors.calmWhite,
                    borderRadius: 20,
                    transitionDuration: '100s',
                    animationDuration: '100s',
                    animationTimingFunction: 'linear',
                    animationName: 'progress',
                  }}>
                  </View>
                  <Timer />
                </View>
                <Text style={[ConstantStyles.Title1, { fontSize: 26, color: Colors.calmWhite }]}>السؤال {currentQuestion + 1} من {examData.questions.length}</Text>
              </View>
              <View>
                {examData.questions[currentQuestion].image ? (
                  <Image source={{ uri: `${examData.questions[currentQuestion].image}` }} style={[{ width: '100%', height: 200 }, styles.videoContainer]} />
                ) : (
                  <View style={{ height: 200 }}></View>
                )}
                <Text style={[ConstantStyles.Title1, { fontSize: 26, textAlign: 'center', marginTop: 10, color: Colors.calmWhite }]}>{examData.questions[currentQuestion].title}</Text>
                <Text style={[ConstantStyles.Title2, { fontSize: 22, textAlign: 'center', marginTop: 10, color: Colors.calmWhite }]}>{examData.questions[currentQuestion].description}</Text>
              </View>
              <View>
                {examData.questions[currentQuestion].answers.map((answer: any, index: any) => {
                  const isSelected = exam.answers[currentQuestion]?.answer === answer.answer;
                  const isCorrect = answer.isRight === 'true';
                  const backgroundColor = isSelected ? (isCorrect ? '#b9f5b6' : '#f5bfb6') : Colors.calmWhite;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 10,
                        padding: 10,
                        backgroundColor: backgroundColor,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: Colors.textColor,
                      }}
                      onPress={() => handelAnswers(answer)}
                    >
                      <Text style={[ConstantStyles.Title1, { fontSize: 22, textAlign: 'center' }]}>{answer.answer}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* Score */}
              <View style={{ height: 60 }}>

              </View>
              <View style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', margin: 10, padding: 10, position: 'absolute', bottom: 0, width: '100%' }}>
                {submitExam && currentQuestion === examData.questions.length - 1 ? (
                  <>
                    <TouchableOpacity style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }} onPress={() => {
                      setSubmitExam(true)
                      submitExamHandler()
                    }}>
                      <Text style={[ConstantStyles.Title1, { fontSize: 20, color: Colors.calmWhite, marginRight: 10 }]}>تسليم الامتحان</Text>
                      <FontAwesome5 name="paper-plane" size={24} color="white" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {nextShow ? (
                      <TouchableOpacity style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }} onPress={() => {
                        setCurrentQuestion(currentQuestion + 1)
                      }}>
                        <Text style={[ConstantStyles.Title1, { fontSize: 20, color: Colors.calmWhite, marginRight: 10 }]}>التالي</Text>
                        <FontAwesome5 name="angle-right" size={24} color="white" />
                      </TouchableOpacity>

                    ) : (
                      <></>
                    )}

                  </>
                )}
                {currentQuestion !== 0 && (
                  <TouchableOpacity style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }} onPress={() => {
                    setCurrentQuestion(currentQuestion - 1)
                    setNextShow(true)
                  }}>
                    <FontAwesome5 name="angle-left" size={24} color="white" />
                    <Text style={[ConstantStyles.Title1, { fontSize: 20, color: Colors.calmWhite, marginLeft: 10 }]}>السابق</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </>
        ) : (
          <>
            {showScore ? (
              <>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                  {score >= totalExamPoints / 2 ? (
                    <>
                      <LottieView
                        source={require('../../assets/animations/party.json')}
                        autoPlay
                        loop
                        style={{
                          width: 300,
                          height: 300,
                          margin: 10,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <LottieView
                        source={require('../../assets/animations/sad.json')}
                        autoPlay
                        loop
                        style={{
                          width: 300,
                          height: 300,
                          margin: 10,
                        }}
                      />
                    </>
                  )}
                  <Text style={[ConstantStyles.Title1, { fontSize: 26, textAlign: 'center', marginVertical: 10, color: Colors.calmWhite }]}>النتيجة النهائية</Text>
                  <Text style={[ConstantStyles.Title2, { fontSize: 22, textAlign: 'center', color: score >= totalExamPoints ? '#39FF14' : 'yellow' }]}>الدرجة: {score} من {totalExamPoints}</Text>
                  {score >= totalExamPoints / 2 ? <Text style={[ConstantStyles.Title1, { fontSize: 28, textAlign: 'center', color: '#39FF14' }]}>شاطر يا صديقي .. استمر</Text> : <Text style={[ConstantStyles.Title1, { fontSize: 26, textAlign: 'center', color: 'yellow' }]}>ذاكر اكتر و هتنجح المرة الجاية</Text>}
                  <View>
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 20, padding: 10, backgroundColor: Colors.calmWhite, borderRadius: 5, borderWidth: 1, borderColor: Colors.textColor, width: 250 }} onPress={() => {
                      router.push({
                        pathname: '/(subPages)/reviewExam',
                        params: {
                          exam: JSON.stringify(exam)
                        }
                      })
                    }}>
                      <Text style={[ConstantStyles.Title1, { fontSize: 22, textAlign: 'center' }]}>مراجعة الاجابات</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10, padding: 10, backgroundColor: Colors.calmWhite, borderRadius: 100, width: 170, height: 170 }}>
                      <TouchableOpacity style={{
                        backgroundColor: Colors.mainColor,
                        width: 150,
                        height: 150,
                        padding: 10,
                        borderRadius: 100,
                        margin: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }} onPress={() => {
                        router.replace('/(tabs)')
                      }}>
                        <FontAwesome5 name="home" size={26} color="white" />
                        <Text style={[ConstantStyles.Title1, { fontSize: 20, color: Colors.calmWhite, marginTop: 10 }]}>الرئيسية</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <ScrollView showsVerticalScrollIndicator={false} style={ConstantStyles.page}>
                  <View style={styles.videoContainer}>
                    <Image source={require('../../assets/images/lesson/doExam.png')} style={{ width: '100%', height: 200 }} />
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginVertical: 10 }}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 26 }]}>{examData.title}</Text>
                    <Text style={[ConstantStyles.Title2, { fontSize: 22, }]}>الوقت: {examData.time}د</Text>
                    <Text style={[ConstantStyles.Title2, { fontSize: 22, }]}>الاسألة: {examData.questions.length} سؤال</Text>
                    <Text style={[ConstantStyles.Title2, { fontSize: 22, }]}>مجموع الدرجات: {totalExamPoints} درجة</Text>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginVertical: 10 }}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 24, marginBottom: 10 }]}>الوصف:</Text>
                    <Text style={[ConstantStyles.Title2, { fontSize: 18 }]}>{examData.description}</Text>
                  </View>

                  {/* Start Btn */}
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10, padding: 10, backgroundColor: Colors.calmWhite, borderRadius: 100, width: 170, height: 170 }}>
                      <TouchableOpacity style={{
                        backgroundColor: Colors.mainColor,
                        width: 150,
                        height: 150,
                        padding: 10,
                        borderRadius: 100,
                        margin: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }} onPress={() => {
                        StartExam()
                      }}>
                        <FontAwesome5 name="play" size={30} color="white" />
                        <Text style={[ConstantStyles.Title1, { fontSize: 20, color: Colors.calmWhite, marginTop: 10 }]}>ابدأ الامتحان</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </>
        )
        }
      </SafeAreaView >
    </>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.calmWhite,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.calmWhite,
  },
})