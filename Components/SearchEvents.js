import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchEvents = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
      <TextInput
        style={{ flex: 1, borderWidth: 1, padding: 8, marginRight: 8 }}
        placeholder="Buscar eventos"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Icon name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};




export default SearchEvents;