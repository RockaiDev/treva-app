import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { Fonts } from '@/constants/Fonts';
import { ConstantStyles } from '@/constants/constantStyles';

interface ButtonComp {
  title: String;
  action: () => void;
}

const Button: React.FC<ButtonComp> = ({ title, action }) => {
  return (
    <TouchableOpacity onPress={action}>
      <Text style={ConstantStyles.btn}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button