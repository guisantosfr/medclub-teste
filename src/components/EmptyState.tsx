import { Image, StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"

export default function EmptyState() {
    const navigation = useNavigation();

    return (
        <View style={styles.emptyWrap}>
            <Image
            source={require('../../assets/no-data.png')}
            style={styles.image}
            />

            <Text variant="headlineSmall">Sem consultas no momento</Text>

            <Text 
            variant="bodyLarge"
            style={styles.emptyDescription}>
                Adicione sua primeira consulta {'\n'} para organizar seus atendimentos.
            </Text>

            <Button 
            mode="contained"
            icon="plus"
            onPress={() => { navigation.navigate('AddConsultation')}}
            style={styles.button}>
                Nova Consulta
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    image: {
        width: 253,
        height: 247,
        marginBottom: 8
    },
    emptyDescription: {
        textAlign: 'center',
        paddingHorizontal: 12
    },
    button: {
        marginTop: 12,
        width: '50%'
    }
})