import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, Dimensions, I18nManager, FlatList, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConstantStyles } from '@/constants/constantStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDataContext } from '@/components/context/DataContext'
import { router } from 'expo-router'
import Loading from '@/components/Loading'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
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
    const windowWidth = Dimensions.get('window').width

    const _id = user?._id

    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [grade, setGrade] = useState('')
    const [major, setMajor] = useState('')
    const [educationLevel, setEducationLevel] = useState('')
    const [openEducationLevel, setOpenEducationLevel] = useState(false)

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

    const majorArrayFor1 = [
        { label: "عام", value: "عام" }
    ]

    const majorArrayFor2 = [
        { label: "علمي", value: "علمي" },
        { label: "ادبي", value: "ادبي" }
    ]

    const majorArrayFor3 = [
        { label: "علمي رياضة", value: "علمي رياضة" },
        { label: "علمي علوم", value: "علمي علوم" },
        { label: "ادبي", value: "ادبي" }
    ]

    const [openGrade, setOpenGrade] = useState(false)
    const [openMajor, setOpenMajor] = useState(false)

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
                setEducationLevel(JSON.parse(userExist).educationLevel)
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
        if (name && email && mobile && password && grade && educationLevel) {
            await axios.post(`${Constants.expoConfig?.extra?.API_URL}/users/updateUser`, {
                _id,
                image,
                name,
                email,
                mobile,
                password,
                grade,
                major,
                educationLevel,
                role
            }).then(res => {
                Alert.alert("بيانات الطالب", 'تم تحديث البيانات بنجاح')
                const updateUser = { ...user, image, name, email, mobile, password, grade, major, educationLevel, role }
                AsyncStorage.setItem('user', JSON.stringify(updateUser))
            }).catch(err => {
                console.log(err)
                Alert.alert("بيانات الطالب", 'حدث خطأ ما')
            })
        } else {
            Alert.alert("بيانات الطالب", 'يجب اكمال البيانات')
        }
    }

    // Subject mapping based on grade and major
    const getSubjects = () => {
        if (educationLevel === "المرحلة الاعدادية") {
            return [
                { id: 1, name: "اللغة العربية" },
                { id: 2, name: "اللغة الانجليزية" },
                { id: 3, name: "الرياضيات" },
                { id: 4, name: "العلوم" },
                { id: 5, name: "التاريخ" },
                { id: 6, name: "الجغرافيا" }
            ];
        } else if (educationLevel === "المرحلة الثانوية") {
            if (grade === "الصف الاول الثانوي") {
                return [
                    { id: 1, name: "اللغة العربية" },
                    { id: 2, name: "اللغة الانجليزية" },
                    { id: 3, name: "اللغة الثانية" },
                    { id: 4, name: "العلوم المتكاملة" },
                    { id: 5, name: "التاريخ" },
                    { id: 6, name: "الجغرافيا" },
                    { id: 7, name: "علم النفس" },
                    { id: 8, name: "الرياضيات" }
                ];
            } else if (grade === "الصف الثاني الثانوي") {
                if (major === "علمي") {
                    return [
                        { id: 1, name: "اللغة العربية" },
                        { id: 2, name: "اللغات" },
                        { id: 3, name: "الرياضيات" },
                        { id: 4, name: "العلوم المتكاملة" }
                    ];
                } else if (major === "ادبي") {
                    return [
                        { id: 1, name: "اللغة العربية" },
                        { id: 2, name: "اللغات" },
                        { id: 3, name: "الرياضيات" },
                        { id: 4, name: "التاريخ" },
                        { id: 5, name: "الجغرافيا" },
                        { id: 6, name: "الفلسفة" },
                        { id: 7, name: "علم النفس" }
                    ];
                }
            } else if (grade === "الصف الثالث الثانوي") {
                if (major === "علمي رياضة") {
                    return [
                        { id: 1, name: "اللغة العربية" },
                        { id: 2, name: "اللغات" },
                        { id: 3, name: "الفيزياء" },
                        { id: 4, name: "الكيمياء" },
                        { id: 5, name: "الرياضيات" }
                    ];
                } else if (major === "علمي علوم") {
                    return [
                        { id: 1, name: "اللغة العربية" },
                        { id: 2, name: "اللغات" },
                        { id: 3, name: "الفيزياء" },
                        { id: 4, name: "الكيمياء" },
                        { id: 5, name: "الاحياء" },
                        { id: 6, name: "الجيولوجيا" }
                    ];
                } else if (major === "ادبي") {
                    return [
                        { id: 1, name: "اللغة العربية" },
                        { id: 2, name: "اللغات" },
                        { id: 3, name: "التاريخ" },
                        { id: 4, name: "الجغرافيا" },
                        { id: 5, name: "الفلسفة" },
                        { id: 6, name: "علم النفس" }
                    ];
                }
            }
        }
        return [];
    };

    // Handle dropdown open/close
    const handleEducationLevelOpen = (value: boolean | ((val: boolean) => boolean)) => {
        setOpenEducationLevel(value);
        if (typeof value === 'boolean' && value) {
            setOpenGrade(false);
            setOpenMajor(false);
        }
    };

    const handleGradeOpen = (value: boolean | ((val: boolean) => boolean)) => {
        setOpenGrade(value);
        if (typeof value === 'boolean' && value) {
            setOpenEducationLevel(false);
            setOpenMajor(false);
        }
    };

    const handleMajorOpen = (value: boolean | ((val: boolean) => boolean)) => {
        setOpenMajor(value);
        if (typeof value === 'boolean' && value) {
            setOpenEducationLevel(false);
            setOpenGrade(false);
        }
    };

    // Force RTL layout
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);

    const renderHeader = () => (
        <>

            {/* User Photo */}
            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={() => SelectPhoto()} style={styles.imageContainer}>
                    <Image
                        source={{ uri: image || 'https://res.cloudinary.com/db152mwtg/image/upload/v1743082693/Treva%20Edu%20App/users/tvcrzrw1taqco4d6hpfy.png' }}
                        style={styles.image}
                    />
                    <View style={styles.editIconContainer}>
                        <MaterialCommunityIcons name="image-edit" size={24} color={Colors.mainColor} />
                    </View>
                </TouchableOpacity>
                {image && (
                    <TouchableOpacity
                        onPress={() => setImage('')}
                        style={styles.deleteImageButton}
                    >
                        <Text style={styles.deleteImageText}>حذف الصورة</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Education Info Section */}
            <View style={[styles.educationSection, { zIndex: 10000 }]}>
                <Text style={styles.sectionTitle}>المعلومات التعليمية</Text>

                {/* Dropdowns Container */}
                <View style={styles.dropdownsWrapper}>
                    <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
                        <DropDownPicker
                            style={[styles.dropdown, { direction: 'ltr' }]}
                            open={openEducationLevel}
                            value={educationLevel}
                            items={educationLevels}
                            setOpen={handleEducationLevelOpen}
                            setValue={(value) => {
                                setEducationLevel(value);
                                setGrade('');
                                if (typeof value === 'string' && value === 'المرحلة الاعدادية') {
                                    setMajor('عام');
                                } else {
                                    setMajor('');
                                }
                            }}
                            placeholder='اختر المرحلة الدراسية'
                            textStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                            dropDownContainerStyle={{ direction: 'ltr', zIndex: 3000 }}
                            listItemLabelStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                            placeholderStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                            listMode="MODAL"
                            modalProps={{ animationType: 'slide' }}
                        />
                    </View>
                    <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
                        <DropDownPicker
                            style={[styles.dropdown, { direction: 'ltr' }]}
                            open={openGrade}
                            value={grade}
                            items={educationLevel === "المرحلة الاعدادية" ? preparatoryGrades : secondaryGrades}
                            setOpen={handleGradeOpen}
                            setValue={(value) => {
                                setGrade(value);
                                setMajor('');
                            }}
                            placeholder='اختر الصف الدراسي'
                            textStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                            dropDownContainerStyle={{ direction: 'ltr', zIndex: 2000 }}
                            listItemLabelStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                            placeholderStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                            listMode="MODAL"
                            modalProps={{ animationType: 'slide' }}
                        />
                    </View>
                    {educationLevel === "المرحلة الثانوية" && (
                        <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
                            <DropDownPicker
                                style={[styles.dropdown, { direction: 'ltr' }]}
                                open={openMajor}
                                value={major}
                                items={grade === 'الصف الاول الثانوي' ? majorArrayFor1 : grade === 'الصف الثاني الثانوي' ? majorArrayFor2 : majorArrayFor3}
                                setOpen={handleMajorOpen}
                                setValue={setMajor}
                                placeholder='اختر التخصص'
                                textStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                                dropDownContainerStyle={{ direction: 'ltr', zIndex: 1000 }}
                                listItemLabelStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                                placeholderStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
                                listMode="MODAL"
                                modalProps={{ animationType: 'slide' }}
                            />
                        </View>
                    )}
                </View>

                {/* Subjects Section */}
                {(educationLevel && grade) && (
                    <View style={styles.subjectsContainer}>
                        <Text style={styles.subjectsTitle}>المواد الدراسية</Text>
                        <View style={styles.subjectsGrid}>
                            {getSubjects().map((subject) => (
                                <View key={subject.id} style={styles.subjectCard}>
                                    <Text style={styles.subjectName}>{subject.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </>
    );

    const renderPersonalInfo = () => (
        <View style={styles.section}>
            <View style={styles.sectionTitleWrapper}>
                <MaterialCommunityIcons name="account-circle-outline" size={22} color={Colors.mainColor} style={{ marginLeft: 10, marginBottom: 10 }} />
                <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>الاسم</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={Colors.mainColor} style={styles.inputIcon} />
                    <TextInput
                        placeholder={user.name}
                        placeholderTextColor={"#b0b0b0"}
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        textAlign="right"
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>البريد الالكتروني</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color={Colors.mainColor} style={styles.inputIcon} />
                    <TextInput
                        placeholder={user.email}
                        placeholderTextColor={"#b0b0b0"}
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        textAlign="right"
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>رقم الجوال</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color={Colors.mainColor} style={styles.inputIcon} />
                    <TextInput
                        placeholder={user.mobile}
                        keyboardType='phone-pad'
                        placeholderTextColor={"#b0b0b0"}
                        style={styles.input}
                        value={mobile}
                        onChangeText={setMobile}
                        textAlign="right"
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>كلمة المرور</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color={Colors.mainColor} style={styles.inputIcon} />
                    <TextInput
                        placeholder="******"
                        placeholderTextColor={"#b0b0b0"}
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        textAlign="right"
                    />
                </View>
            </View>
        </View>
    );

    const sections = [
        { id: 'personal', component: renderPersonalInfo },
    ];

    if (!user) {
        return <Loading />
    }

    return (
        <View style={[ConstantStyles.page, { padding: 0, backgroundColor: Colors.calmWhite, flex: 1 }]}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.calmWhite} />
            <FlatList
                data={sections}
                renderItem={({ item }) => item.component()}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={() => (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleUpdateUserData}
                    >
                        <Text style={styles.saveButtonText}>حفظ</Text>
                        <MaterialCommunityIcons name="content-save" size={24} color="#fff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
        backgroundColor: '#f6fafd',
        direction: 'ltr',
    },
    photoContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: 'transparent',
        marginBottom: 10,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'linear-gradient(135deg, #00bfae, #4f8cff)', // For web, for native use a colored border
        backgroundColor: '#f0f8ff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#00bfae',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    deleteImageButton: {
        marginTop: 10,
    },
    deleteImageText: {
        color: 'red',
        fontSize: 16,
        fontFamily: Fonts.mediumText,
        textAlign: 'right',
    },
    educationSection: {
        backgroundColor: '#fff',
        padding: 24,
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 20,
        shadowColor: '#00bfae',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
        direction: 'ltr',
    },
    section: {
        backgroundColor: '#fff',
        padding: 24,
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 20,
        shadowColor: '#00bfae',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
        direction: 'ltr',
    },
    sectionTitleWrapper: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 15,
        direction: 'ltr',
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: Fonts.boldText,
        color: Colors.mainColor,
        marginBottom: 10,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    dropdownsWrapper: {
        position: 'relative',
        direction: 'ltr',
    },
    dropdownContainer: {
        width: '100%',
        marginBottom: 12,
        direction: 'ltr',
    },
    dropdown: {
        height: 52,
        borderColor: '#00bfae',
        borderWidth: 1.5,
        borderRadius: 14,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 16,
        marginBottom: 8,
        direction: 'ltr',
    },
    inputContainer: {
        marginBottom: 18,
    },
    inputWrapper: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        paddingHorizontal: 10,
        shadowColor: '#00bfae',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginLeft: 8,
        marginRight: 2,
    },
    label: {
        fontSize: 16,
        fontFamily: Fonts.mediumText,
        color: Colors.mainColor,
        marginBottom: 7,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: Fonts.regularText,
        color: '#222',
        backgroundColor: 'transparent',
        borderWidth: 0,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    saveButton: {
        backgroundColor: '#00bfae', // Or use a gradient with a library if desired
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 24,
        marginHorizontal: 32,
        marginTop: 32,
        marginBottom: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#00bfae',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 22,
        fontFamily: Fonts.boldText,
        textAlign: 'center',
        writingDirection: 'rtl',
        letterSpacing: 1,
    },
    subjectsContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f6fafd',
        borderRadius: 16,
    },
    subjectsTitle: {
        fontSize: 18,
        fontFamily: Fonts.boldText,
        color: Colors.mainColor,
        marginBottom: 15,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    subjectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-end',
    },
    subjectCard: {
        minWidth: 90,
        backgroundColor: '#e0f7fa',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 0,
        marginBottom: 10,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#00bfae',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    subjectName: {
        fontSize: 15,
        fontFamily: Fonts.mediumText,
        color: '#00796b',
        textAlign: 'center',
        writingDirection: 'rtl',
    },
})
