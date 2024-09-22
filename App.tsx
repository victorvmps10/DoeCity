import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { StatusBar } from 'react-native';
export default function App() {
  return (
    <NavigationContainer>
      <Routes/>
      <StatusBar barStyle='light-content'/>
    </NavigationContainer>
  );
}

