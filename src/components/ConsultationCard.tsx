import { StyleSheet, View } from 'react-native'
import { Avatar, Card, Icon, Text } from 'react-native-paper'
import { Consultation } from '../types/Consultation'
import { formatDate } from '../helpers/formatDate'

type Props = {
    item: Consultation
    onPress?: () => void
}

export default function ConsultationCard({ item, onPress }: Props) {
    return (
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
    )
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 8,
        backgroundColor: '#fff'
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
    }
})