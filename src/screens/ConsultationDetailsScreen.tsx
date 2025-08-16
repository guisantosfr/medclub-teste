import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Avatar, Button, Card, Dialog, Icon, Portal, Text, TextInput, HelperText, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useForm, Controller } from "react-hook-form";
import Toast from 'react-native-toast-message';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types/RootStackParamList'
import { useConsultations } from "../contexts/ConsultationsContext";
import { Consultation } from '../types/Consultation';
import { formatDate } from '../helpers/formatDate'
import { validateDateTime } from '../helpers/validateDateTime';

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

  useEffect(() => {
    if (watchedDate && watchedTime) {
      trigger('time');
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

  const isPastConsultation = (consultation: Consultation) => {
    const now = new Date();
    const consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
    return consultationDateTime < now;
  };

  const theme = useTheme()

  if (!consultation) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#6b7280' }}>Consulta não encontrada.</Text>
      </View>
    )
  }

  const handleCancel = () => {
    cancel(consultation.id.toString())

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
    if (selectedDate && event.type === 'set') {
      setValue('date', selectedDate);
      trigger('date');
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && event.type === 'set') {
      setValue('time', selectedTime);
      trigger('time');
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


      {
        consultation.canceled ?
          <Text variant='titleMedium' style={styles.canceledInfo}>Esta consulta foi cancelada</Text>
          :
          isPastConsultation(consultation) ?
            <Text variant='titleMedium' style={styles.canceledInfo}>Esta consulta já foi realizada</Text>
            :
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
      }

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
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

      <Portal>
        <Dialog visible={rescheduleVisible} onDismiss={hideRescheduleDialog} style={styles.dialog}>
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
                  <View style={styles.input}>
                    <Button
                      mode="outlined"
                      icon="calendar-today"
                      onPress={() => setShowDatePicker(true)}
                      style={[
                        styles.dateTimeButton,
                        errors.date && styles.errorButton
                      ]}
                      contentStyle={styles.buttonContent}
                      labelStyle={[
                        styles.buttonLabel,
                        !field.value && styles.placeholderLabel
                      ]}
                    >
                      {field.value ? field.value.toLocaleDateString('pt-BR') : 'Selecione uma data'}
                    </Button>
                    <HelperText type="error" visible={!!errors.date}>
                      {errors.date?.message}
                    </HelperText>
                  </View>
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
                  <View style={styles.input}>
                    <Button
                      mode="outlined"
                      icon="clock-outline"
                      onPress={() => setShowTimePicker(true)}
                      style={[
                        styles.dateTimeButton,
                        errors.time && styles.errorButton
                      ]}
                      contentStyle={styles.buttonContent}
                      labelStyle={[
                        styles.buttonLabel,
                        !field.value && styles.placeholderLabel
                      ]}
                    >
                      {field.value ? field.value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Selecione um horário'}
                    </Button>
                    <HelperText type="error" visible={!!errors.time}>
                      {errors.time?.message}
                    </HelperText>
                  </View>
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
  subtitle: {
    color: 'gray'
  },
  avatar: {
    marginRight: 32,
  },
  consultationInfoCard: {
    marginVertical: 6,
    width: '90%',
    marginHorizontal: 'auto',
    backgroundColor: '#fff',
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
  canceledInfo: {
    textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  actionButton: {
    width: '40%',
    marginTop: 8
  },
  dialog: {
    margin: 20,
    backgroundColor: '#fff'
  },
  dialogDescription: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    gap: 12,
  },
  dateTimeButton: {
    height: 56,
    justifyContent: 'flex-start',
  },
  errorButton: {
    borderColor: '#B00020',
    borderWidth: 2,
  },
  buttonContent: {
    height: 56,
    justifyContent: 'flex-start',
    paddingLeft: 12,
  },
  buttonLabel: {
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  placeholderLabel: {
    color: '#757575',
  }
})