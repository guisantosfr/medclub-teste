import { FlatList, StyleSheet, View } from "react-native"
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/RootStackParamList'

import ConsultationCard from '../components/ConsultationCard';
import { SafeAreaView } from "react-native-safe-area-context"
import { AnimatedFAB, Text, useTheme } from "react-native-paper"
import { useMemo, useState } from "react"
import { useConsultations } from "../contexts/ConsultationsContext";
import EmptyState from "../components/EmptyState";
import { Consultation } from "../types/Consultation";

import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";

type Nav = NativeStackNavigationProp<RootStackParamList, 'ConsultationsList'>

export default function ConsultationsListScreen() {
    const navigation = useNavigation<Nav>()
    const { consultations } = useConsultations();

    const [isExtended, setIsExtended] = useState(true);

    const theme = useTheme()

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    const isPastConsultation = (consultation: Consultation) => {
        const now = new Date();
        const consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
        return consultationDateTime < now;
    };

    const isUpcomingConsultation = (consultation: Consultation) => {
        const now = new Date();
        const consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
        return consultationDateTime >= now && !consultation.canceled;
    };

    const filteredConsultations = useMemo(() => {
        return {
            past: consultations.filter(consultation => 
                isPastConsultation(consultation) && !consultation.canceled
            ),
            upcoming: consultations.filter(consultation => 
                isUpcomingConsultation(consultation)
            ),
            canceled: consultations.filter(consultation => 
                consultation.canceled
            )
        };
    }, [consultations]);

    const renderConsultationsList = (consultationsList: Consultation[]) => {
        if (consultationsList.length === 0) {
            return (
                <View style={styles.emptyTabContainer}>
                    <Text variant="bodyMedium" style={styles.emptyTabText}>
                        Nenhuma consulta encontrada
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={consultationsList}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                style={styles.cardList}
                renderItem={({ item }) => (
                    <ConsultationCard 
                        item={item} 
                        onPress={() => navigation.navigate('ConsultationDetails', { id: item.id.toString() })} 
                    />
                )}
                onScroll={onScroll}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {consultations.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <Text
                        variant="titleLarge"
                        style={styles.title}>
                        Minhas consultas
                    </Text>

                    <TabsProvider
                        defaultIndex={1}
                    >
                        <Tabs>
                            <TabScreen label="Passadas">
                                {renderConsultationsList(filteredConsultations.past)}
                            </TabScreen>

                            <TabScreen label="Próximas">
                                {renderConsultationsList(filteredConsultations.upcoming)}
                            </TabScreen>

                            <TabScreen label="Canceladas">
                                {renderConsultationsList(filteredConsultations.canceled)}
                            </TabScreen>
                        </Tabs>
                    </TabsProvider>
                    
                    <AnimatedFAB
                        icon={'plus'}
                        label={'Nova consulta'}
                        extended={isExtended}
                        onPress={() => { navigation.navigate('AddConsultation') }}
                        animateFrom={'right'}
                        iconMode={'static'}
                        color="#eee"
                        style={[styles.fabStyle, { backgroundColor: theme.colors.primary }]}
                    />
                </>
            )}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 24,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827'
    },
    emptyText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center'
    },
    title: {
        padding: 24
    },
    cardList: {
        flex: 1
    },
    emptyTabContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    emptyTabText: {
        color: '#6b7280',
        textAlign: 'center'
    },
    fabStyle: {
        bottom: 60,
        right: 20,
        position: 'absolute',
    },

})