import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'

//import type { NativeStackScreenProps } from '@react-navigation/native-stack'
//import type { RootStackParamList } from '../types'


export default function AddConsultationScreen() {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [doctor, setDoctor] = useState('')
    const [specialty, setSpecialty] = useState('')
    const [location, setLocation] = useState('')

    const [error, setError] = useState<string | null>(null)

    const handleSave = () => {}

    return (
        <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <LabeledInput label="Data (ex: 25/08/2025)" value={date} onChangeText={setDate} placeholder="DD/MM/AAAA" />
          <LabeledInput label="Hora (ex: 14:30)" value={time} onChangeText={setTime} placeholder="HH:MM" />
          <LabeledInput label="Médico(a)" value={doctor} onChangeText={setDoctor} placeholder="Nome do(a) médico(a)" />
          <LabeledInput
            label="Especialidade"
            value={specialty}
            onChangeText={setSpecialty}
            placeholder="Ex: Cardiologia"
          />
          <LabeledInput
            label="Localização"
            value={location}
            onChangeText={setLocation}
            placeholder="Endereço ou clínica"
            multiline
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel="Salvar nova consulta"
          >
            <Text style={styles.saveText}>Salvar consulta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

    )
}

function LabeledInput({
  label,
  ...props
}: {
  label: string
  value: string
  onChangeText: (t: string) => void
  placeholder?: string
  multiline?: boolean
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, props.multiline && { height: 90, textAlignVertical: 'top' }]}
        placeholderTextColor="#9ca3af"
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f9fafb', padding: 16 },
  card: {
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
  },
  label: { fontSize: 13, color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  error: { color: '#b91c1c', fontSize: 13, marginTop: 4 },
  saveBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: { color: '#ffffff', fontWeight: '700' },
})