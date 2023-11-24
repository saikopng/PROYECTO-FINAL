import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SoporteScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soporte</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={30} color="white" style={styles.icon} />
          <View>
            <Text style={styles.label}>Correo de Soporte:</Text>
            <Text style={styles.info}>uniteappchile@gmail.com</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={30} color="white" style={styles.icon} />
          <View>
            <Text style={styles.label}>Teléfono de Soporte:</Text>
            <Text style={styles.info}>+123 456 789</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={30} color="white" style={styles.icon} />
          <View>
            <Text style={styles.label}>Horario de Atención:</Text>
            <Text style={styles.info}>Lunes a Viernes, 9:00 AM - 5:00 PM</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FA8E7D',
  },
  infoContainer: {
    padding: 30,
    backgroundColor: '#FA8E7D',
    marginTop: 30,
    marginLeft: 30,
    width: '85%',
    borderRadius: 50,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  info: {
    fontSize: 16,
    color: 'white',
  },
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
});

export default SoporteScreen;