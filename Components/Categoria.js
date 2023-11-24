import { Picker } from "@react-native-picker/picker";

const Categorias = ({ selectedCategory, onCategoryChange }) => {
    return (
        <Picker
      selectedValue={selectedCategory}
      onValueChange={onCategoryChange}
      style={styles.picker}
    >
      <Picker.Item label="Selecciona una categoría" value="" />
      <Picker.Item label="Categoría 1" value="categoria1" />
      <Picker.Item label="Categoría 2" value="categoria2" />
      
    </Picker>

    );
}

const styles = {
        picker: {
          width: '80%',
          height: 50,
          marginTop: 20,
          borderWidth: 1,
          borderColor: 'gray',
          backgroundColor: '#FA8E7D',
          borderRadius: 40,
          paddingStart: 10,
          color: 'white'
        }
      };
      
export default Categorias;
