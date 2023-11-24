import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UniteScreen = () => {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        rut: '',
        IdentificadorUsuario: '',
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

                    const info = response.data;
                    setUserInfo({
                        nombres: info.nombres,
                        apellidos: info.apellidos,
                        correo: info.correo,
                        rut: info.rut,
                        IdentificadorUsuario: info.cod_user
                    });
                }
            } catch (error) {
                console.error('Error al obtener la información del usuario desde el servidor:', error);
            }
        };
        fetchUserInfo();
    }, []);

    console.log('info: ', userInfo);

    const handleUniteButtonClick = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await axios.post(
                    'http://190.46.221.131:3300/customer/create',
                    {
                        name: `${userInfo.nombres} ${userInfo.apellidos}`,
                        email: userInfo.correo,
                        externalId: userInfo.rut,
                        codigo_Usuario: userInfo.IdentificadorUsuario
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Respuesta de la creación del cliente:', response.data);
                // Puedes manejar la respuesta según tus necesidades
            }
        } catch (error) {
            console.error('Error al crear el cliente:', error);
        }
    };

    return (
        <View style={styles.containerHeader}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                    <View style={styles.backButton}>
                        <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>UNITE+</Text>
            </View>
            <TouchableOpacity style={styles.agregarButton} onPress={handleUniteButtonClick} >
                <Ionicons name="add-circle-outline" size={40} color="#FA8E7D" />
                <Text style={styles.agregarButtonText}>UNITE!</Text>
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

export default UniteScreen;