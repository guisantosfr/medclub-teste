import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ConsultationsProvider } from './src/contexts/ConsultationsContext';
import Toast from 'react-native-toast-message';

const theme = {
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0e5fd6',
    background: '#FFFFFF',
    surface: '#rgba(255, 251, 254, 1)'
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ConsultationsProvider>
        <StatusBar style="auto" />

        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ConsultationsProvider>

      <Toast />
    </PaperProvider>
  );
}