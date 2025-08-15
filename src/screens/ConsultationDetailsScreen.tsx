import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { RootStackParamList } from '../types/RootStackParamList'
import { useConsultations } from "../contexts/ConsultationsContext";
import { Appbar, Avatar, Button, Card, Dialog, Icon, Portal, Text, TextInput, HelperText, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from "react-hook-form";

type Props = NativeStackScreenProps<RootStackParamList, 'ConsultationDetails'>

type RescheduleFormData = {
  date: Date | null;
  time: Date | null;
}

export default function ConsultationDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params
  const { getById, cancel, reschedule } = useConsultations();

  const consultation = getById(id);

  const [visible, setVisible] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

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
    trigger
  } = useForm<RescheduleFormData>({
    defaultValues: {
      date: null,
      time: null
    },
  });

  const watchedDate = watch('date');
  const watchedTime = watch('time');

  // Revalidar quando data ou hora mudam
  useEffect(() => {
    if (watchedDate && watchedTime) {
      trigger('time'); // Revalida o campo de tempo
    }
  }, [watchedDate, watchedTime, trigger]);

  const showRescheduleDialog = () => {
    if (consultation) {
      // Parse da data atual da consulta (formato YYYY-MM-DD)
      const [year, month, day] = consultation.date.split('-').map(Number);
      const currentDate = new Date(year, month - 1, day);
      setValue('date', currentDate);

      // Parse do horário atual da consulta (formato HH:MM)
      const [hours, minutes] = consultation.time.split(':').map(Number);
      const currentTime = new Date();
      currentTime.setHours(hours, minutes, 0, 0);
      setValue('time', currentTime);
    }
    setRescheduleVisible(true);
  };

  const hideRescheduleDialog = () => {
    setRescheduleVisible(false);
    reset();
  };

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = date.getMonth();
    const monthNum = String(monthIndex + 1).padStart(2, "0");
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();

    const showYear = year !== currentYear;

    const version2 = showYear
      ? `${day}/${monthNum}/${year}`
      : `${day}/${monthNum}`;

    return version2;
  }

  const theme = useTheme()

  if (!consultation) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#6b7280' }}>Consulta não encontrada.</Text>
      </View>
    )
  }

  const handleCancel = () => {
    cancel(consultation.id)

    Toast.show({
      type: 'success',
      text1: 'Consulta cancelada com sucesso'
    })

    navigation.popToTop()
  }

  const onRescheduleSubmit = (data: RescheduleFormData) => {
    if (!data.date || !data.time) return;

    // Formatar data para YYYY-MM-DD
    const year = data.date.getFullYear();
    const month = String(data.date.getMonth() + 1).padStart(2, '0');
    const day = String(data.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Formatar horário para HH:MM
    const hours = String(data.time.getHours()).padStart(2, '0');
    const minutes = String(data.time.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    try {
      reschedule(consultation.id, formattedDate, formattedTime);

      Toast.show({
        type: 'success',
        text1: 'Consulta reagendada com sucesso'
      });

      hideRescheduleDialog();

      navigation.popToTop()
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao reagendar consulta'
      });
    }
  };

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
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => { navigation.goBack() }} />
        <Appbar.Content title="Detalhes da consulta" />
      </Appbar.Header>

      <Card style={styles.doctorCard}>
        <Card.Title
          title={consultation.doctor}
          titleVariant='titleLarge'
          subtitle={consultation.specialty}
          subtitleVariant='titleMedium'
          subtitleStyle={styles.subtitle}
          left={(props) => <Avatar.Icon {...props} icon="account" size={50} />}
          leftStyle={styles.avatar}>
        </Card.Title>
      </Card>

      <Card style={styles.consultationInfoCard}>
        <Card.Content>
          <View style={styles.consultationInfo}>
            <View style={styles.infoLabel}>
              <Icon source="calendar" size={20} />

              <Text variant="bodyLarge" style={styles.labelText}>
                Data
              </Text>
            </View>

            <Text variant="titleMedium">{formatDate(consultation.date)}</Text>
          </View>

          <View style={styles.consultationInfo}>
            <View style={styles.infoLabel}>
              <Icon source="clock" size={20} />

              <Text variant="bodyLarge" style={styles.labelText}>
                Horário
              </Text>
            </View>

            <Text variant="titleMedium">{consultation.time}</Text>
          </View>

          <View style={styles.consultationInfo}>
            <View style={styles.infoLabel}>
              <Icon source="map-marker" size={20} />

              <Text variant="bodyLarge" style={styles.labelText}>
                Localização
              </Text>
            </View>

            <Text variant="titleMedium">{consultation.location}</Text>
          </View>

        </Card.Content>
      </Card>

      <View style={styles.buttons}>
        <Button
          mode='contained'
          onPress={showRescheduleDialog}
          style={styles.actionButton}
          icon="calendar"
        >
          Reagendar
        </Button>

        <Button
          mode='contained'
          buttonColor={theme.colors.error}
          onPress={showDialog}
          style={styles.actionButton}
          icon="cancel"
        >
          Cancelar
        </Button>

      </View>

      {/* Modal de Cancelamento */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Cancelar consulta</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Tem certeza que deseja cancelar esta consulta?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Não</Button>
            <Button onPress={handleCancel}>Sim, cancelar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Modal de Reagendamento */}
      <Portal>
        <Dialog visible={rescheduleVisible} onDismiss={hideRescheduleDialog} style={styles.rescheduleDialog}>
          <Dialog.Title>Reagendar consulta</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogDescription}>
              Selecione a nova data e horário para a consulta:
            </Text>

            <View style={styles.inputContainer}>
              <Controller
                control={control}
                rules={{
                  required: 'Selecione uma data',
                }}
                render={({ field }) => (
                  <>
                    <TextInput
                      label="Nova data"
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
                      label="Novo horário"
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
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideRescheduleDialog}>Cancelar</Button>
            <Button onPress={handleSubmit(onRescheduleSubmit)} mode="contained">
              Reagendar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16
  },

  doctorCard: {
    padding: 12,
    marginVertical: 6,
    width: '90%',
    marginHorizontal: 'auto',
    backgroundColor: '#fff'
  },

  consultationInfoCard: {
    marginVertical: 6,
    width: '90%',
    marginHorizontal: 'auto',
    backgroundColor: '#fff',
  },

  subtitle: {
    color: 'gray'
  },

  avatar: {
    marginRight: 32,
  },

  consultationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8
  },

  infoLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },

  labelText: {
    marginLeft: 8
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

  actionButton: {
    width: '40%',
    marginTop: 8
  },

  rescheduleDialog: {
    margin: 20,
  },

  dialogDescription: {
    marginBottom: 16,
  },

  inputContainer: {
    gap: 12,
  },

  input: {
    backgroundColor: 'transparent',
  },
})