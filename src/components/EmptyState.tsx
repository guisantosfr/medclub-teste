import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"

export default function EmptyState() {
    const navigation = useNavigation();

    return (
        <View style={styles.emptyWrap}>
            <Image
            source={require('../../assets/calendar.png')}
            style={styles.image}
            />

            <Text variant="headlineSmall">Sem consultas</Text>

            <Button 
            mode="contained" 
            onPress={() => { navigation.navigate('AddConsultation')}}
            style={styles.button}>
                Nova Consulta
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150
    },
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    button: {
        marginTop: 12,
        width: '50%'
    }
})