import { FlatList, StyleSheet, View } from "react-native";
import ConsultationCard from "./ConsultationCard";
import { useNavigation } from "@react-navigation/native";

export default function ConsultationList({ consultations, onScroll }){
    const navigation = useNavigation()
    
    return (
        <FlatList
                        data={consultations}
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

    )
}


const styles = StyleSheet.create({
    cardList: {
        flex: 1
    }
})