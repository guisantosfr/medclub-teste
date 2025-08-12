import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import { ConsultationsProvider } from './src/contexts/ConsultationsContext';

export default function App() {
  return (
    <PaperProvider>
      <ConsultationsProvider>
        <StatusBar style="auto" />

        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ConsultationsProvider>

    </PaperProvider>
  );
}