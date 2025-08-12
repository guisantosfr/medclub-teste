import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    HelperText
} from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-paper-dropdown';
import { useForm, Controller } from "react-hook-form"
import { useConsultations } from "../contexts/ConsultationsContext";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

type FormData = {
    date: Date
    time: Date
    doctor: string
    specialty: string
    location: string
}

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


export default function AddConsultationScreen() {
    const { add } = useConsultations();
    const navigation = useNavigation();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>({
        defaultValues: {
            date: new Date(),
            time: new Date(),
            doctor: '',
            specialty: '',
            location: ''
        },
    })

    const watchedDate = watch('date');
    const watchedTime = watch('time');

    const onSubmit = (data: FormData) => {
        add(data);

        Toast.show({
            type: 'success',
            text1: 'Consulta agendada com sucesso'
        })

        navigation.goBack();
    }

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setValue('date', selectedDate);
        }
    };

    const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setValue('time', selectedTime);
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Nova Consulta" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Campo de Data */}
                <Controller
                    control={control}
                    rules={{
                        required: 'Selecione uma data',
                    }}
                    render={({ field }) => (
                        <>
                            <TextInput
                                label="Data"
                                value={field.value.toLocaleDateString('pt-BR')}
                                onFocus={() => setShowDatePicker(true)}
                                style={styles.input}
                                right={<TextInput.Icon icon="calendar-today" />}
                                error={!!errors.date}
                            />
                            <HelperText type="error" visible={!!errors.date}>
                                {errors.date?.message}
                            </HelperText>
                        </>
                    )}
                    name="date"
                />
                
                {showDatePicker && (
                    <DateTimePicker
                        value={watchedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {/* Campo de Hora */}
                <Controller
                    control={control}
                    rules={{
                        required: 'Selecione um horário',
                    }}
                    render={({ field }) => (
                        <>
                            <TextInput
                                label="Hora"
                                value={field.value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                onFocus={() => setShowTimePicker(true)}
                                style={styles.input}
                                right={<TextInput.Icon icon="clock-outline" />}
                                error={!!errors.time}
                            />
                            <HelperText type="error" visible={!!errors.time}>
                                {errors.time?.message}
                            </HelperText>
                        </>
                    )}
                    name="time"
                />
                
                {showTimePicker && (
                    <DateTimePicker
                        value={watchedTime}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}

                {/* Campo Médico */}
                <Controller
                    control={control}
                    rules={{
                        required: 'Selecione um médico',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.dropdown}>
                            <Dropdown
                                label="Médico"
                                placeholder='Selecione o médico'
                                options={medicos}
                                value={value}
                                onSelect={onChange}
                            />
                            <HelperText type="error" visible={!!errors.doctor}>
                                {errors.doctor?.message}
                            </HelperText>
                        </View>
                    )}
                    name="doctor"
                />

                {/* Campo Especialidade */}
                <Controller
                    control={control}
                    rules={{
                        required: 'Selecione uma especialidade',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.dropdown}>
                            <Dropdown
                                label="Especialidade"
                                placeholder='Selecione a especialidade'
                                options={specialties}
                                value={value}
                                onSelect={onChange}
                            />
                            <HelperText type="error" visible={!!errors.specialty}>
                                {errors.specialty?.message}
                            </HelperText>
                        </View>
                    )}
                    name="specialty"
                />

                {/* Campo Localização */}
                <Controller
                    control={control}
                    rules={{
                        required: 'Selecione uma localização',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.dropdown}>
                            <Dropdown
                                label="Localização"
                                placeholder='Selecione a localização'
                                options={locations}
                                value={value}
                                onSelect={onChange}
                            />
                            <HelperText type="error" visible={!!errors.location}>
                                {errors.location?.message}
                            </HelperText>
                        </View>
                    )}
                    name="location"
                />

                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
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
        marginBottom: 8,
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