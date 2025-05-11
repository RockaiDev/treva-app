import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import axios from 'axios'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropDownPicker from 'react-native-dropdown-picker'
import Constants from 'expo-constants'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'


export default function CompletingDataFrom({ user }: any) {
    const [educationLevel, setEducationLevel] = useState('')
    const [grade, setGrade] = useState('')
    const [major, setMajor] = useState('')

    const educationLevels = [
        { label: "المرحلة الاعدادية", value: "المرحلة الاعدادية" },
        { label: "المرحلة الثانوية", value: "المرحلة الثانوية" },
    ]

    const preparatoryGrades = [
        { label: "الصف الاول الاعدادي", value: "الصف الاول الاعدادي" },
        { label: "الصف الثاني الاعدادي", value: "الصف الثاني الاعدادي" },
        { label: "الصف الثالث الاعدادي", value: "الصف الثالث الاعدادي" },
    ]

    const secondaryGrades = [
        { label: "الصف الاول الثانوي", value: "الصف الاول الثانوي" },
        { label: "الصف الثاني الثانوي", value: "الصف الثاني الثانوي" },
        { label: "الصف الثالث الثانوي", value: "الصف الثالث الثانوي" },
    ]

    const [openEducationLevel, setOpenEducationLevel] = useState(false)
    const [openGrade, setOpenGrade] = useState(false)
    const [openMajor, setOpenMajor] = useState(false)
    const _id = user._id

    const majorArrayForPreparatory = [
        { label: "عام", value: "عام" }
    ]

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

    const getMajorArray = () => {
        if (educationLevel === "المرحلة الاعدادية") {
            return majorArrayForPreparatory
        } else {
            if (grade === 'الصف الاول الثانوي') return majorArrayFor1
            if (grade === 'الصف الثاني الثانوي') return majorArrayFor2
            if (grade === 'الصف الثالث الثانوي') return majorArrayFor3
            return []
        }
    }

    const HandleSubmit = async () => {
        if (educationLevel && grade && major) {
            await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, {
                _id,
                grade,
                major,
                educationLevel
            }).then(res => {
                console.log(res.data)
                const updateUser = { ...user, grade, major, educationLevel }
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
        <LinearGradient
            colors={[Colors.bgColor, Colors.itemBgColor, Colors.bgColor]}
            style={styles.container}
        >
            <View style={styles.FormContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name="graduation-cap" size={40} color={Colors.mainColor} />
                    <Text style={[ConstantStyles.Title2, styles.title]}>اكمل بياناتك</Text>
                </View>

                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>المرحلة الدراسية</Text>
                    <DropDownPicker
                        style={styles.dropdown}
                        open={openEducationLevel}
                        value={educationLevel}
                        items={educationLevels}
                        setOpen={(isOpen) => {
                            setOpenEducationLevel(isOpen)
                            setOpenGrade(false)
                            setOpenMajor(false)
                        }}
                        setValue={setEducationLevel}
                        placeholder='اختر المرحلة الدراسية'
                        zIndex={300}
                        onSelectItem={() => {
                            setGrade('')
                            setMajor('')
                        }}
                        textStyle={styles.dropdownText}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.dropdownItemText}
                        placeholderStyle={styles.placeholderText}
                        arrowIconStyle={styles.arrowIcon}
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                    />
                </View>

                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>الصف الدراسي</Text>
                    <DropDownPicker
                        style={styles.dropdown}
                        open={openGrade}
                        value={grade}
                        items={educationLevel === "المرحلة الاعدادية" ? preparatoryGrades : secondaryGrades}
                        setOpen={(isOpen) => {
                            setOpenGrade(isOpen)
                            setOpenEducationLevel(false)
                            setOpenMajor(false)
                        }}
                        setValue={setGrade}
                        placeholder='اختر الصف الدراسي'
                        zIndex={200}
                        onSelectItem={() => setMajor('')}
                        textStyle={styles.dropdownText}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.dropdownItemText}
                        placeholderStyle={styles.placeholderText}
                        arrowIconStyle={styles.arrowIcon}
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                    />
                </View>

                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>التخصص</Text>
                    <DropDownPicker
                        style={styles.dropdown}
                        open={openMajor}
                        value={major}
                        items={getMajorArray()}
                        setOpen={(isOpen) => {
                            setOpenMajor(isOpen)
                            setOpenEducationLevel(false)
                            setOpenGrade(false)
                        }}
                        setValue={setMajor}
                        placeholder='اختر التخصص'
                        zIndex={100}
                        textStyle={styles.dropdownText}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.dropdownItemText}
                        placeholderStyle={styles.placeholderText}
                        arrowIconStyle={styles.arrowIcon}
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                    />
                </View>

                <Text style={[ConstantStyles.normalText, styles.note]}>ملاحظة: يجب اكمال البيانات للمتابعة</Text>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={HandleSubmit}
                    activeOpacity={0.8}
                >
                    <Text style={styles.submitButtonText}>حفظ</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    FormContainer: {
        width: '100%',
        display: "flex",
        alignItems: 'center',
        justifyContent: "center",
        padding: Dimensions.get('window').width * 0.05,
        maxWidth: 500,
        alignSelf: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Dimensions.get('window').height * 0.04,
        gap: 15,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: Math.min(Dimensions.get('window').width * 0.07, 28),
        color: Colors.textColor,
        textAlign: 'center',
        fontFamily: Fonts.boldText,
    },
    dropdown: {
        height: Math.min(Dimensions.get('window').height * 0.07, 55),
        borderColor: Colors.mainColor,
        borderWidth: 1.5,
        borderRadius: 12,
        backgroundColor: Colors.calmWhite,
        paddingHorizontal: 20,
        marginVertical: 5,
        shadowColor: Colors.mainColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    dropdownText: {
        textAlign: 'right',
        fontFamily: Fonts.mediumText,
        fontSize: Math.min(Dimensions.get('window').width * 0.04, 16),
        color: Colors.textColor,
    },
    dropdownList: {
        borderColor: Colors.mainColor,
        borderWidth: 1.5,
        borderRadius: 12,
        backgroundColor: Colors.calmWhite,
        shadowColor: Colors.mainColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    dropdownItemText: {
        textAlign: 'right',
        fontFamily: Fonts.mediumText,
        fontSize: Math.min(Dimensions.get('window').width * 0.04, 16),
        color: Colors.textColor,
        paddingVertical: 8,
    },
    placeholderText: {
        textAlign: 'right',
        fontFamily: Fonts.mediumText,
        fontSize: Math.min(Dimensions.get('window').width * 0.04, 16),
        color: Colors.textColor + '80',
    },
    arrowIcon: {
        width: Math.min(Dimensions.get('window').width * 0.05, 20),
        height: Math.min(Dimensions.get('window').width * 0.05, 20),
        tintColor: Colors.mainColor,
    },
    dropdownContainer: {
        width: '100%',
        maxWidth: 350,
        marginBottom: Dimensions.get('window').height * 0.02,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: Math.min(Dimensions.get('window').width * 0.04, 16),
        fontFamily: Fonts.boldText,
        color: Colors.textColor,
        marginBottom: 8,
        textAlign: 'right',
    },
    note: {
        marginTop: Dimensions.get('window').height * 0.02,
        marginBottom: Dimensions.get('window').height * 0.015,
        color: Colors.textColor,
        textAlign: 'center',
        fontFamily: Fonts.mediumText,
        fontSize: Math.min(Dimensions.get('window').width * 0.035, 14),
        paddingHorizontal: 20,
    },
    submitButton: {
        backgroundColor: Colors.mainColor,
        paddingHorizontal: Math.min(Dimensions.get('window').width * 0.12, 50),
        paddingVertical: Math.min(Dimensions.get('window').height * 0.02, 15),
        borderRadius: 25,
        marginTop: Dimensions.get('window').height * 0.02,
        shadowColor: Colors.mainColor,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        minWidth: 150,
    },
    submitButtonText: {
        color: Colors.calmWhite,
        fontSize: Math.min(Dimensions.get('window').width * 0.045, 18),
        fontFamily: Fonts.boldText,
        textAlign: 'center',
    }
})