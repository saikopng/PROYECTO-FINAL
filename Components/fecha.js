import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';


const FechaPicker = ({ selectedDate, onDateChange, showDatePicker, setShowDatePicker }) => {
    const handleDateChange = (event, date) => {
      setShowDatePicker(false);
      if (date !== undefined && date !== null) {
        onDateChange(date);
      }
    };

    const formatDate = (date) => {
            return format(date, 'dd/MM/yyyy', { locale: require('date-fns/locale/es') });
          };

    return (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          {selectedDate ? (
                            <Text style={styles.selectedDateText}> 
                            {formatDate(selectedDate)}
                            </Text>
                        ) : (
                            <Text style={styles.selectDateText}>{new Date().toLocaleDateString()}
                            
                            </Text>
                        )}
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                value={selectedDate || new Date()} // Usa selectedDate si está definido, de lo contrario, usa la fecha actual.
                mode="date"
                display="default"
                onChange={handleDateChange}
            />
          )}
        </>
      );
    };


    const styles = {
        selectedDateText: {
          fontSize: 18,
          color: '#FA8E7D', // Cambia el color según tu diseño
          // Otros estilos personalizados
        },
        selectDateText: {
          fontSize: 16,
          color: '#FA8E7D', // Cambia el color según tu diseño
          // Otros estilos personalizados
        },
      };

      
export default FechaPicker;