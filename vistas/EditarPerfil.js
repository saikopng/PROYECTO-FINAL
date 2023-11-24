import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const EditarPerfil = () => {
  const navigation = useNavigation();
  const [comunas, setComunas] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState('');
  const [comunasLoaded, setComunasLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState({
    numero: '',
    direccion: '',
    correo: '',
  });

  useEffect(() => {
    // Cargar la información del usuario al montar el componente
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      try {
        console.log('Iniciando carga de comunas');
        const response = await axios.get('http://190.46.221.131:3300/comunas');
        console.log('Datos de las comunas:', response.data);
        setComunas(response.data);
        setComunasLoaded(true);
      } catch (error) {
        console.error('Error al obtener las comunas:', error);
      }
    };

    fetchComunas();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://190.46.221.131:3300/ObtenerUsuario', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;
        setUserProfile({
          numero: user.celular,
          direccion: user.direccion,
          correo: user.correo,
          comuna: user.comuna,
        });

        setSelectedComuna(user.comuna);
      }
    } catch (error) {
      console.error('Error al obtener la información del usuario desde el servidor:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Enviar los cambios al servidor
        await axios.put(
          'http://190.46.221.131:3300/ActualizarPerfil',
          {
            numero: userProfile.numero,
            direccion: userProfile.direccion,
            correo: userProfile.correo,
            comuna: selectedComuna
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Volver a la pantalla de perfil después de guardar los cambios
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número:</Text>
          <TextInput
            style={styles.input}
            value={userProfile.numero}
            onChangeText={(text) => setUserProfile({ ...userProfile, numero: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección:</Text>
          <TextInput
            style={styles.input}
            value={userProfile.direccion}
            onChangeText={(text) => setUserProfile({ ...userProfile, direccion: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comuna:</Text>
          {comunasLoaded && (
            <View style={styles.inputPicker}>
              <Picker
                style={styles.picker}
                selectedValue={selectedComuna}
                onValueChange={(itemValue, itemIndex) => setSelectedComuna(itemValue)}
              >
                {/* Agregar un elemento inicial con texto personalizado */}
                <Picker.Item label="Comuna" value="" />

                {/* Mapear las comunas restantes */}
                {comunas.map((comuna, index) => (
                  <Picker.Item key={index} label={comuna.comuna} value={comuna.cod_comuna} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo:</Text>
          <TextInput
            style={styles.input}
            value={userProfile.correo}
            onChangeText={(text) => setUserProfile({ ...userProfile, correo: text })}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButtonContainer} onPress={handleSaveChanges}>
        <View style={styles.saveButton}>
          <Ionicons name="save-outline" size={24} color="white" />
          <Text style={styles.saveButtonText}>Guardar</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    backgroundColor: '#FA8E7D',
    borderBottomColor: '#ccc',
  },
  backButtonContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 80,
    paddingTop: 10,
  },
  formContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
    marginTop: 30
  },
  inputContainer: {
    borderRadius: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 5,
    padding: 10,
    backgroundColor: '#FA8E7D'
  },
  label: {
    marginBottom: 5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 8,
    paddingLeft: 15,
    backgroundColor: 'white',
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 40,
    marginTop: 70,
    width: '40%', // Puedes ajustar el ancho según tus preferencias
    alignSelf: 'center', // Para centrar horizontalmente
    backgroundColor: '#FA8E7D',
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  picker: {
    width: '100%', // Ajusta el ancho según tus necesidades
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    marginBottom: 20,
    height: '10%',
  },
  inputPicker: {
    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
    height: 45,
    borderRadius: 30,
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

export default EditarPerfil;