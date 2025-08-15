import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ConsultationsProvider } from './src/contexts/ConsultationsContext';
import Toast from 'react-native-toast-message';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useMemo } from 'react';

export default function App() {
  const colorScheme = useColorScheme();
  // const { theme } = useMaterial3Theme({ sourceColor: '#0e5fd6'});

  // const appTheme = useMemo(
  //   () =>
  //     colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light },
  //   [colorScheme, theme]
  // );

  const theme = {
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0e5fd6',
    background: '#FFFFFF'
  },
};


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