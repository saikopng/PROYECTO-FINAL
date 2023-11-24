import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar, View, Alert, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EventCreate = () => {
  const navigation = useNavigation();
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [hasFocused, setHasFocused] = useState(false);
  const [descripcion, setDescription] = useState('');
  const [requisitos, setRequesitos] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [comunas, setComunas] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState('');
  const [comunasLoaded, setComunasLoaded] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [categoriasLoaded, setCategoriasLoaded] = useState(false);
  const [sliderValue, setSliderValue] = useState(2);

  useEffect(() => {
    const fetchComunas = async () => {
      try {
        console.log('Iniciando carga de comunas');
        const responseComunas = await axios.get('http://190.46.221.131:3300/comunas');
        console.log('Datos de las comunas:', responseComunas.data);
        setComunas(responseComunas.data);
        setComunasLoaded(true);
      } catch (error) {
        console.error('Error al obtener las comunas:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        console.log('Iniciando carga de categorías');
        const responseCategorias = await axios.get('http://190.46.221.131:3300/categorias');
        console.log('Datos de las categorías:', responseCategorias.data);
        setCategorias(responseCategorias.data);
        setCategoriasLoaded(true);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };
    fetchCategorias();
    fetchComunas();
  }, []);

  const handlePublishEvent = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const formattedTime = format(selectedTime, 'HH:mm:ss');
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.error('Token no disponible');
      return;
    }

    if (selectedCategoria === "") {
      Alert.alert('Error de registro', 'Selecciona una categoria para poder publicar.');
      return; // Detener la ejecución si la categoria está vacía
    }

    if (selectedComuna === "") {
      Alert.alert('Error de registro', 'Selecciona una comuna para poder publicar.');
      return; // Detener la ejecución si la comuna está vacía
    }

    if (direccion === "") {
      Alert.alert('Error de registro', 'Ingresa una Dirección para poder publicar.');
      return; // Detener la ejecución si la dirección está vacía
    }

    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      Alert.alert('Error de registro', 'Selecciona una fecha posterior a la fecha actual.');
      return;
    }

    const response = await axios.get('http://190.46.221.131:3300/ObtenerUsuario', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userInfo = response.data;

    const eventData = {
      nombre: eventName,
      fecha: formattedDate,
      hora: formattedTime,
      direccion: direccion,
      requisitos: requisitos,
      descripcion: descripcion,
      limite_usuarios: parseInt(sliderValue),
      codUsuario: parseInt(userInfo.cod_user),
      codComuna: parseInt(selectedComuna),
      codCategoria: parseInt(selectedCategoria),
    };

    try {
      console.log('Código de usuario:', userInfo.cod_user);
      console.log('Enviando solicitud al servidor...');
      const response = await axios.post('http://190.46.221.131:3300/api/crear-eventos', eventData);
      console.log('Respuesta del servidor:', response.data);

      console.log('Evento creado con éxito', response.data);
      resetStates();
      navigation.navigate('Encuentros');
    } catch (error) {
      console.error('Error al crear el evento:', error);
    }
  };

  const resetStates = () => {
    setEventName('');
    setDatePickerVisibility(false);
    setSelectedDate(new Date()); // Establecer la fecha actual
    setHasFocused(true);
    setDescription('');
    setRequesitos('');
    setSelectedTime(new Date());
    setTimePickerVisibility(false);
    setSelectedComuna('');
    setSelectedCategoria('');
    setSliderValue(2);
    setDireccion('');
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  useFocusEffect(() => {
    if (!hasFocused) {
      setSelectedDate(new Date());
      setHasFocused(true);
    }
  });

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  const handleRequisitosChange = (text) => {
    setRequesitos(text);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crea tu Encuentro</Text>
      <TextInput
        placeholder="Nombre del Encuentro"
        style={styles.input}
        value={eventName}
        onChangeText={(text) => setEventName(text)}
      />

      {categoriasLoaded && (
        <View style={styles.inputPicker}>
          <Picker
            style={styles.picker}
            selectedValue={selectedCategoria}
            onValueChange={(itemValue, itemIndex) => setSelectedCategoria(itemValue)}
          >
            {/* Agregar un elemento inicial con texto personalizado */}
            <Picker.Item label="Categoría" value="" />

            {/* Mapear las categorías restantes */}
            {categorias.map((categoria, index) => (
              <Picker.Item key={index} label={categoria.categoria} value={categoria.cod_categoria} />
            ))}
          </Picker>
        </View>
      )}

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
      <Text style={styles.label}>Dirección:</Text>
      <TextInput
        placeholder="Escribe la dirección aquí"
        style={styles.input}
        value={direccion}
        onChangeText={(text) => setDireccion(text)}
      />
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimePicker}>
          <Text style={styles.TextFecha}>Fecha</Text>
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <View style={styles.dateContainer}>
              <Text style={styles.month}>{selectedDate ? format(selectedDate, 'MMM') : ''}</Text>
              <View style={styles.dateBox}>
                <Text style={styles.day}>{selectedDate ? format(selectedDate, 'd') : ''}</Text>
                <Text style={styles.year}>{selectedDate ? format(selectedDate, 'yyyy') : ''}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>
        <View style={[styles.dateTimePicker, { marginLeft: 30 }]}>
          <Text style={styles.TextHora}>Hora Inicio</Text>
          <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
            <View style={styles.hourContainer}>
              <Text style={styles.hour} >{format(selectedTime, 'hh:mm a')}</Text>
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => setTimePickerVisibility(false)}
          />
        </View>
      </View>
      <Text style={styles.label}>Asistentes:</Text>
      <Slider
        style={{ width: '80%', height: 40 }}
        minimumValue={2}
        maximumValue={100}
        step={1}
        value={sliderValue}
        onValueChange={(value) => setSliderValue(value)}
      />
      <Text>{Math.round(sliderValue)}</Text>
      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        placeholder="Escribe una descripción aquí"
        style={styles.textarea}
        multiline={true}
        numberOfLines={4}
        value={descripcion}
        onChangeText={handleDescriptionChange}
      />
      <Text style={styles.label}>Requisitos:</Text>
      <TextInput
        placeholder="Escribe los requisitos aquí"
        style={styles.textarea}
        multiline={true}
        numberOfLines={3}
        value={requisitos}
        onChangeText={handleRequisitosChange}
      />
      <TouchableOpacity
        onPress={async () => {
          console.log('Botón de Publicar presionado');
          try {
            await handlePublishEvent();
          } catch (error) {
            console.error('Error al publicar el evento:', error);
          }
        }}
        style={styles.button}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Publicar</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
    width: '70%',
    height: 45,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  inputPicker: {
    borderWidth: 1,
    borderColor: 'black',
    width: '56%',
    height: 45,
    borderRadius: 30,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    width: '80%',
    height: 60,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingBottom: 30,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  label: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    borderRadius: 30,
    marginTop: 20,
    backgroundColor: '#FA8E7D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    height: '7%',
  },
  picker: {
    width: '100%', // Ajusta el ancho según tus necesidades
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    marginBottom: 20,
    height: '10%',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
    paddingLeft: 15
  },
  dateTimePicker: {
    flex: 1,
  },
  TextFecha: {
    fontWeight: 'bold',
    marginLeft: 40,
    fontSize: 15,
  },
  TextHora: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 30
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FA8E7D',
    borderRadius: 30,
    padding: 5,
    marginTop: 5,
    width: '92%',
  },

  dateBox: {
    alignItems: 'center',
    marginLeft: 10,
  },

  month: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 6
  },

  day: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  year: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hour : {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FA8E7D',
    borderRadius: 30,
    padding: 5,
    marginTop: 12,
    width: '100%',
    paddingLeft: 13,
  }
});

export default EventCreate;