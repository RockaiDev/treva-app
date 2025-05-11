import { Alert, Dimensions, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { lesson, user } from '@/components/context/DataContext'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { Feather, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { ConstantStyles } from '@/constants/constantStyles'
import { useVideoPlayer, VideoView } from 'expo-video'
import YoutubeIframe, { YoutubeIframeRef } from 'react-native-youtube-iframe'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import Constants from 'expo-constants'
import { usePreventScreenCapture } from 'expo-screen-capture'
import Slider from '@react-native-community/slider'

interface props {
  lesson: lesson
  user: user
}

export default function HWReview() {
  const { lesson, user } = useLocalSearchParams();
  const player = useRef<YoutubeIframeRef>(null)
  const [playing, setPlaying] = useState(false)
  const [playing2, setPlaying2] = useState(false)
  const [openFullScreen, setOpenFullScreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showcontrolers, setShowControlers] = useState(true)
  const [hasLesson, setHasLesson] = useState(false)
  const [openBuyLesson, setOpenBuyLesson] = useState(false)
  const [CardBuyLesson, setCardBuyLesson] = useState(false)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const userData = Array.isArray(user) ? JSON.parse(user[0]) : JSON.parse(user)
  const lessonData = Array.isArray(lesson) ? JSON.parse(lesson[0]) : JSON.parse(lesson)
  const HomeWrokVideo = Array.isArray(lesson) ? JSON.parse(lesson[0]).homeWorkVideo : JSON.parse(lesson).homeWorkVideo
  const MonthlyPaymentBills = userData.bills.filter((bill: any) => {
    const billDate = typeof (bill.date) === 'string' ? null : bill
    const monthlypaymentMethod = bill.method = 'الاشتراك الشهري'
    return billDate && monthlypaymentMethod
  })

  if (userData?.mobile !== '01555555555') {
    usePreventScreenCapture()
  }

  const onshowControlers = () => {
    setShowControlers((prev) => !prev);
    if (!showcontrolers) {
      const timeout = setTimeout(() => {
        setShowControlers(false);
      }, 5000);

      return () => clearTimeout(timeout); // Clear timeout if the component unmounts or re-renders
    }
  }

  const toggleControls = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    setShowControls(!showControls);

    Animated.timing(fadeAnim, {
      toValue: showControls ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (!showControls) {
      hideTimeout.current = setTimeout(() => {
        setShowControls(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 5000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onVideoProgress = (state: { currentTime: number }) => {
    if (state.currentTime !== currentTime) {
      setCurrentTime(state.currentTime);
    }
  };

  const onVideoReady = () => {
    player.current?.getDuration().then((duration) => {
      if (duration) {
        setDuration(duration);
      }
    });
  };

  const handleSeek = async (value: number) => {
    if (player.current) {
      await player.current.seekTo(value, true);
      setCurrentTime(value);
    }
  };

  useEffect(() => {
    // check if user has this lesson and if the available time for this lesson is not expired
    if (userData.lessons.find((les: any) => les._id === lessonData?._id) || userData.type === 'TrevaIn') {
      if (userData.type === 'TrevaIn') {
        if (MonthlyPaymentBills[MonthlyPaymentBills.length - 1]?.date !== undefined) {
          const lastBill = MonthlyPaymentBills[MonthlyPaymentBills.length - 1]
          console.log(new Date(lastBill.date).getTime() + (30 * 24 * 60 * 60 * 1000) > Date.now())
          if (new Date(lastBill.date).getTime() + (30 * 24 * 60 * 60 * 1000) > Date.now()) {
            setHasLesson(true)
          } else {
            Alert.alert('يجب عليك دفع الاشتراك الشهري لطلاب المعهد', ' قيمة الاشتراك 400 جنية مصري شهرياً', [
              {
                text: 'دفع الاشتراك',
                onPress: () => {
                  router.push('/(tabs)/Wallet')
                }
              },
              {
                text: 'الغاء',
                onPress: () => setOpenBuyLesson(false)
              }
            ])
            setHasLesson(false)
          }
        } else {
          Alert.alert('يجب عليك دفع الاشتراك الشهري لطلاب المعهد', ' قيمة الاشتراك 400 جنية مصري شهرياً', [
            {
              text: 'دفع الاشتراك',
              onPress: () => {
                router.push('/(tabs)/Wallet')
              }
            },
            {
              text: 'الغاء',
              onPress: () => setOpenBuyLesson(false)
            }
          ])
          setHasLesson(false)
        }
      } else {
        const lessonwithDate = userData.lessons.find((les: any) => les._id === lessonData?._id)
        if (lessonwithDate.date + +lessonData?.availableFor * 24 * 60 * 60 * 1000 < Date.now()) {
          Alert.alert('انتهت صلاحية المحاضرة', 'لقد انتهت صلاحية المحاضرة يرجى شراء المحاضرة للوصول اليها')
          setHasLesson(false)
          setOpenBuyLesson(false)
        } else {
          setHasLesson(true)
        }
      }
    } else {
      setHasLesson(false)
    }
  }, [])


  const BuyLesson = async () => {
    const lesson = {
      _id: lessonData?._id,
      date: Date.now()
    }
    if (lessonData?.price !== undefined) {
      if (+userData.points < +lessonData.price) {
        Alert.alert(`${lessonData?.title}`, 'لا يوجد لديك رصيد كافي لشراء المحاضرة')
        router.push('/(tabs)/Wallet')
        setHasLesson(false)
      } else {
        if (userData.lessons.find((les: any) => les._id === lessonData?._id)) {
          const updatedLesson = {
            ...lesson,
            date: Date.now()
          };
          const updatedUser = {
            ...userData,
            points: +userData.points - +lessonData.price,
            lessons: userData.lessons.map((les: any) =>
              les._id === lessonData?._id ? updatedLesson : les
            )
          };
          await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, updatedUser).then(res => {
            AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            Alert.alert(`${lessonData?.title}`, 'تم شراء المحاضرة بنجاح');
            setHasLesson(true);
            setCardBuyLesson(false);
          }).catch(err => {
            console.log(err);
          });

        } else {
          const bills = userData.bills
          const bill = {
            cost: lessonData.price,
            code: Date.now().toString(),
            date: Date.now(),
            method: `شراء محاضرة ${lessonData?.title}`,
          }
          const updatedUser = { ...userData, points: +userData.points - +lessonData.price, lessons: [...userData.lessons, lesson], bills: [...bills, bill] }
          await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, updatedUser).then(res => {
            AsyncStorage.setItem('user', JSON.stringify(updatedUser))
            Alert.alert(`${lessonData?.title}`, 'تم شراء المحاضرة بنجاح')
            setHasLesson(true)
            setCardBuyLesson(false)
          }).catch(err => {
            console.log(err)
          })
        }
      }
    }
  }


  const installPDF = async () => {
    if (hasLesson) {
      await Linking.openURL(HomeWrokVideo.attaches)
    } else {
      setOpenBuyLesson(false)
    }
  }

  // Add useEffect to update time periodically
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (playing || playing2) {
      interval = setInterval(async () => {
        const time = await player.current?.getCurrentTime() || 0;
        setCurrentTime(time);
      }, 1000); // Update every second
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [playing, playing2]);

  // Initialize controls visibility
  useEffect(() => {
    // Show controls initially
    setShowControls(true);
    fadeAnim.setValue(1);

    // Auto-hide after 5 seconds
    hideTimeout.current = setTimeout(() => {
      setShowControls(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'فيديو الواجب',
          headerStyle: {
            backgroundColor: Colors.mainColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 20, width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
            >
              <FontAwesome name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
          )
        }}

      />

      <ScrollView style={ConstantStyles.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoContainer}>
          <YoutubeIframe
            videoId={HomeWrokVideo.link}
            height={Dimensions.get('window').height / 3 + 40}
            play={playing}
            width={Dimensions.get('window').width + 40}
            initialPlayerParams={{
              controls: false,
              showClosedCaptions: false,
              modestbranding: false,
              rel: false,
              iv_load_policy: 3,
            }}
            webViewProps={{
              allowsFullscreenVideo: true,
            }}
            contentScale={0.000000000001}
            ref={player}
            onPlaybackStatusUpdate={onVideoProgress}
            onReady={onVideoReady}
            onChangeState={(state: string) => {
              if (state === 'ended') {
                setPlaying(false);
              }
            }}
          />

          {/* Touchable layer for controls */}
          <TouchableOpacity
            onPress={toggleControls}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          />

          {/* Animated controls container */}
          <Animated.View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              padding: 8,
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.8)',
              width: '100%',
              height: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: 'rtl',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }}
          >
            {/* Timeline Slider */}
            <View style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 8,
              marginBottom: 8,
            }}>
              <Text style={{
                color: Colors.calmWhite,
                fontSize: 12,
                fontFamily: 'System',
                fontWeight: '500',
                minWidth: 40,
                textAlign: 'center',
              }}>{formatTime(currentTime)}</Text>
              <Slider
                style={{ flex: 1, marginHorizontal: 12, height: 30 }}
                minimumValue={0}
                maximumValue={duration || 1}
                value={currentTime}
                onSlidingComplete={handleSeek}
                minimumTrackTintColor={Colors.mainColor}
                maximumTrackTintColor="rgba(255,255,255,0.2)"
                thumbTintColor={Colors.mainColor}
                step={1}
              />
              <Text style={{
                color: Colors.calmWhite,
                fontSize: 12,
                fontFamily: 'System',
                fontWeight: '500',
                minWidth: 40,
                textAlign: 'center',
              }}>{formatTime(duration)}</Text>
            </View>

            {/* Control Buttons */}
            <View style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 8,
            }}>
              {/* FullScreen */}
              <TouchableOpacity
                onPress={async () => {
                  setOpenFullScreen(!openFullScreen)
                  const time = await player.current?.getCurrentTime() || 0;
                  setCurrentTime(time);
                  setPlaying(false)
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: 6,
                }}
              >
                <MaterialIcons name="fullscreen" size={20} color={Colors.calmWhite} />
              </TouchableOpacity>

              <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                direction: 'ltr',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 6,
                padding: 4,
              }}>
                {/* before 10 sec */}
                <TouchableOpacity
                  onPress={async () => player.current?.seekTo(await player.current?.getCurrentTime() - 10, true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 6,
                  }}
                >
                  <MaterialIcons name="replay-10" size={20} color={Colors.calmWhite} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPlaying(!playing)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 6,
                    marginHorizontal: 8,
                  }}
                >
                  {playing ? (
                    <MaterialIcons name="pause" size={24} color={Colors.calmWhite} />
                  ) : (
                    <Feather name="play" size={24} color={Colors.calmWhite} />
                  )}
                </TouchableOpacity>

                {/* after 10 sec */}
                <TouchableOpacity
                  onPress={async () => player.current?.seekTo(await player.current?.getCurrentTime() + 10, true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 6,
                  }}
                >
                  <MaterialIcons name="forward-10" size={20} color={Colors.calmWhite} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => player.current?.seekTo(0, true)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: 6,
                }}
              >
                <MaterialIcons name="replay" size={20} color={Colors.calmWhite} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              padding: 5,
              zIndex: 1,
              backgroundColor: Colors.mainColor,
              width: '100%',
              height: 20,
            }}
          />

          {!hasLesson && (
            <TouchableOpacity
              onPress={() => setOpenBuyLesson(false)}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                zIndex: 50,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(30,5,80,0.5)',
                borderRadius: 5,
                padding: 5,
              }}
            >
              <MaterialIcons name='lock-outline' size={50} color={Colors.calmWhite} />
            </TouchableOpacity>
          )}

        </View>
        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', margin: 10, direction: 'rtl' }}>
          <Text style={[ConstantStyles.Title1, { fontSize: 26, textAlign: 'left' }]}>{HomeWrokVideo.title}</Text>
          <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 0 }]}>تاريخ المحاضرة: {new Date(lessonData.updatedAt).toLocaleDateString()}</Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10, direction: 'rtl' }}>
          <Text style={[ConstantStyles.Title2, { fontSize: 18 }]}>المادة: {lessonData.subject}</Text>
          <Text style={[ConstantStyles.Title2, { fontSize: 18 }]}>الصف: {lessonData.grade}</Text>
        </View>

        {/* Description */}
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginVertical: 10 }}>
          <Text style={[ConstantStyles.Title1, { fontSize: 24 }]}>الوصف</Text>
          <Text style={[ConstantStyles.normalText, { fontSize: 20, color: Colors.textColor, textAlign: 'left' }]}>{HomeWrokVideo?.description}</Text>
        </View>

        {/* attaches */}
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', direction: 'rtl', marginVertical: 10 }}>
          <Text style={[ConstantStyles.Title1, { fontSize: 24 }]}>المرفقات</Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
            {HomeWrokVideo.attaches ? (
              <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 10, padding: 10, borderWidth: 1, borderColor: Colors.mainColor, borderRadius: 5, width: '100%' }}
                onPress={() => installPDF()}
              >
                <FontAwesome5 name="file-pdf" size={30} color={Colors.mainColor} />
                <Text style={[ConstantStyles.Title2, { fontSize: 18, marginRight: 10 }]}>{HomeWrokVideo.attaches.slice(0, 40)}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[ConstantStyles.normalText, { fontSize: 20, color: Colors.textColor, textAlign: 'left' }]}>لا يوجد مرفقات</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Full Screen Modal horizontally */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={openFullScreen}
        onRequestClose={() => setOpenFullScreen(!openFullScreen)}
      >
        <View style={{ flex: 1, backgroundColor: 'black', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          {showcontrolers && (

            <TouchableOpacity
              onPress={() => setOpenFullScreen(!openFullScreen)}
              style={{ position: 'absolute', bottom: 50, right: 20, zIndex: 2 }}
            >
              <FontAwesome name="close" size={50} color="white" />
            </TouchableOpacity>
          )}
          <View style={{ transform: [{ rotate: '90deg' }], width: Dimensions.get('window').height, height: Dimensions.get('window').width, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <YoutubeIframe
              videoId={HomeWrokVideo.link}
              height={Dimensions.get('window').width + 40}
              play={playing2}
              width={Dimensions.get('window').height}
              initialPlayerParams={{
                controls: false,
                showClosedCaptions: false,
                modestbranding: false,
                rel: false,
                iv_load_policy: 3,
              }}
              webViewProps={{
                allowsFullscreenVideo: true,
              }}
              contentScale={0.000000000001}
              ref={player}
              onPlaybackStatusUpdate={onVideoProgress}
              onReady={onVideoReady}
              onChangeState={(state: string) => {
                if (state === 'ended') {
                  setPlaying2(false);
                }
              }}
            />
          </View>


          <TouchableOpacity
            onPress={toggleControls}
            style={{
              position: 'absolute',
              height: 1000,
              width: Dimensions.get('window').height,
              padding: 5,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              direction: 'rtl',
              transform: [{ rotate: '90deg' }],
            }}
          >
            {showControls && (
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                direction: 'ltr',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 15,
                paddingHorizontal: 40,
                borderRadius: 12,
                position: 'absolute',
                right: 20,
                bottom: '25%',
                width: '100%',
                transform: [{ translateY: -50 }],
              }}>

                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  direction: 'ltr',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: 8,
                }}>
                  {/* before 10 sec */}
                  <TouchableOpacity
                    onPress={async () => player.current?.seekTo(await player.current?.getCurrentTime() - 10, true)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 8,
                    }}
                  >
                    <MaterialIcons name="replay-10" size={30} color={Colors.calmWhite} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPlaying2(!playing2)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 8,
                      marginHorizontal: 15,
                    }}
                  >
                    {playing2 ? (
                      <MaterialIcons name="pause" size={35} color={Colors.calmWhite} />
                    ) : (
                      <Feather name="play" size={35} color={Colors.calmWhite} />
                    )}
                  </TouchableOpacity>

                  {/* after 10 sec */}
                  <TouchableOpacity
                    onPress={async () => player.current?.seekTo(await player.current?.getCurrentTime() + 10, true)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 8,
                    }}
                  >
                    <MaterialIcons name="forward-10" size={30} color={Colors.calmWhite} />
                  </TouchableOpacity>
                </View>
                {/* Timeline Slider */}
                <View style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                  paddingHorizontal: 15,
                }}>
                  <Text style={{
                    color: Colors.calmWhite,
                    fontSize: 14,
                    fontFamily: 'System',
                    fontWeight: '500',
                    minWidth: 45,
                    textAlign: 'center',
                  }}>{formatTime(currentTime)}</Text>
                  <Slider
                    style={{ flex: 1, marginHorizontal: 15, height: 30 }}
                    minimumValue={0}
                    maximumValue={duration || 1}
                    value={currentTime}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor={Colors.mainColor}
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor={Colors.mainColor}
                    step={1}
                  />
                  <Text style={{
                    color: Colors.calmWhite,
                    fontSize: 14,
                    fontFamily: 'System',
                    fontWeight: '500',
                    minWidth: 45,
                    textAlign: 'center',
                  }}>{formatTime(duration)}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

        </View>
      </Modal>


      {!hasLesson && (

        <Modal
          animationType="slide"
          transparent={true}
          visible={!openBuyLesson}
          onRequestClose={() => {
            setOpenBuyLesson(true);
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', pointerEvents: hasLesson ? 'none' : 'auto' }}>
            <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => {
              setOpenBuyLesson(true)
            }} />
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: 270, backgroundColor: Colors.calmWhite, borderRadius: 10, padding: 20 }}>
              <Text style={[ConstantStyles.Title1, { fontSize: 26 }]}>يجب شراء المحاضرة اولاً</Text>
              <Text style={[ConstantStyles.normalText, { fontSize: 18, marginBottom: 5, color: Colors.textColor, textAlign: 'center' }]}>قم بشراء المحاضرة لتتمكن من مشاهدة الفيديوهات والامتحان</Text>
              <Text style={[ConstantStyles.Title1, { fontSize: 24, marginTop: 10 }]}>السعر: {lessonData?.price} ج.م</Text>
              <TouchableOpacity style={{ backgroundColor: Colors.mainColor, padding: 10, borderRadius: 5, marginTop: 10, width: '100%' }} onPress={() => {
                setHasLesson(true)
                setCardBuyLesson(true)
              }}>
                <Text style={[ConstantStyles.Title1, { fontSize: 20, color: Colors.calmWhite, textAlign: 'center' }]}>شراء المحاضرة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {CardBuyLesson && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={CardBuyLesson}
          onRequestClose={() => {
            setCardBuyLesson(false);
            setHasLesson(false)
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', pointerEvents: !CardBuyLesson ? 'none' : 'auto' }}>
            <LinearGradient
              colors={[Colors.bgColor, Colors.itemBgColor, Colors.bgColor]}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', backgroundColor: Colors.calmWhite, borderRadius: 10 }}
            >
              <ScrollView
                style={{ width: '100%', height: '100%', paddingVertical: 120, flex: 1 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <View style={[ConstantStyles.shadowContainer, { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', backgroundColor: Colors.calmWhite, borderRadius: 10, padding: 10, marginBottom: 20, width: 200, height: 60, direction: 'rtl' }]}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 30, color: Colors.textColor }]}>تأكيد الشراء</Text>
                    <Image source={require('../../assets/images/handMoney.png')} style={{
                      width: 50,
                      height: 110,
                      position: 'absolute',
                      bottom: 0,
                      right: -5,
                    }} />
                  </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 20 }}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', direction: 'rtl', marginBottom: 20 }}>
                    <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 5, marginRight: 10 }]}>عنوان المحاضرة:</Text>
                    <View style={[ConstantStyles.shadowContainer, { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.calmWhite, padding: 5, width: 200, borderRadius: 20, height: 40, marginLeft: 10 }]}>
                      <Text style={[ConstantStyles.Title2, { fontSize: 14, color: Colors.mainColor, marginBottom: 0 }]}>{lessonData.title}</Text>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', direction: 'rtl', marginBottom: 20 }}>
                    <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 5, marginRight: 10 }]}>المادة:</Text>
                    <View style={[ConstantStyles.shadowContainer, { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.calmWhite, padding: 5, width: 200, borderRadius: 20, height: 40, marginLeft: 10 }]}>
                      <Text style={[ConstantStyles.Title2, { fontSize: 14, color: Colors.mainColor, marginBottom: 0 }]}>{lessonData.subject}</Text>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', direction: 'rtl', marginBottom: 20 }}>
                    <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 5, marginRight: 10 }]}>الصف:</Text>
                    <View style={[ConstantStyles.shadowContainer, { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.calmWhite, padding: 5, width: 200, borderRadius: 20, height: 40, marginLeft: 10 }]}>
                      <Text style={[ConstantStyles.Title2, { fontSize: 14, color: Colors.mainColor, marginBottom: 0 }]}>{lessonData.grade}</Text>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', direction: 'rtl', marginBottom: 20 }}>
                    <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 5, marginRight: 10 }]}>السعر:</Text>
                    <View style={[ConstantStyles.shadowContainer, { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.calmWhite, padding: 5, width: 200, borderRadius: 20, height: 40, marginLeft: 10 }]}>
                      <Text style={[ConstantStyles.Title2, { fontSize: 14, color: Colors.mainColor, marginBottom: 0 }]}>{lessonData?.price} جنية مصري</Text>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', direction: 'rtl', marginBottom: 20 }}>
                    <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 5, marginRight: 10 }]}>الرصيد الحالي:</Text>
                    <View style={[ConstantStyles.shadowContainer, { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.calmWhite, padding: 5, width: 200, borderRadius: 20, height: 40, marginLeft: 10 }]}>
                      <Text style={[ConstantStyles.Title2, { fontSize: 14, color: Colors.mainColor, marginBottom: 0 }]}>{userData.points} جنية مصري</Text>
                    </View>
                  </View>
                  {userData.points - lessonData?.price < 0 ? (
                    <Text style={[ConstantStyles.Title2, { fontSize: 18, marginBottom: 5, color: 'red' }]}>لا يوجد لديك رصيد كافي لشراء المحاضرة</Text>
                  ) : (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', direction: 'rtl', marginBottom: 20 }}>
                      <Text style={[ConstantStyles.Title2, { fontSize: 16, marginBottom: 5, marginRight: 10 }]}>الرصيد بعد عملية الشراء:</Text>
                      <View style={[ConstantStyles.shadowContainer, { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.calmWhite, padding: 5, width: 160, borderRadius: 20, height: 40, marginLeft: 10 }]}>
                        <Text style={[ConstantStyles.Title2, { fontSize: 14, color: Colors.mainColor, marginBottom: 0 }]}>{userData.points - lessonData?.price} جنية مصري</Text>
                      </View>
                    </View>
                  )}
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginTop: 20 }}>
                  <TouchableOpacity style={{ backgroundColor: Colors.calmWhite, height: 50, padding: 10, borderRadius: 5, width: 110, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'flex-end', direction: 'rtl' }} onPress={() => {
                    setHasLesson(false)
                    setCardBuyLesson(false)
                  }}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 24, color: 'red', textAlign: 'center' }]}>الغاء</Text>
                    <Image source={require('../../assets/images/exit.png')} style={{
                      width: 62,
                      height: 62,
                      position: 'absolute',
                      bottom: -2,
                      right: -22,
                    }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: Colors.calmWhite, height: 50, padding: 10, borderRadius: 5, width: 110, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'flex-end', direction: 'rtl' }} onPress={() => {
                    BuyLesson()
                    setCardBuyLesson(false)
                  }}>
                    <Text style={[ConstantStyles.Title1, { fontSize: 24, color: 'green', textAlign: 'center' }]}>تأكيد</Text>
                    <Image source={require('../../assets/images/sure.png')} style={{
                      width: 60,
                      height: 60,
                      position: 'absolute',
                      bottom: -2,
                      right: -20,
                    }} />
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </LinearGradient>
          </View>
        </Modal >
      )
      }


    </>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 3,
    backgroundColor: Colors.mainColor,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.mainColor,
  },
})