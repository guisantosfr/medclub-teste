import React from 'react'
import { View, StyleSheet, Alert, Pressable } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { RootStackParamList } from '../types/RootStackParamList'
import { useConsultations } from "../contexts/ConsultationsContext";
import { Appbar, Avatar, Button, Card, Text, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsultationDetails'>

export default function ConsultationDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params
  const { getById, remove } = useConsultations();

  const consultation = getById(id);

  // COMPONENTIZAR ESSA FUNÇÃO
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

  const handleDelete = () => {
    Alert.alert('Excluir consulta', 'Tem certeza que deseja excluir esta consulta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          remove(consultation.id)

          Toast.show({
            type: 'success',
            text1: 'Consulta excluída com sucesso'
          })

          navigation.popToTop()
        },
      },
    ])
  }

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
            <Text variant="bodyLarge">Data</Text>
            <Text variant="titleMedium">{formatDate(consultation.date)}</Text>
          </View>

          <View style={styles.consultationInfo}>
            <Text variant="bodyLarge">Horário</Text>
            <Text variant="titleMedium">{consultation.time}</Text>
          </View>

          <View style={styles.consultationInfo}>
            <Text variant="bodyLarge">Localização</Text>
            <Text variant="titleMedium">{consultation.location}</Text>
          </View>

        </Card.Content>
      </Card>

      <Button 
      mode='contained' 
      buttonColor={theme.colors.error}
      onPress={handleDelete}
      style={styles.deleteButton}
      icon="trash-can"
      >
        Excluir consulta
      </Button>
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
    marginHorizontal: 'auto'
  },

  consultationInfoCard: {
    marginVertical: 6,
    width: '90%',
    marginHorizontal: 'auto'
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

  deleteButton: {
    width: '75%',
    marginHorizontal: 'auto',
    marginTop: 8
  },
})