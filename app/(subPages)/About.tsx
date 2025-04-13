import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'

export default function About() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>نبذة عن Treva</Text>
        <Text style={styles.description}>
          Treva هي منصة تعليمية رقمية متكاملة مصممة خصيصًا لطلاب المرحلة الثانوية، حيث تقدم تجربة تعليمية تفاعلية حديثة تعتمد على أحدث الأساليب الذكية والتكنولوجيا المبتكرة. تهدف المنصة إلى تمكين الطلاب من تحقيق أفضل النتائج من خلال دروس تفاعلية، اختبارات ذكية، ومصادر تعليمية متنوعة.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 20,
    color: '#2c3e50',
    writingDirection: 'rtl',
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: 'right',
    color: '#34495e',
    writingDirection: 'rtl',
  },
});
