import { StyleSheet, View } from 'react-native'
import { Consultation } from '../types/Consultation'
import { Avatar, Button, Card, Icon, Text } from 'react-native-paper'

type Props = {
    item: Consultation
    onPress?: () => void
}

function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = date.getMonth();
    const monthNum = String(monthIndex + 1).padStart(2, "0");
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();

    const showYear = year !== currentYear;

    const version2 = showYear
        ? `${day}/${monthNum}/${year}`
        : `${day}/${monthNum}`;

    return version2;
}

export default function ConsultationCard({ item, onPress }: Props) {
    return (
        <>
            <Card style={styles.card} onPress={onPress}>
                <Card.Title
                    title={item.doctor}
                    titleVariant='titleLarge'
                    subtitle={item.specialty}
                    subtitleVariant='titleMedium'
                    subtitleStyle={styles.subtitle}
                    left={(props) => <Avatar.Icon {...props} icon="account" size={50} />}
                    leftStyle={styles.avatar}
                ></Card.Title>

                <Card.Content>
                    <View style={styles.dateTimeContainer}>
                        <View style={styles.dateTimeItem}>
                            <Icon source="calendar" size={20} />
                            <Text variant='bodyLarge'>
                                {formatDate(item.date)}
                            </Text>
                        </View>
                        <View style={styles.dateTimeItem}>
                            <Icon source="clock-outline" size={20} />
                            <Text variant='bodyLarge'>
                                {item.time}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 8
    },
    subtitle: {
        color: 'gray'
    },
    avatar: {
        marginRight: 32,
        marginTop: 32
    },
    dateTimeContainer: {
        flexDirection: 'row',
        marginLeft: 72,
        gap: 16
    },
    dateTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    detailButton: {
        width: '75%',
        position: 'relative',
        right: 44,
        marginTop: 12
    }
})