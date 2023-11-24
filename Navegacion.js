import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './vistas/LoginScreen';
import RegisterScreen from './vistas/RegisterScreen';
import MyTabs from './MyTabs';
import EditarPerfil from './vistas/EditarPerfil';
import DetallesEvento from './vistas/DetallesEvento';
import DetalleEventoOrganizador from './vistas/DetalleEventoOrganizador';
import MisEventos from './vistas/MisEventosView';

import SoporteScreen from './vistas/SoporteScreen';
import TerminosScreen from './vistas/TerminosScreen';
import BilleteraScreen from './vistas/BilleteraScreen';
import UniteScreen from './vistas/UniteScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!userLoggedIn ? (
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} setUserLoggedIn={setUserLoggedIn} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {props => <MyTabs {...props} setUserLoggedIn={setUserLoggedIn} />}
          </Stack.Screen>
        )}
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
        <Stack.Screen name="DetallesEvento" component={DetallesEvento} />
        <Stack.Screen name="DetalleEventoOrganizador" component={DetalleEventoOrganizador} /> 
        <Stack.Screen name="MisEventos" component={MisEventos} />
        <Stack.Screen name="SoporteScreen" component={SoporteScreen} />
        <Stack.Screen name="TerminosScreen" component={TerminosScreen} />
        <Stack.Screen name="BilleteraScreen" component={BilleteraScreen} />
       
        <Stack.Screen name="UniteScreen" component={UniteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}