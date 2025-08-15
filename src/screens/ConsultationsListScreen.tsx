import { FlatList, SectionList, StyleSheet, View } from "react-native"
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
import ConsultationList from "../components/ConsultationList";

type Nav = NativeStackNavigationProp<RootStackParamList, 'ConsultationsList'>

export default function ConsultationsListScreen() {
    const navigation = useNavigation<Nav>()
    const { consultations } = useConsultations();

    const [isExtended, setIsExtended] = useState(true);

    const theme = useTheme()

    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Normalizar datas para comparação (sem hora)
        const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const normalizedDate = normalizeDate(date);
        const normalizedToday = normalizeDate(today);
        const normalizedTomorrow = normalizeDate(tomorrow);
        const normalizedYesterday = normalizeDate(yesterday);

        if (normalizedDate.getTime() === normalizedToday.getTime()) {
            return 'Hoje';
        } else if (normalizedDate.getTime() === normalizedTomorrow.getTime()) {
            return 'Amanhã';
        } else if (normalizedDate.getTime() === normalizedYesterday.getTime()) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: '2-digit', 
                month: 'long' 
            });
        }
    };

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

    const groupConsultationsByDate = (consultationsList: Consultation[]) => {
        const grouped = consultationsList.reduce((acc, consultation) => {
            const date = consultation.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(consultation);
            return acc;
        }, {} as Record<string, Consultation[]>);

        // Ordenar por data e converter para format do SectionList
        return Object.keys(grouped)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map(date => ({
                title: formatDate(date),
                data: grouped[date].sort((a, b) => a.time.localeCompare(b.time))
            }));
    };

    const groupedConsultations = useMemo(() => {
        const filtered = {
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

        return {
            past: groupConsultationsByDate(filtered.past),
            upcoming: groupConsultationsByDate(filtered.upcoming),
            canceled: groupConsultationsByDate(filtered.canceled)
        };
    }, [consultations]);

    const getUpcomingConsultationsQuantity = () => {
        return consultations.filter(consultation => 
                isUpcomingConsultation(consultation)).length
    }

    const renderConsultationsList = (consultationsSections) => {
        if (consultationsSections.length === 0) {
            return (
                <View style={styles.emptyTabContainer}>
                    <Text variant="bodyMedium" style={styles.emptyTabText}>
                        Nenhuma consulta encontrada
                    </Text>
                </View>
            );
        }

        return (
            <SectionList
                sections={consultationsSections}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <ConsultationCard 
                        item={item} 
                        onPress={() => navigation.navigate('ConsultationDetails', { id: item.id.toString() })} 
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text variant="titleMedium" style={styles.sectionHeaderText}>
                            {title}
                        </Text>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                SectionSeparatorComponent={() => <View style={{ height: 20 }} />}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                style={styles.cardList}
                onScroll={onScroll}
                stickySectionHeadersEnabled={false}
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
                        defaultIndex={0}
                    >
                        <Tabs>
                            <TabScreen
                            label="Próximas"
                            //badge={true}
                            badge={getUpcomingConsultationsQuantity()}
                            >
                                {renderConsultationsList(groupedConsultations.upcoming)}
                            </TabScreen>

                            <TabScreen label="Passadas">
                                {renderConsultationsList(groupedConsultations.past)}
                            </TabScreen>

                            <TabScreen label="Canceladas">
                                {renderConsultationsList(groupedConsultations.canceled)}
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
    sectionHeader: {
        // paddingVertical: 8,
        paddingHorizontal: 8,
        marginTop: 16,
        //marginBottom: 8,
        //borderRadius: 8,
    },
    sectionHeaderText: {
        fontWeight: '600',
        color: '#374151',
    },
    fabStyle: {
        bottom: 60,
        right: 20,
        position: 'absolute',
    },

})