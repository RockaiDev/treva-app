import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDataContext } from '@/components/context/DataContext'
import { router } from 'expo-router'
import Loading from '@/components/Loading'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker';
import { Fonts } from '@/constants/Fonts'
import Constants from 'expo-constants'
import { Platform } from 'react-native'



export default function EditUser() {
    const [user, setUser] = useState<any>()
    const { users } = useDataContext()
    const role = 'student'

    const _id = user?._id

    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [grade, setGrade] = useState('')
    const [major, setMajor] = useState('')
    const grades = [
        { label: "الصف الاول الثانوي", value: "الصف الاول الثانوي" },
        { label: "الصف الثاني الثانوي", value: "الصف الثاني الثانوي" },
        { label: "الصف الثالث الثانوي", value: "الصف الثالث الثانوي" },
    ]
    const [openGrade, setOpenGrade] = useState(false)
    const [openMajor, setOpenMajor] = useState(false)

    const majorArrayFor1 = [
        { label: "عام", value: "عام" }
    ]
    const majorArrayFor2 = [
        { label: "علمي", value: "علمي" },
        { label: "ادبي", value: "ادبي" }
    ]
    const majorArrayFor3 = [
        { label: "علمي علوم", value: "علمي علوم" },
        { label: "علمي رياضة", value: "علمي رياضة" },
        { label: "ادبي", value: "ادبي" }
    ]


    useEffect(() => {
        const fetchUser = async () => {
            const userExist = await AsyncStorage.getItem('user')
            if (userExist) {
                setUser(JSON.parse(userExist))
                setName(JSON.parse(userExist).name)
                setEmail(JSON.parse(userExist).email)
                setMobile(JSON.parse(userExist).mobile)
                setPassword(JSON.parse(userExist).password)
                setImage(JSON.parse(userExist).image)
                setGrade(JSON.parse(userExist).grade)
                setMajor(JSON.parse(userExist).major)
            } else {
                router.push('/(SignIn)')
            }

        }
        fetchUser()
    }, [])

    const SelectPhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
            console.log(result.assets[0].uri)
        }
    }

    const handleUpdateUserData = async () => {
        if (name && email && mobile && password && grade && major) {
            await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, { _id, image, name, email, mobile, password, grade, major, role }).then(res => {
                Alert.alert("بيانات الطالب",'تم تحديث البيانات بنجاح')
                const updateUser = { ...user, image, name, email, mobile, password, grade, major, role }
                AsyncStorage.setItem('user', JSON.stringify(updateUser))
            }).catch(err => {
                console.log(err)
                Alert.alert("بيانات الطالب",'حدث خطأ ما')
            })
        } else {
            Alert.alert("بيانات الطالب",'يجب اكمال البيانات')
        }
    }

    if (!user) {
        return <Loading />
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[ConstantStyles.page, { padding: 0, backgroundColor: Colors.calmWhite }]}
        >

            {/* User Photo */}
            <View style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <TouchableOpacity onPress={() => SelectPhoto()} style={styles.imageContainer}>
                    <Image source={{ uri: image || 'https://res.cloudinary.com/db152mwtg/image/upload/v1743082693/Treva%20Edu%20App/users/tvcrzrw1taqco4d6hpfy.png' }} style={styles.image} />
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderRadius: 50,
                        padding: 5,
                    }}>
                        <MaterialCommunityIcons name="image-edit" size={24} color={Colors.mainColor} />
                    </View>
                </TouchableOpacity>
                {/* Delete Image */}
                {image && <TouchableOpacity
                    onPress={() => {
                        setImage('')
                    }}
                >
                    <Text style={{ color: 'red', fontSize: 18, fontFamily: Fonts.mediumText, marginTop: 10 }}>حذف الصورة</Text>
                </TouchableOpacity>}
            </View>


            {/* Grade and Major */}
            <View style={[ConstantStyles.section, { backgroundColor: Colors.calmWhite, padding: 20, margin:0 }]}>

                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        style={[styles.dropdown]}
                        open={openMajor}
                        value={major}
                        items={grade === 'الصف الاول الثانوي' ? majorArrayFor1 : grade === 'الصف الثاني الثانوي' ? majorArrayFor2 : majorArrayFor3}
                        setOpen={setOpenMajor}
                        setValue={setMajor}
                        placeholder='اختر التخصص'
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        style={styles.dropdown}
                        open={openGrade}
                        value={grade}
                        items={grades}
                        setOpen={setOpenGrade}
                        setValue={setGrade}
                        onDirectionChanged={() => setMajor('')} 
                        placeholder='اختر الصف الدراسي'
                        zIndex={100}
                    />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[ConstantStyles.page, { padding: 0, marginTop: 0, marginVertical: 0 }]}
            >
                {/* User Info */}
                <View style={[ConstantStyles.section, { backgroundColor: Colors.calmWhite, padding: 20}]}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                        marginVertical: 10
                    }}>
                       
                        <Text style={[ConstantStyles.lableText, { fontSize: 15, color: Colors.mainColor }]}>الاسم</Text>
                        <TextInput
                            placeholder={user.name}
                            placeholderTextColor={"#ccc"}
                            style={[ConstantStyles.inputText, { width: '70%', fontSize: 15 }]}
                            value={name}
                            onChangeText={(e) => setName(e)}
                        />
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                        marginVertical: 10
                    }}>
                       
                        <Text style={[ConstantStyles.lableText, { fontSize: 15, color: Colors.mainColor }]}>البريد الالكتروني</Text>
                        <TextInput
                            placeholder={user.email}
                            placeholderTextColor={"#ccc"}
                            style={[ConstantStyles.inputText, { width: '60%', fontSize: 15 }]}
                            value={email}
                            onChangeText={(e) => setEmail(e)}
                        />
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                        marginVertical: 10
                    }}>
                       
                        <Text style={[ConstantStyles.lableText, { fontSize: 15, color: Colors.mainColor }]}>رقم الجوال</Text>
                        <TextInput
                            placeholder={user.mobile}
                            keyboardType='phone-pad'
                            placeholderTextColor={"#ccc"}
                            style={[ConstantStyles.inputText, { width: '70%', fontSize: 15 }]}
                            value={mobile}
                            onChangeText={(e) => setMobile(e)}
                        />
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                        marginVertical: 10
                    }}>
                       
                        <Text style={[ConstantStyles.lableText, { fontSize: 15, color: Colors.mainColor }]}>كلمة المرور</Text>
                        <TextInput
                            placeholder="******"
                            placeholderTextColor={"#ccc"}
                            style={[ConstantStyles.inputText, { width: '70%', fontSize: 15 }]}
                            secureTextEntry
                            value={password}
                            onChangeText={(e) => setPassword(e)}
                        />
                    </View>

                    <TouchableOpacity
                        style={{marginBottom: 20}}    
                        onPress={() => {
                        handleUpdateUserData()
                        }}
                    >
                        <Text style={ConstantStyles.btn}>حفظ</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView >
    )
}


const styles = StyleSheet.create({
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginTop: 10,
        backgroundColor: Colors.calmWhite,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    dropdown: {
        height: 50,
        borderColor: Colors.mainColor,
        borderWidth: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: Colors.bgColor,
        color: Colors.bgColor,
        paddingHorizontal: 20,
        marginVertical: 5,
    },
    dropdownContainer: {
        width: '100%',
        direction: 'ltr',
    }
})
