import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';

const Comunas = ({ selectedCategory, onCategoryChange }) => {
  return (
    <Picker
      selectedValue={selectedCategory}
      onValueChange={onCategoryChange}
      style={styles.picker}
      itemStyle={styles.itemStyle}
    >
      <Picker.Item label="Selecciona una Comuna" value="" />
      <Picker.Item label="Comuna 1" value="comuna1" />
      <Picker.Item label="Comuna 2" value="comuna2" />
      {/* Agrega más elementos según tus necesidades */}
    </Picker>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: '80%',
    height: 50,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#FA8E7D',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white'
  },
});

export default Comunas;
