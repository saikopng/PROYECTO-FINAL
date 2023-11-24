import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import MisEventosView from './vistas/MisEventosView';
import EventCreate from './vistas/EventCreate';
import ActividadView from './vistas/ActividadView';
import PerfilView from './vistas/PerfilView';
import HomeScreen from './vistas/HomeScreen';
import EditarPerfil from './vistas/EditarPerfil';
import StackScreen from './vistas/StackScreen';
import { MaterialCommunityIcons, FontAwesome5, AntDesign, Feather, FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ label, focused }) => (
  <Text style={{ color: focused ? 'white' : 'white', fontWeight: 'bold', fontSize: 12 }}>
    {label}
  </Text>
);

function MyTabs({ setUserLoggedIn }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#FA8E7D',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => <CustomTabBarLabel label="Home" focused={focused} />
        }}
      />
      <Tab.Screen
        name="Encuentros"
        component={MisEventosView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="users" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => <CustomTabBarLabel label="Encuentros" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="EvntCreate"
        component={EventCreate}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => <CustomTabBarLabel label="Publicar" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Actividad"
        component={ActividadView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => <CustomTabBarLabel label="Actividad" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle-o" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => <CustomTabBarLabel label="Perfil" focused={focused} />,
        }}
      >
        {props => <PerfilView {...props} setUserLoggedIn={setUserLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default MyTabs;