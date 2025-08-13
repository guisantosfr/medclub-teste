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
import { doctors, specialties, locations } from '../utils/mockData'; 

type FormData = {
    date: Date | null
    time: Date | null
    doctor: string
    specialty: string
    location: string
}

const doctorOptions = doctors.map(doc => ({
    label: doc.name,
    value: doc.name
}));

const specialtyOptions = specialties.map(spec => ({
    label: spec.name,
    value: spec.name
}));

const locationOptions = locations.map(loc => ({
    label: loc.name,
    value: loc.name
}));

export default function AddConsultationScreen() {
    const { add } = useConsultations();
    const navigation = useNavigation();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>({
        defaultValues: {
            date: null,
            time: null,
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
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
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
                                value={field.value ? field.value.toLocaleDateString('pt-BR') : ''}
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
                        value={watchedDate || new Date()}
                        mode="date"
                        display="default"
                        minimumDate={today}
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
                                placeholder="Selecione um horário"
                                value={field.value ? field.value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
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
                        value={watchedTime || new Date()}
                        mode="time"
                        display="spinner"
                        minuteInterval={30}
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
                        <View style={styles.input}>
                            <Dropdown
                                label="Médico"
                                placeholder='Selecione o médico'
                                options={doctorOptions}
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
                        <View style={styles.input}>
                            <Dropdown
                                label="Especialidade"
                                placeholder='Selecione a especialidade'
                                options={specialtyOptions}
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
                        <View style={styles.input}>
                            <Dropdown
                                label="Localização"
                                placeholder='Selecione a localização'
                                options={locationOptions}
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
        flex: 1,
        marginTop: 36
    },
    input: {
        marginBottom: 8,
        width: '90%',
        marginHorizontal: 'auto'
    },
    button: {
        marginTop: 24,
        width: '75%',
        marginHorizontal: 'auto'
    }
});