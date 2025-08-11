import { Button, FlatList, StyleSheet, Text, View } from "react-native"
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/RootStackParamList'

import { consultations } from '../utils/mockConsultations'
import ConsultationCard from '../components/ConsultationCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ConsultationsList'>

export default function ConsultationsListScreen() {
    const navigation = useNavigation<Nav>()

    return (
        <View style={styles.container}>
            {consultations.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyTitle}>Sem consultas</Text>
                    <Text style={styles.emptyText}>Toque em "Nova" para agendar sua primeira consulta.</Text>
                    <Button title="Nova consulta" onPress={() => {navigation.navigate('AddConsultation')}}></Button>
                </View>
            ) : (
                <>
                <FlatList
                    data={consultations}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                    renderItem={({ item }) => (
                        <ConsultationCard item={item} onPress={() => navigation.navigate('ConsultationDetails', { id: item.id.toString() })} />
                    )}
                />
                                    <Button title="Nova consulta" onPress={() => {navigation.navigate('AddConsultation')}}></Button>

                </>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 24,
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    emptyText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
})