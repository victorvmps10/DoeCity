import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { StatusBar } from 'react-native';
import AuthProvider from './src/contexts/auth';
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
        <StatusBar barStyle='light-content' />
      </AuthProvider>
    </NavigationContainer>
  );
}

