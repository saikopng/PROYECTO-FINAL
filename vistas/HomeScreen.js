import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [infoMessage, setInfoMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const formatearFecha = (fecha) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(fecha).toLocaleDateString(undefined, options);
  };

  const formatearHora = (hora) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const [hh, mm] = new Date(`2000-01-01T${hora}`).toLocaleTimeString(
      "en-US",
      options
    ).split(":");
    return `${hh}:${mm}`;
  };

  const searchEvents = async () => {
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

      const response = await axios.get(
        "http://190.46.221.131:3000/api/buscar-eventos",
        {
          params: {
            searchTerm,
            cod_usuario: parseInt(userInfo.cod_user),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        if (response.data.eventos && response.data.eventos.length > 0) {
          setInfoMessage(null);
          setEvents(response.data.eventos);
        } else {
          setInfoMessage("No se han encontrado eventos coincidentes");
          setEvents([]);
        }
      } else {
        console.error(
          "La respuesta del servidor no tiene la estructura esperada:",
          response
        );
        setInfoMessage("Error al buscar eventos");
      }
    } catch (error) {
      console.error("Error al buscar eventos:", error);
      setInfoMessage("Error al buscar eventos");
    }
  };

  const navigateToEventDetails = (eventId) => {
    navigation.navigate("DetallesEvento", { eventId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UNITE</Text>
      <Text style={styles.title2}>¡Busca tu encuentro aquí!</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: "white" }]}
          placeholder="Buscar encuentros..."
          placeholderTextColor="white"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchEvents}>
          <Feather name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {infoMessage ? (
        <Text style={styles.infoMessage}>{infoMessage}</Text>
      ) : null}

      <FlatList
        data={events}
        keyExtractor={(item) => item.cod_evento.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigateToEventDetails(item.cod_evento)}
          >
            <Text style={styles.eventName}>{item.nombre}</Text>
            <Text style={styles.eventItemInfo}>
              Fecha: {formatearFecha(item.fecha_ini)}
            </Text>
            <Text style={styles.eventItemInfo}>
              Hora: {formatearHora(item.hora_ini)}
            </Text>
            <Text style={styles.eventItemInfo}>
              Categoría: {item.nombre_categoria}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FA8E7D",
  },
  title2: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FA8E7D",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#FA8E7D",
    marginRight: 10,
    backgroundColor: "#FA8E7D",
    color: "white",
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#FA8E7D",
    borderRadius: 12,
  },
  infoMessage: {
    color: "#FA8E7D",
    marginBottom: 10,
  },
  categoryItem: {
    padding: 10,
    margin: 5,
    backgroundColor: "#FA8E7D",
    borderRadius: 12,
  },
  selectedCategory: {
    backgroundColor: "#FFC0CB", // Cambia el color de fondo para la categoría seleccionada
  },
  categoryName: {
    color: "white",
  },
  eventItem: {
    marginBottom: 10,
    padding: 15,
    color: "white",
    borderRadius: 12,
    backgroundColor: "#FA8E7D",
    borderWidth: 1,
    borderColor: "#FA8E7D",
  },
  eventName: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
    fontWeight: "bold",
  },
  eventItemInfo: {
    color: "white",
  },
});

export default HomeScreen;