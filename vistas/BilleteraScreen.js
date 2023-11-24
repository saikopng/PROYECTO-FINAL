import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BilleteraScreen = () => {
    const navigation = useNavigation();
    const [metodosPago, setMetodosPago] = useState([]);

    useEffect(() => {
        // Lógica para cargar los métodos de pago asociados a la billetera del usuario en sesión
        // Puedes hacer una llamada a la API aquí para obtener esta información
        // Ejemplo:
        // const metodosPagoData = await axios.get('URL_DEL_ENDPOINT_PARA_OBTENER_METODOS_DE_PAGO');
        // setMetodosPago(metodosPagoData.data);
    }, []);

    const handleAgregarTarjeta = () => {
        navigation.navigate('TarjetaScreen');
    };

    const renderItem = ({ item }) => (
        <View style={styles.metodoPagoItem}>
            {/* Renderizar la información del método de pago, como tipo de tarjeta, últimos dígitos, etc. */}
            <Text>{item.tipoTarjeta} **** **** **** {item.ultimosDigitos}</Text>
        </View>
    );

    return (
        <View style={styles.containerHeader}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                    <View style={styles.backButton}>
                        <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Billetera</Text>
            </View>

            <FlatList
                data={metodosPago}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.metodosPagoList}
            />
            <TouchableOpacity style={styles.agregarButton} onPress={handleAgregarTarjeta}>
                <Ionicons name="add-circle-outline" size={40} color="#FA8E7D" />
                <Text style={styles.agregarButtonText}>Agregar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    metodosPagoList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    metodoPagoItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    agregarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 40,
        backgroundColor: '#FFF',
        width: '40%',
        height: '9%',
        marginLeft: 110,
        marginBottom: 50,
    },
    agregarButtonText: {
        fontSize: 18,
        marginLeft: 10,
        color: '#FA8E7D',
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

export default BilleteraScreen;