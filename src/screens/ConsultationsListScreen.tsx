import { useMemo, useState } from "react"
import { SectionList, StyleSheet, View, SafeAreaView } from "react-native"
import { AnimatedFAB, Text, useTheme } from "react-native-paper"
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/RootStackParamList'
import ConsultationCard from '../components/ConsultationCard';
import { useConsultations } from "../contexts/ConsultationsContext";
import EmptyState from "../components/EmptyState";
import { Consultation } from "../types/Consultation";
import { getSectionTitle, isPastConsultation, isUpcomingConsultation } from '../helpers/dateTimeHelpers';

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
                title: getSectionTitle(date),
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

    const upcomingConsultationsCount = useMemo(() =>
        groupedConsultations.upcoming.reduce((acc, section) => acc + section.data.length, 0),
        [groupedConsultations.upcoming]
    );

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
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ConsultationCard
                        item={item}
                        onPress={() => navigation.navigate('ConsultationDetails', { id: item.id })}
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
                <EmptyState onButtonClick={() => navigation.navigate('AddConsultation')} />
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
                                badge={upcomingConsultationsCount > 0 ? upcomingConsultationsCount : undefined}
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
        paddingHorizontal: 8,
        marginTop: 16,
    },
    sectionHeaderText: {
        fontWeight: '600',
        color: '#374151',
    },
    cardList: {
        flex: 1
    },
    container: {
        flex: 1
    },
    title: {
        padding: 24,
        marginTop: 24
    },
    fabStyle: {
        bottom: 60,
        right: 20,
        position: 'absolute',
    }
})