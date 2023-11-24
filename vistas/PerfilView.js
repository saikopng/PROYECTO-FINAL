import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fotoPerfil from '../assets/profile.png';
import fotoUNITE from '../assets/unite.png';

const PerfilView = ({ navigation, setUserLoggedIn }) => {
  const [userInfo, setUserInfo] = useState({
    nombres: '',
    apellidos: ''
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://190.46.221.131:3300/ObtenerUsuario', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const infoUser = response.data;
          setUserInfo({
            nombres: infoUser.nombres,
            apellidos: infoUser.apellidos,
          });
        }
      } catch (error) {
        console.error('Error al obtener la información del usuario desde el servidor:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserLoggedIn(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavigateToEditarPerfil = () => {
    // Navegar a la pantalla 'EditarPerfil'
    navigation.navigate('EditarPerfil');
  };

  const handleNavigateToSoporteScreen = () => {
    navigation.navigate('SoporteScreen');
  };

  const handleNavigateToTerminosScreen = () => {
    navigation.navigate('TerminosScreen');
  };

  const handleNavigateToBilleteraScreen = () => {
    navigation.navigate('BilleteraScreen');
  };

  const handleNavigateToUniteScreen = () => {
    navigation.navigate('UniteScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerIcons}>
          {/* Icono de Configuración */}
          <TouchableOpacity style={styles.settingsButton} onPress={handleNavigateToEditarPerfil} >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>

          {/* Icono de Cerrar Sesión */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <AntDesign name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.profileHeader}>
        <Image style={styles.profileLogo} source={fotoPerfil} />
        <Text style={styles.profileUsername}>{userInfo.nombres} {userInfo.apellidos}</Text>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((n, index) => (
            <Ionicons key={index} name="star" size={18} color="#f1c40f" />
          ))}
        </View>
      </View>
      <View style={styles.sections}>
        <TouchableOpacity style={[styles.section, styles.ayudaSection]} onPress={handleNavigateToSoporteScreen}>
          <Ionicons style={styles.iconos} name="help-circle-outline" size={24} color="white" />
          <Text style={styles.sectionTitle}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.section, styles.billeteraSection]}  onPress={handleNavigateToBilleteraScreen}>
          <Ionicons style={styles.iconos} name="wallet-outline" size={24} color="white" />
          <Text style={styles.sectionTitle}>Billetera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.section, styles.uniteSection]} onPress={handleNavigateToUniteScreen}>
          <Image style={styles.uniteLogo} source={fotoUNITE} />
          <Text style={styles.sectionTitle}>UNITE+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.specificSections}>
        <TouchableOpacity style={[styles.section, styles.notificacionesSection]}>
          <Ionicons style={styles.iconos} name="notifications-outline" size={24} color="white" />
          <Text style={styles.sectionTitle}>Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.section, styles.mensajesSection]}>
          <Ionicons style={styles.iconos} name="mail-outline" size={24} color="white" />
          <Text style={styles.sectionTitle}>Mensajes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.section, styles.legalSection]} onPress={handleNavigateToTerminosScreen}>
          <Ionicons style={styles.iconos} name="document-text-outline" size={24} color="white" />
          <Text style={styles.sectionTitle}>Legal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0, // Ajusta el paddingTop a 0 para eliminar el espacio superior
  },
  ayudaSection: {
    backgroundColor: '#F5C67A',
  },
  billeteraSection: {
    backgroundColor: '#F5BC82',
  },
  uniteSection: {
    backgroundColor: '#F5AF85',
  },
  notificacionesSection: {
    backgroundColor: '#F59E7F',
  },
  mensajesSection: {
    backgroundColor: '#FA8E7D',
  },
  legalSection: {
    backgroundColor: '#F5C67A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    backgroundColor: '#FA8E7D',
    borderBottomColor: '#ccc',
    paddingTop: 10, // Ajusta el paddingTop a 0 para eliminar el espacio superior
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    marginRight: 10,
  },
  logoutButton: {
    padding: 8,
    color: 'white',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 50
  },
  profileLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  profileUsername: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  iconos: {
    fontSize: 60,
  },
  uniteLogo: {
    width: 65,
    height: 65,
  },
  ratingStars: {
    paddingTop: 15,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  sections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  specificSections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    margin: 2,
    width: 120,
  },
  section2: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: 'white',
    margin: 0,
    width: 130,
  },
  sectionTitle: {
    paddingTop: 2,
    paddingLeft: 7,
    paddingRight: 7,
    paddingBottom: 2,
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default PerfilView;