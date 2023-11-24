import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";

const MisEventos = () => {
  const navigation = useNavigation();
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [infoMessage, setInfoMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

    const navigateToDetalleEventoOrganizador = (eventId) => {
    navigation.navigate("DetalleEventoOrganizador", { eventId });
  };

  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    };

    obtenerToken();
  }, []);

  useEffect(() => {
    const obtenerMisEventos = async () => {
      try {
        if (!token) {
          return;
        }

        const response = await axios.get("http://190.46.221.131:3300/api/mis-eventos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.eventos) {
          setInfoMessage(null);
          setEventos(response.data.eventos);
          filtrarEventos(searchTerm);
        } else {
          setInfoMessage("No tienes eventos registrados");
          setEventos([]);
          setEventosFiltrados([]);
        }
      } catch (error) {
        console.error("Error al obtener mis eventos:", error);
        setInfoMessage("Error al obtener mis eventos");
      }
    };

    obtenerMisEventos();
  }, [token, searchTerm]);

  const navigateToDetalleEvento = (eventId) => {
    navigation.navigate("DetallesEvento", { eventId });
  };

  const filtrarEventos = (term) => {
    const eventosFiltrados = eventos.filter((evento) => {
      return (
        evento.nombre.toLowerCase().includes(term.toLowerCase()) ||
        evento.nombre_categoria.toLowerCase().includes(term.toLowerCase())
      );
    });
    setEventosFiltrados(eventosFiltrados);

    if (eventosFiltrados.length === 0) {
      setInfoMessage("No se han encontrado eventos coincidentes");
    } else {
      setInfoMessage(null);
    }
  };

  const formatearFecha = (fecha) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(fecha).toLocaleDateString(undefined, options);
  };

  const formatearHora = (hora) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const [hh, mm] = new Date(`2000-01-01T${hora}`).toLocaleTimeString("en-US", options).split(":");
    return `${hh}:${mm}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MIS ENCUENTROS</Text>
      <Text style={styles.title2}>¡Busca entre tus encuentros aquí!</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: "white" }]}
          placeholder="Buscar mis encuentros..."
          placeholderTextColor="white"
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
            filtrarEventos(text);
          }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => filtrarEventos(searchTerm)}>
          <Feather name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {infoMessage ? <Text style={styles.infoMessage}>{infoMessage}</Text> : null}
      <FlatList
        data={eventosFiltrados}
        keyExtractor={(item) => item.cod_evento.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventoItem}
            onPress={() => navigateToDetalleEventoOrganizador(item.cod_evento)}
          >
            <Text style={styles.nombreEvento}>{item.nombre}</Text>
            <Text style={styles.eventItemInfo}>
              Fecha: {formatearFecha(item.fecha_ini)}
            </Text>
            <Text style={styles.eventItemInfo}>
              Hora: {formatearHora(item.hora_ini)}
            </Text>
            <Text style={styles.categoriaEvento}>
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
    backgroundColor: "#FFF",
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
  eventoItem: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#FA8E7D",
    borderWidth: 1,
    borderColor: "#FA8E7D",
  },
  nombreEvento: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
    fontWeight: "bold",
  },

  eventItemInfo: {
    color: "white",
  },
  categoriaEvento: {
    color: "white",  
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
});

export default MisEventos;
