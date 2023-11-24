import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../Components/CustomModal';
import { Alert } from 'react-native';

const DetallesEvento = ({ route }) => {
  const { eventId } = route.params;
  const [evento, setEvento] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudRegistrada, setSolicitudRegistrada] = useState(false);
  const navigation = useNavigation();

  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const postularseAlEvento = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('Token no disponible');
        return;
      }

      const responseUsuario = await axios.get('http://190.46.221.131:3000/ObtenerUsuario', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userInfo = responseUsuario.data;

      const eventData = {
        estadoSolicitud: 'pendiente',
        codEvento: evento.cod_evento,
        codUsuario: parseInt(userInfo.cod_user),
      };

      const postularseResponse = await axios.post('http://190.46.221.131:3000/api/postularse-evento', eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Respuesta del servidor al postularse:', postularseResponse.data);
      setSolicitudRegistrada(true);
    } catch (error) {
      console.error('Error al postularse al evento:', error);
    }
  };

  useEffect(() => {
    const obtenerDetallesEvento = async () => {
      try {
        const responseEvento = await axios.get(`http://190.46.221.131:3000/api/detalles-evento/${eventId}`);
        if (responseEvento.data.evento) {
          setEvento(responseEvento.data.evento);
        } else {
          console.error('Error: El servidor no devolvió detalles del evento');
        }
      } catch (error) {
        console.error('Error al obtener detalles del evento:', error);
      }
    };

    obtenerDetallesEvento();
  }, [eventId]);

  useEffect(() => {
    if (solicitudRegistrada) {
      abrirModal();

      try {
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('MisEventos');
        }, 2000);
      } catch (error) {
        Alert.alert('Error', 'Error al postularse al evento');
      }
    }
  }, [solicitudRegistrada, navigation]);

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString(undefined, options);
  };

  // Función para formatear la hora
  const formatearHora = (hora) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const [hh, mm] = new Date(`2000-01-01T${hora}`).toLocaleTimeString('en-US', options).split(':');
    return `${hh}:${mm}`;
  };

  return (
    <View style={styles.container}>
      {evento ? (
        <View style={styles.eventItem}>
          <Text style={styles.eventName}>{evento.nombre}</Text>
          <Text style={styles.eventItemInfo}>Fecha: {formatearFecha(evento.fecha_ini)}</Text>
          <Text style={styles.eventItemInfo}>Hora: {formatearHora(evento.hora_ini)}</Text>
          <Text style={styles.eventItemInfo}>Dirección: {evento.direccion}</Text>
          <Text style={styles.eventItemInfo}>Requisitos: {evento.requisitos}</Text>
          <Text style={styles.eventItemInfo}>Descripción: {evento.descripcion}</Text>
          <Text style={styles.eventItemInfo}>Asistentes: {evento.cant_asistentes}</Text>

          <TouchableOpacity style={styles.postularseButton} onPress={postularseAlEvento}>
            <Text style={styles.buttonText}>Postularse al Evento</Text>
          </TouchableOpacity>

          <CustomModal visible={modalVisible} onClose={cerrarModal}>
            <Text>Solicitud enviada, espere confirmación del organizador</Text>
          </CustomModal>
        </View>
      ) : (
        <Text>Cargando detalles del evento...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  eventItem: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FA8E7D',
    borderWidth: 1,
    borderColor: '#FA8E7D',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  eventItemInfo: {
    color: 'white',
    marginBottom: 5,
  },
  postularseButton: {
    backgroundColor: '#e88374', // Color de fondo del botón
    padding: 10,
    borderRadius: 12,
    marginTop: 15, // Ajusta el margen superior según sea necesario
  },
  buttonText: {
    color: 'white', // Color del texto del botón
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default DetallesEvento;
