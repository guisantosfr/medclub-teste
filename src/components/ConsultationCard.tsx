import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Consultation } from '../types/Consultation'

type Props = {
    item: Consultation
    onPress?: () => void
}

export default function AppointmentCard({ item, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel={`Abrir consulta com ${item.doctor} em ${item.date} às ${item.time}`}
        >
            <View style={styles.row}>
                <Text style={styles.when}>
                    {item.date} • {item.time}
                </Text>
            </View>
            <Text style={styles.title}>{item.doctor}</Text>
            <Text style={styles.subtitle}>{item.specialty}</Text>
            <Text style={styles.location} numberOfLines={2}>
                {item.location}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 14,
        gap: 6,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    when: { color: '#065f46', fontWeight: '600' },
    title: { fontSize: 16, fontWeight: '700', color: '#111827' },
    subtitle: { fontSize: 14, color: '#6b7280' },
    location: { fontSize: 13, color: '#374151' },
})