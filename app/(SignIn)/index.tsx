import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Redirect } from 'expo-router'

export default function SignIn() {
  const [firstTime, setFirstTime] = useState(true)
  return (
    <Redirect href={firstTime ? "/(SignIn)/Welcome" : "/(SignIn)/LogInScreen"} />
  )
}