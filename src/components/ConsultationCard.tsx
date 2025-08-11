import { Consultation } from '../types/Consultation'
import { Avatar, Card, Text } from 'react-native-paper'

type Props = {
    item: Consultation
    onPress?: () => void
}

export default function AppointmentCard({ item, onPress }: Props) {
    return (
        <Card
            onPress={onPress}
        >
            <Card.Title
            title={item.doctor}
            subtitle={item.specialty}
            left={(props) => <Avatar.Icon {...props} icon="doctor" />}
            ></Card.Title>

            <Card.Content>
                <Text variant='titleSmall'>{item.date} - {item.time}</Text>
            </Card.Content>
        </Card>
    )
}