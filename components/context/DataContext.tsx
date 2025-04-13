import { View, Text } from 'react-native'
import React, { createContext, Dispatch, SetStateAction, useEffect } from 'react'
import axios from 'axios'
import Constants from 'expo-constants'

export interface lesson {
    _id: string,
    title: string,
    description: string,
    image: string,
    teacher: string,
    subject: string,
    major: string,
    grade: string,
    type: string,
    comments: {}[],
    level: string,
    price: number,
    availableFor: number,
    HomeWrokAttaches: string,
    explainVideo: {
        link: string,
        title: string,
        description: string,
        attaches: string,
        comments: {}[]
    },
    homeWorkVideo: {
        link: string,
        title: string,
        description: string,
        attaches: string,
        comments: {}[]
    },
    examVideo: {
        link: string,
        title: string,
        description: string,
        attaches: string,
        comments: {}[]
    },
    exam: {
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
    },
    createdAt: string,
    updatedAt: string,
}

export interface user {
    _id: string,
    name: string,
    username: string,
    email: string,
    mobile: string,
    password: string,
    image: string,
    grade: string,
    major: string,
    type: string, // TrevaIn , TrevaGo
    role: string,
    points: number,
    StdOfMonth: Boolean,
    videos: {
        title: string,
        attaches: string,
        comments: {}[]
    }[], // title , lessone
    exams: {
        title: string,
        totalPoints: number,
        Date: string,
        answers: {
            answer: string,
            points: number
        }[],
    }[], // title , techer, lessone, answers , finalResult
    bills: {
        cost: number,
        code: string,
        date: string | number,
        method: string,
    }[],
    lessons: {
        _id: string,
        date: number
    }[],
    logs: {}[],
    devices: {
        type: string,
    }[],

    // Techers
    subject: string,
}

export interface payment {
    _id: string,
    name: string,
    username: string,
    cost: number,
    mobile: string,
    code: string,
    grade: string,
    type: string,
    method: string,
    bill: {}[]
}

export interface DataContextType {
    lessons: lesson[] | null;
    users: user[] | null;
    payments: payment[] | null;
    setLessons: Dispatch<SetStateAction<lesson[] | null>>;
    setUsers: Dispatch<SetStateAction<user[] | null>>;
    setPayments: Dispatch<SetStateAction<payment[] | null>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function useDataContext() {
    const context = React.useContext(DataContext)
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider')
    }
    return context
}

export default function DataProvider({ children }: { children: React.ReactNode }) {
    const [lessons, setLessons] = React.useState<lesson[] | null>(null)
    const [users, setUsers] = React.useState<user[] | null>(null)
    const [payments, setPayments] = React.useState<payment[] | null>(null)
    const apiURL = Constants.expoConfig?.extra?.API_URL

    console.log(apiURL)
    const fetchData = async () => {
        try {
            const [resLessons, resUsers, resPayments] = await Promise.all([
                axios.get<lesson[]>(`${apiURL}/lessons/getLessons`),
                axios.get<user[]>(`${apiURL}/users/getUsers`),
                axios.get<payment[]>(`${apiURL}/payments/getPayments`),
            ])

            setLessons(resLessons.data)
            setUsers(resUsers.data)
            setPayments(resPayments.data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(() => {
            fetchData()
        }, 10000) // 1 minute

        return () => clearInterval(interval)
    }, [])




    return (
        <DataContext.Provider value={{ lessons, users, payments, setLessons, setUsers, setPayments }}>
            {children}
        </DataContext.Provider>
    )

}