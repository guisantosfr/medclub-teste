import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>     
        <StatusBar style="auto" />

        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>

    </PaperProvider>
  );
}