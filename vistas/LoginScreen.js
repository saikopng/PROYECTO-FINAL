import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fotoUNITE from '../assets/unite.png';

const LoginScreen = ({ navigation, setUserLoggedIn }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://190.46.221.131:3300/login', {
        correo,
        contrasena,
      });

      if (response.status === 200) {
        console.log('Inicio de sesión exitoso');
        setUserLoggedIn(true);
        const token = response.data.token;
        AsyncStorage.setItem('token', token);
      } else if (response.status === 401) {
        console.log('Credenciales incorrectas');
        Alert.alert(
          'Credenciales incorrectas',
          'Por favor, verifica tus credenciales e inténtalo de nuevo.'
        );
      } else {
        console.error('Error de inicio de sesión');
        Alert.alert(
          'Error de inicio de sesión',
          'Hubo un error al intentar iniciar sesión. Por favor, inténtalo más tarde.'
        );
      }
    } catch (error) {
      Alert.alert('Error al Iniciar Sesión', 'Hubo un problema al conectar');
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={fotoUNITE} style={styles.logo} />
        <Text style={styles.welcomeText}>Bienvenido/a a Unite!</Text>
        <Text style={styles.title}>Iniciar sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.buttonIS, { backgroundColor: '#F59E7F' }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.registerContainer, styles.bottomContainer]}>
        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
        <TouchableOpacity
          style={[styles.buttonUN, styles.registerButton]}
          onPress={handleNavigateToRegister}
        >
          <Text style={styles.buttonText}>Únete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FA8E7D',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    padding: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
  },
  buttonIS: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
    marginBottom: 20
  },
  buttonUN: {
    borderRadius: 25,
    paddingVertical: 7,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '25%',
    height: '76%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,

  },
  registerButton: {
    backgroundColor: '#F59E7F',
  },
  registerText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
    paddingTop: 18
  },
});

export default LoginScreen;