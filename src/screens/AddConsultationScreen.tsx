import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    HelperText,
    Text,
    useTheme
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

const specialtyOptions = specialties.map(spec => ({
    label: spec.name,
    value: spec.id.toString()
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

    const theme = useTheme()

    // Função para validar se o horário é no passado
    const validateDateTime = (date: Date | null, time: Date | null) => {
        if (!date || !time) return true; // Se não tem data ou hora, deixa outras validações cuidarem

        const now = new Date();
        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

        // Se a data selecionada é hoje, verifica se o horário é maior que o atual
        const isToday = date.toDateString() === now.toDateString();
        if (isToday && selectedDateTime <= now) {
            return 'Não é possível agendar para um horário no passado';
        }

        return true;
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
        trigger // Adicionar trigger para revalidar
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
    const watchedSpecialty = watch('specialty');

    // Filtra os médicos com base na especialidade selecionada
    const filteredDoctors = useMemo(() => {
        if (!watchedSpecialty) return [];

        const selectedSpecialtyId = parseInt(watchedSpecialty);
        return doctors
            .filter(doctor => doctor.specialtyId === selectedSpecialtyId)
            .map(doctor => ({
                label: doctor.name,
                value: doctor.name
            }));
    }, [watchedSpecialty]);

    // Reset do campo médico quando a especialidade muda
    useEffect(() => {
        if (watchedSpecialty) {
            setValue('doctor', '');
        }
    }, [watchedSpecialty, setValue]);

    // Revalidar quando data ou hora mudam
    useEffect(() => {
        if (watchedDate && watchedTime) {
            trigger('time'); // Revalida o campo de tempo
        }
    }, [watchedDate, watchedTime, trigger]);

    const onSubmit = (data: FormData) => {
        // Converte o ID da especialidade de volta para o nome antes de salvar
        const selectedSpecialty = specialties.find(spec => spec.id.toString() === data.specialty);
        const submitData = {
            ...data,
            specialty: selectedSpecialty?.name || ''
        };

        add(submitData);

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
                <Text variant='titleLarge' style={styles.title}>Data e horário</Text>

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
                                mode="outlined"
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

                <Controller
                    control={control}
                    rules={{
                        required: 'Selecione um horário',
                        validate: () => validateDateTime(watchedDate, watchedTime)
                    }}
                    render={({ field }) => (
                        <>
                            <TextInput
                                label="Hora"
                                placeholder="Selecione um horário"
                                value={field.value ? field.value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                onFocus={() => setShowTimePicker(true)}
                                style={styles.input}
                                mode="outlined"
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

                <Text variant='titleLarge' style={styles.title}>Informações do médico</Text>

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
                                mode="outlined"
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
                                options={filteredDoctors}
                                mode='outlined'
                                value={value}
                                onSelect={onChange}
                                disabled={!watchedSpecialty}
                            />
                            <HelperText type="error" visible={!!errors.doctor}>
                                {errors.doctor?.message}
                            </HelperText>
                        </View>
                    )}
                    name="doctor"
                />

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
                                mode="outlined"
                                options={locationOptions}
                                value={value}
                                onSelect={onChange}
                                disabled={!watchedSpecialty}
                            />
                            <HelperText type="error" visible={!!errors.location}>
                                {errors.location?.message}
                            </HelperText>
                        </View>
                    )}
                    name="location"
                />

                <Button
                    mode="contained"
                    icon="calendar"
                    onPress={handleSubmit(onSubmit)} 
                    style={styles.button}>
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
    title: {
        textAlign: 'center',
        marginBottom: 8
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