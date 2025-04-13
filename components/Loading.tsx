import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Fonts } from '@/constants/Fonts'
import { Colors } from '@/constants/Colors'

export default function Loading() {
    return (
        <View style={styles.loadingContainer}>
            <Image source={require('../assets/images/loading.gif')} style={{ width: 200, height: 200 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: Fonts.boldText }}>جاري التحميل...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.calmWhite
    }

})