import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Login from '../pages/Login';
import Welcome from '../pages/Welcome';

export default function AuthRoutes() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name='Welcome'
        component={Welcome}
      />
      <Stack.Screen
        name='Login'
        component={Login}
      />
    </Stack.Navigator>
  );

}