import React from 'react'
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { RootStackParamList } from '../types/RootStackParamList'
import { consultations } from '../utils/mockConsultations'

type Props = NativeStackScreenProps<RootStackParamList, 'ConsultationDetails'>

export default function ConsultationDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params
  const item = consultations.find(a => a.id.toString() == id)

  const deleteConsultation = (id) => {

  }

  if (!item) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#6b7280' }}>Consulta não encontrada.</Text>
      </View>
    )
  }

  const handleDelete = () => {
    Alert.alert('Excluir consulta', 'Tem certeza que deseja excluir esta consulta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteConsultation(item.id)
          navigation.popToTop()
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Row label="Data">{item.date}</Row>
        <Row label="Hora">{item.time}</Row>
        <Row label="Médico(a)">{item.doctor}</Row>
        <Row label="Especialidade">{item.specialty}</Row>
        <Row label="Localização">{item.location}</Row>
      </View>

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
        accessibilityLabel="Excluir esta consulta"
      >
        <Text style={styles.deleteText}>Excluir consulta</Text>
      </Pressable>
    </View>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16, gap: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    gap: 12,
  },
  row: { gap: 2 },
  label: { fontSize: 12, color: '#6b7280' },
  value: { fontSize: 16, color: '#111827', fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: { color: '#ffffff', fontWeight: '700' },
})