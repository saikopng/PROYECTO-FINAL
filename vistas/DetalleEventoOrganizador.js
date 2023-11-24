import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const DetalleEventoOrganizador = () => {
  const route = useRoute();
  const eventId = route.params.eventId;
  const [roles, setRoles] = useState();
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [editando, setEditando] = useState(false);
  const [creandoRol, setCreandoRol] = useState(false);

  const [edicion, setEdicion] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    direccion: "",
    requisitos: "",
    descripcion: "",
    limite_usuarios: "",
    codCategoria: "",
  });

  const [nuevoRol, setNuevoRol] = useState({    
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.error("Error al obtener el token:", error);
      }
    };

    obtenerToken();
  }, []);

  useEffect(() => {
    const obtenerDetallesEvento = async () => {
      try {
        if (!token) {
          setError("Acceso no autorizado");
          return;
        }
          const response = await axios.get(
          `http://190.46.221.131:3300/api/detalles-evento-organizador/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data && response.data.evento) {
          setEvento(response.data.evento);
          const rolesFromResponse = response.data.roles || [];
          setRoles(rolesFromResponse);
          
         

          setEdicion({
            nombre: response.data.evento.nombre,
            fecha: response.data.evento.fecha_ini,
            hora: response.data.evento.hora_ini,
            direccion: response.data.evento.direccion,
            requisitos: response.data.evento.requisitos,
            descripcion: response.data.evento.descripcion,
            limite_usuarios: response.data.evento.cant_asistentes,
            codCategoria: response.data.evento.fk_categoria,
          });
  
          setError(null);
        } else {
          setError("No se encontraron detalles del evento");
        }
      } catch (error) {
        console.error("Error al obtener detalles del evento:", error);
        setError("Error al obtener detalles del evento");
      }
    };
  
    obtenerDetallesEvento();
  }, [token, eventId, creandoRol]);
  
  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }
  
  if (!evento) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Cargando detalles del evento...</Text>
      </View>
    );
  }
  
  if (!token) {
    setError("Acceso no autorizado");
    return <View><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{evento.nombre.toUpperCase()}</Text>

      <View style={styles.eventItem}>
        {renderCampoEditado("Nombre", "nombre")}
        {renderCampoEditado("Fecha", "fecha")}
        {renderCampoEditado("Hora", "hora")}
        {renderCampoEditado("Dirección", "direccion")}
        {renderCampoEditado("Requisitos", "requisitos")}
        {renderCampoEditado("Descripción", "descripcion")}
        {renderCampoEditado("Asistentes", "cant_asistentes")}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleGuardarEdicion()}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{editando ? "Guardar" : "EDITAR ENCUENTRO"}</Text>
          <Feather name={editando ? "check" : "edit"} size={20} color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: creandoRol ? '#ccc' : '#FA8E7D' }]}
        onPress={() => setCreandoRol(!creandoRol)}
        disabled={editando || creandoRol}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>CREAR ROL</Text>
        </View>
      </TouchableOpacity>

      {creandoRol && (
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Crear Rol:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Rol"
            value={nuevoRol.nombre}
            onChangeText={(text) => setNuevoRol({ ...nuevoRol, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={nuevoRol.descripcion}
            onChangeText={(text) => setNuevoRol({ ...nuevoRol, descripcion: text })}
          />
          <TouchableOpacity style={styles.button} onPress={() => handleCrearRol()}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Crear Rol</Text>
              <Feather name="plus" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      )}
  </View>
  );

  function renderCampoEditado(label, campo) {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        {editando ? renderInputCampo(campo) : <Text>{renderValorCampo(campo)}</Text>}
      </View>
    );
  }

  function renderInputCampo(campo) {
    return (
      <TextInput
        style={styles.input}
        value={edicion[campo] ? edicion[campo].toString() : ""}
        onChangeText={(text) => setEdicion({ ...edicion, [campo]: text })}
      />
    );
  }

  function renderValorCampo(campo) {
    if (campo === "fecha") {
      return formatearFecha(edicion[campo] || evento[campo]);
    } else if (campo === "hora") {
      return formatearHora(edicion[campo] || evento[campo]);
    } else {
      return evento[campo] ? evento[campo].toString() : "";
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) {
      return "";
    }

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString(undefined, options);
  }

  function formatearHora(hora) {
    if (!hora) {
      return "";
    }

    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const [hh, mm] = new Date(`2000-01-01T${hora}`).toLocaleTimeString('en-US', options).split(':');
    return `${hh}:${mm}`;
  }

  function handleGuardarEdicion() {
    if (editando) {
      axios
        .put(
          `http://190.46.221.131:3300/api/editar-evento/${eventId}`,
          edicion,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setEditando(false);
        })
        .catch((error) => {
          console.error("Error al editar el evento:", error);
        });
    } else {
      setEditando(true);
    }
  }

  function handleCrearRol() {
    const nuevoRolParaEnviar = {
      nombre: nuevoRol.nombre,
      descripcion: nuevoRol.descripcion,
      fk_evento: eventId, // Agregué esto porque parece que necesitas el evento al que pertenece el rol
    };
    axios
      .post(
        `http://190.46.221.131:3300/api/crear-rol/${eventId}`,
        nuevoRolParaEnviar,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        
      })
      .catch((error) => {
        if (error.response) {
          
        } else {
          
        }
      });    
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#FA8E7D'
  },
  eventItem: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
  },
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#FA8E7D',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginRight: 5,
  },
  input: {
    height: 40,
    borderRadius: 12,
    padding: 10,
  },
});

export default DetalleEventoOrganizador;