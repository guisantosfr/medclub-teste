import { Button, FlatList, StyleSheet, Text, View } from "react-native"
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/RootStackParamList'

import ConsultationCard from '../components/ConsultationCard';
import { SafeAreaView } from "react-native-safe-area-context"
import { AnimatedFAB, Appbar } from "react-native-paper"
import { useState } from "react"
import { useConsultations } from "../contexts/ConsultationsContext";

type Nav = NativeStackNavigationProp<RootStackParamList, 'ConsultationsList'>

export default function ConsultationsListScreen() {
    const navigation = useNavigation<Nav>()
    const { consultations } = useConsultations();

    const [isExtended, setIsExtended] = useState(true);


    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    return (
        <SafeAreaView style={styles.container}>
            {consultations.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyTitle}>Sem consultas</Text>
                    <Text style={styles.emptyText}>Toque em "Nova" para agendar sua primeira consulta.</Text>
                    <Button title="Nova consulta" onPress={() => { navigation.navigate('AddConsultation') }}></Button>
                </View>
            ) : (
                <>
                    <Appbar.Header>
                        <Appbar.Content title="Minhas Consultas" />
                    </Appbar.Header>
                    <FlatList
                        data={consultations}
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                        style={styles.cardList}
                        renderItem={({ item }) => (
                            <ConsultationCard item={item} onPress={() => navigation.navigate('ConsultationDetails', { id: item.id.toString() })} />
                        )}
                        onScroll={onScroll}
                    />
                    {/* <Button title="Nova consulta" onPress={() => {navigation.navigate('AddConsultation')}}></Button> */}
                    <AnimatedFAB
                        icon={'plus'}
                        label={'Nova consulta'}
                        extended={isExtended}
                        onPress={() => { navigation.navigate('AddConsultation') }}
                        animateFrom={'right'}
                        iconMode={'static'}
                        style={styles.fabStyle}
                    />
                </>
            )}
        </SafeAreaView>
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
    cardList: {
        maxHeight: '85%'
    },
    fabStyle: {
        bottom: 60,
        right: 20,
        position: 'absolute',
    },

})