import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [rut, setRut] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [celular, setCelular] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [comunas, setComunas] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoUsuario] = useState('1');
  const [comunasLoaded, setComunasLoaded] = useState(false);

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

  const handleRegister = () => {
    // Verificar si la comuna está vacía
    if (selectedComuna === "") {
      Alert.alert('Error de registro', 'Selecciona tu comuna para poder registrarte.');
      return; // Detener la ejecución si la comuna está vacía
    }

    axios
      .post('http://190.46.221.131:3300/register', {
        rut,
        nombres,
        apellidos,
        edad,
        genero,
        celular,
        correo,
        contrasena,
        direccion,
        tipoUsuario,
        comuna: parseInt(selectedComuna),
      })
      .then((response) => {
        if (response.status === 200) {
          console.log('Registro exitoso');
          Alert.alert('Registro exitoso', 'Tu cuenta ha sido registrada con éxito.');
          navigation.goBack();
        } else if (response.status === 400) {
          console.error('El correo ya está registrado');
          Alert.alert('Error de registro', 'El correo ingresado ya está registrado.');
        } else {
          console.error('Error al registrar');
          Alert.alert('Error de registro', 'Hubo un error al intentar registrarte. Por favor, inténtalo más tarde.');
        }
      })
      .catch((error) => {
        console.error('Error al hacer la solicitud: ' + error);
        Alert.alert('Error de red', 'Hubo un problema al conectar con el servidor. Por favor, verifica tu conexión a internet.');
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back-circle-outline" size={36} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrarse</Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="RUT" value={rut} onChangeText={setRut} />
        <TextInput style={styles.input} placeholder="Nombres" value={nombres} onChangeText={setNombres} />
        <TextInput style={styles.input} placeholder="Apellidos" value={apellidos} onChangeText={setApellidos} />
        <TextInput style={styles.input} placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Género" value={genero} onChangeText={setGenero} />
        <TextInput style={styles.input} placeholder="Celular" value={celular} onChangeText={setCelular} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
        {comunasLoaded && (
          <View style={styles.input}>
            <Picker
              style={styles.picker}
              selectedValue={selectedComuna}
              onValueChange={(itemValue, itemIndex) => setSelectedComuna(itemValue)}
            >
              {/* Agregar un elemento inicial con texto personalizado */}
              <Picker.Item label="Selecciona tu comuna" value="" />

              {/* Mapear las comunas restantes */}
              {comunas.map((comuna, index) => (
                <Picker.Item key={index} label={comuna.comuna} value={comuna.cod_comuna} />
              ))}
            </Picker>
          </View>
        )}
        <TextInput style={styles.input} placeholder="Dirección" value={direccion} onChangeText={setDireccion} />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  form: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    fontSize: 15,
    color: '#333',
    width: '80%',
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: '#F59E7F',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  picker: {
    width: '100%', // Ajusta el ancho según tus necesidades
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    marginBottom: 15,
    height: '5%'
  },
});

export default RegisterScreen;