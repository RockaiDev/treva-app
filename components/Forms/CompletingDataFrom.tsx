import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import axios from 'axios'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropDownPicker from 'react-native-dropdown-picker'
import Constants from 'expo-constants'


export default function CompletingDataFrom({ user }: any) {
    const [grade, setGrade] = useState('')
    const [major, setMajor] = useState('')
    const grades = [
        { label: "الصف الاول الثانوي", value: "الصف الاول الثانوي" },
        { label: "الصف الثاني الثانوي", value: "الصف الثاني الثانوي" },
        { label: "الصف الثالث الثانوي", value: "الصف الثالث الثانوي" },
    ]
    const [openGrade, setOpenGrade] = useState(false)
    const [openMajor, setOpenMajor] = useState(false)
    const _id = user._id

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


    const HandleSubmit = async () => {
        if (grade && major) {
            await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, { _id, grade, major }).then(res => {
                console.log(res.data)
                const updateUser = { ...user, grade, major }
                AsyncStorage.setItem('user', JSON.stringify(updateUser))
                alert('تم تحديث البيانات بنجاح')
                router.push('/(tabs)/Profile')

            }).catch(err => {
                console.log(err)
                alert('حدث خطأ ما')
            })
        } else {
            alert('يجب اكمال البيانات')
        }
    }


    return (
        <>
            <View style={styles.FormContainer}>
                <Text style={ConstantStyles.Title2}>اكمل بياناتك</Text>
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        style={styles.dropdown}
                        open={openGrade}
                        value={grade}
                        items={grades}
                        setOpen={setOpenGrade}
                        setValue={setGrade}
                        placeholder='اختر الصف الدراسي'
                        zIndex={100}
                    />
                </View>
                <View style={[styles.dropdownContainer, {marginTop: 100}]}>
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
                <Text style={ConstantStyles.normalText}>ملاحظة: يجب اكمال البيانات للمتابعة</Text>
                <TouchableOpacity onPress={HandleSubmit}>
                    <Text style={ConstantStyles.btn}>حفظ</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    FormContainer: {
        width: '100%',
        display: "flex",
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: 20,
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
        marginVertical: 10,
    },
    dropdownContainer: {
        width: 300
    }
})