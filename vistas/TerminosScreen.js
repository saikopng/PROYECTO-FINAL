import React from 'react';
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TerminosScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.containerHeader}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos</Text>
      </View>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>TÉRMINOS Y CONDICIONES DE UNITE</Text>

        <Text style={styles.sectionTitle}>Encuentros y Responsabilidad:</Text>
        <Text style={styles.paragraph}>
          1.1 UNITE es una aplicación diseñada para facilitar encuentros sociales entre usuarios. Usted reconoce y acepta
          que cualquier encuentro, interacción o actividad resultante de la utilización de UNITE es responsabilidad exclusiva de los usuarios involucrados.
        </Text>
        <Text style={styles.paragraph}>
          1.2 UNITE no asume responsabilidad alguna por eventos, acciones, comportamientos o resultados que puedan ocurrir
          durante o después de los encuentros sociales entre usuarios. Cada Usuario es completamente responsable de sus acciones y decisiones en este contexto.
        </Text>
        <Text style={styles.paragraph}>
          1.3 Al utilizar UNITE, usted acepta liberar a UNITE, sus afiliados, directores, empleados y agentes de cualquier
          responsabilidad relacionada con encuentros sociales generados a través de la aplicación.
        </Text>

        <Text style={styles.sectionTitle}>Información del Usuario:</Text>
        <Text style={styles.paragraph}>
          2.1 Usted reconoce y acepta proporcionar información precisa y completa durante el proceso de registro en UNITE.
          La información sensible, como datos de contacto y ubicación, puede ser recopilada y utilizada según nuestra Política de Privacidad.
        </Text>
        <Text style={styles.paragraph}>
          2.2 Usted otorga a UNITE el derecho de utilizar, almacenar y procesar la información proporcionada, de acuerdo con
          las leyes de privacidad aplicables y nuestra Política de Privacidad.
        </Text>

        <Text style={styles.sectionTitle}>Comportamiento y Normas de la Comunidad:</Text>
        <Text style={styles.paragraph}>
          3.1 Usted se compromete a utilizar UNITE de manera ética y respetuosa. No toleramos comportamientos ofensivos,
          discriminatorios o ilegales.
        </Text>
        <Text style={styles.paragraph}>
          3.2 UNITE se reserva el derecho de suspender o eliminar la cuenta de cualquier usuario que viole las normas de la
          comunidad o este Acuerdo.
        </Text>

        <Text style={styles.sectionTitle}>Cambios en los Términos y Condiciones:</Text>
        <Text style={styles.paragraph}>
          4.1 UNITE se reserva el derecho de modificar este Acuerdo en cualquier momento. Los cambios entrarán en vigor al
          publicarse en la aplicación o mediante notificación.
        </Text>
        <Text style={styles.paragraph}>
          4.2 Es su responsabilidad revisar periódicamente estos términos y condiciones para estar al tanto de las
          actualizaciones.
        </Text>

        <Text style={styles.sectionTitle}>Términos y Condiciones Adicionales:</Text>
        <Text style={styles.paragraph}>
          5.1 Además de estos términos, la utilización de UNITE está sujeta a términos y condiciones adicionales que puedan
          ser publicados en la aplicación o notificados a los usuarios.
        </Text>

        <Text style={styles.lastParagraph}>
          Al utilizar UNITE, usted confirma que ha leído, comprendido y aceptado este Acuerdo. Si no está de acuerdo con
          estos términos, por favor, absténgase de utilizar la aplicación.
        </Text>

        <Text style={styles.contact}>Para cualquier pregunta o consulta, póngase en contacto con nosotros en: uniteappchile@gmail.com</Text>
        <Text style={styles.contact}>Nombre Empresa: UNITE</Text>
        <Text style={styles.contact}>Dirección de Contacto: UNITE 1234</Text>
        <Text style={styles.contact}>Número de Contacto: +123 456 789</Text>
        <Text style={styles.legal}>Estos términos y condiciones representan un acuerdo legal entre usted y UNITE.</Text>
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
  },
  lastParagraph: {
    fontSize: 14,
    marginBottom: 16,
  },
  contact: {
    fontSize: 14,
    marginTop: 8,
  },
  legal: {
    fontSize: 14,
    marginTop: 16,
    fontWeight: 'bold',
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
  containerHeader: {
    flex: 1
  },
});

export default TerminosScreen;