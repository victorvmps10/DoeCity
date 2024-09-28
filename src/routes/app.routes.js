import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Discover from '../pages/Discover';
import Account from '../pages/Account';
import Info from '../pages/Info';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NewPost from '../pages/NewPost';
import Pagaments from '../pages/Pagaments';
import PostsOng from '../pages/PostsOng';
import Search from '../pages/Search';
import Donate from '../pages/Donate';
import Feedback from '../pages/Feedback';

export default function AppRoutes() {
  const AppTabs = createBottomTabNavigator();
  return (
    <AppTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: '#2E2E2E',
        tabBarInactiveBackgroundColor: '#2E2E2E',
        tabBarShowLabel: false,
        tabBarStyle: {
          borderColor: '#2E2E2E',
          backgroundColor: '#2E2E2E',
        }
      }}
    >
      <AppTabs.Screen
        name='Home'
        component={StackHome}
        options={{
          tabBarIcon: ({ size, color }) => <AntDesign name='home' size={size} color={color} />
        }}
      />
      <AppTabs.Screen
        name='Discover'
        component={StackDiscover}
        options={{
          tabBarIcon: ({ size, color }) => <AntDesign name='search1' size={size} color={color} />
        }}
      />
      <AppTabs.Screen
        name='Account'
        component={StackAccount}
        options={{
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name='account' size={size} color={color} />
        }}
      />
      <AppTabs.Screen
        name='Info'
        component={StackInfo}
        options={{
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name='information' size={size} color={color} />
        }}
      />
    </AppTabs.Navigator>
  )
}

function StackHome() {
  const StackHome = createNativeStackNavigator();
  return (
    <StackHome.Navigator>
      <StackHome.Screen
        name='HomePage'
        component={Home}
        options={{
          headerShown: false
        }}
      />
      <StackHome.Screen
        name='NewPost'
        component={NewPost}
        options={{
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#2E2E2E',
          }
        }}
      />
      <StackHome.Screen
        name='PostsOng'
        component={PostsOng}
        options={{
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#2E2E2E',
          }
        }}
      />
      <StackHome.Screen
        name='Donate'
        component={Donate}
        options={{
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#2E2E2E',
          }
        }}
      />
    </StackHome.Navigator>
  );
}
function StackAccount() {
  const StackAccount = createNativeStackNavigator();
  return (
    <StackAccount.Navigator>
      <StackAccount.Screen
        name='AccountPage'
        component={Account}
        options={{
          headerShown: false
        }}
      />
      <StackAccount.Screen
        name='Pagaments'
        component={Pagaments}
        options={{
          headerTintColor: '#fff',
          title: 'Financeiro',
          headerStyle: {
            backgroundColor: '#2E2E2E',
          }
        }}
      />
    </StackAccount.Navigator>
  );
}
function StackDiscover() {
  const StackDiscover = createNativeStackNavigator();
  return (
    <StackDiscover.Navigator>
      <StackDiscover.Screen
        name='DiscoverPage'
        component={Discover}
        options={{
          headerShown: false
        }}
      />
      <StackDiscover.Screen
        name='Search'
        component={Search}
        options={{
          headerTintColor: '#fff',
          title: 'Pesquisar',
          headerStyle: {
            backgroundColor: '#2E2E2E',
          }
        }}
      />
    </StackDiscover.Navigator>
  );
}

function StackInfo() {
  const StackInfo = createNativeStackNavigator();
  return (
    <StackInfo.Navigator>
      <StackInfo.Screen
        name='InfoPage'
        component={Info}
        options={{
          headerShown: false
        }}
      />
      <StackInfo.Screen
        name='Feedback'
        component={Feedback}
        options={{
          headerTintColor: '#fff',
          title: 'Avaliação',
          headerStyle: {
            backgroundColor: '#2E2E2E',
          }
        }}
      />
    </StackInfo.Navigator>
  );
}