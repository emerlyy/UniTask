import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { AppNav } from '../navigation/AppNav';

export default function Index() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNav />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
