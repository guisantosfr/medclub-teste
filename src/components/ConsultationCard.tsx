import { StyleSheet } from 'react-native'
import { Consultation } from '../types/Consultation'
import { Avatar, Card, Text } from 'react-native-paper'

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
            <Card
                onPress={onPress}
            >
                <Card.Title
                    title={item.doctor}
                    titleVariant='titleLarge'
                    subtitle={item.specialty}
                    subtitleVariant='titleMedium'
                    subtitleStyle={styles.subtitle}
                    left={(props) => <Avatar.Icon {...props} icon="account" size={50} />}
                    leftStyle={styles.cardIcon}
                ></Card.Title>

                <Card.Content>
                    <Text 
                    variant='bodyLarge'
                    style={styles.dateTime}>
                        {formatDate(item.date)} - {item.time}
                    </Text>
                </Card.Content>
            </Card>
        </>
    )
}

const styles = StyleSheet.create({
    subtitle: {
        color: 'gray'
    },
    cardIcon: {
        marginRight: 32,
        marginTop: 32
    },
    dateTime: {
        position: 'relative',
        left: 72
    }
})