import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConsultationsListScreen from '../screens/ConsultationsListScreen';
// import ConsultationDetailsScreen from '../screens/ConsultationDetailsScreen';
// import AddConsultationScreen from '../screens/AddConsultationScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName='ConsultationsList'>
      <Stack.Screen
        name="ConsultationsList"
        component={ConsultationsListScreen}
        options={{ title: 'Consultas' }}
      />
      {/* <Stack.Screen
        name="ConsultationDetails"
        component={ConsultationDetailsScreen}
        options={{ title: 'Detalhes da Consulta' }}
      />
      <Stack.Screen
        name="AddConsultation"
        component={AddConsultationScreen}
        options={{ title: 'Agendar Consulta' }}
      /> */}
    </Stack.Navigator>
  );
}