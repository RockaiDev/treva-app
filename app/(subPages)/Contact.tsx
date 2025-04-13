import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';

export default function Contact() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>تواصل معي – Treva</Text>
      <Text style={styles.subtitle}>
        مرحبًا، أنا Treva، منصتك التعليمية المتكاملة لطلاب المرحلة الثانوية!
        إذا كنت بحاجة إلى أي مساعدة أو لديك استفسارات، لا تتردد في التواصل معي عبر أي من الطرق التالية:
      </Text>

      <View style={styles.contactItem}>
        <FontAwesome name="phone" size={24} color="#2c3e50" style={styles.icon} />
        <Text style={styles.contactText}>0100 000 0000</Text>
      </View>

      <View style={styles.contactItem}>
        <Entypo name="email" size={24} color="#2c3e50" style={styles.icon} />
        <Text style={styles.contactText}>support@treva.com</Text>
      </View>

      <View style={styles.contactItem}>
        <FontAwesome name="whatsapp" size={24} color="#25D366" style={styles.icon} />
        <Text style={styles.contactText}>WhatsApp</Text>
      </View>

      <View style={styles.contactItem}>
        <FontAwesome name="facebook-square" size={24} color="#1877F2" style={styles.icon} />
        <Text style={styles.contactText}>Facebook</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 16,
    color: '#2c3e50',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 24,
    lineHeight: 28,
    color: '#34495e',
    writingDirection: 'rtl',
  },
  contactItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginLeft: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});