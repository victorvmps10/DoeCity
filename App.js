import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { StatusBar } from 'react-native';
import AuthProvider from './src/contexts/auth';
import { setCustomText } from 'react-native-global-props';

const globalTextProps = {
  allowFontScaling: false, 
};

setCustomText(globalTextProps);

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

