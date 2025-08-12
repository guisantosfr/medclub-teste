import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    Appbar,
    TextInput,
    Button
} from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-paper-dropdown';

const medicos = [
    { label: 'Dr. João Silva', value: 'Dr. João Silva' },
    { label: 'Dra. Maria Oliveira', value: 'Dra. Maria Oliveira' },
    { label: 'Dr. Pedro Santos', value: 'Dr. Pedro Santos' },
];

const specialties = [
    { label: 'Cardiologia', value: 'Cardiologia' }
]

const locations = [
    { label: 'Hospital 1', value: 'Hospital 1' }
]

const AddConsultationScreen = () => {
    const [data, setData] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [medico, setMedico] = useState<string>('');
    
    const [especialidade, setEspecialidade] = useState<string>('');

    const [localizacao, setLocalizacao] = useState<string>('');

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setData(selectedDate);
        }
    };

    const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date | undefined) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setHora(selectedTime);
        }
    };

    const handleSubmit = () => {
    
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Nova Consulta" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Campo de Data */}
                <TextInput
                    label="Data"
                    value={data.toLocaleDateString('pt-BR')}
                    onFocus={() => setShowDatePicker(true)}
                    style={styles.input}
                    right={<TextInput.Icon icon="calendar-today" />}
                />
                {showDatePicker && (
                    <DateTimePicker
                        value={data}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {/* Campo de Hora */}
                <TextInput
                    label="Hora"
                    value={hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    onFocus={() => setShowTimePicker(true)}
                    style={styles.input}
                    right={<TextInput.Icon icon="clock-outline" />}
                />
                {showTimePicker && (
                    <DateTimePicker
                        value={hora}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}

                <Dropdown
                    label="Médico"
                    placeholder='Selecione o médico'
                    options={medicos}
                    value={medico}
                    onSelect={setMedico}
                />

                <View style={styles.dropdown}>
                    <Dropdown
                        label="Especialidade"
                        placeholder='Selecione a especialidade'
                        options={specialties}
                        value={especialidade}
                        onSelect={setEspecialidade}
                    />

                </View>

                <Dropdown
                    label="Localização"
                    placeholder='Selecione a localização'
                    options={locations}
                    value={localizacao}
                    onSelect={setLocalizacao}
                />

                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    Agendar Consulta
                </Button>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    input: {
        marginBottom: 16,
        width: '100%',
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 24,
        width: '75%',
        marginHorizontal: 'auto'
    },
    dropdown: {
        marginVertical: 16
    }
});

export default AddConsultationScreen;