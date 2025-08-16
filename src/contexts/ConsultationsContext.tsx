import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockConsultations } from "../utils/mockConsultations";
import { Consultation } from "../types/Consultation";

interface ConsultationsContextData {
  consultations: Consultation[];
  getById: (id: string) => Consultation | undefined;
  add: (data: Omit<Consultation, "id">) => void;
  remove: (id: string) => void;
  cancel: (id: string) => void;
  reschedule: (id: string, date: Date | string, time: Date | string) => void;
}

const ConsultationsContext = createContext<ConsultationsContextData | undefined>(undefined);

const STORAGE_KEY = "consultations";
const INIT_KEY = "consultations_initialized";

const loadConsultations = async (): Promise<Consultation[]> => {
  try {
    const initialized = await AsyncStorage.getItem(INIT_KEY);
    if (!initialized) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockConsultations));
      await AsyncStorage.setItem(INIT_KEY, "true");
      return mockConsultations;
    }

    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Error loading consultations:", err);
    return []; // Retorna um array vazio em caso de erro
  }
};

export function ConsultationsProvider({ children }: { children: ReactNode }) {
  const [consultations, setConsultations] = useState(mockConsultations);

  useEffect(() => {
    // Apenas carrega na montagem
    loadConsultations().then(setConsultations);
  }, []);

  useEffect(() => {
    // Salva sempre que 'consultations' mudar (exceto na montagem inicial)
    // Para evitar salvar a lista vazia antes de carregar, podemos adicionar uma verificação
    if (consultations.length > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(consultations)).catch(err => {
        console.error("Error saving consultations:", err);
      });
    }
  }, [consultations]);

  const sortedConsultations = useMemo(() => {
    return [...consultations].sort((a, b) => {
      // Compare dates first
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;

      // If dates are equal, compare times
      return a.time.localeCompare(b.time);
    });
  }, [consultations]);

  function getById(id: string) {
    return consultations.find(c => c.id === id);
  }

  function add(data: Omit<Consultation, "id">) {
    // Convert Date objects to strings before storing
    const newConsultation = {
      ...data,
      id: Date.now().toString(),
      date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
      time: data.time instanceof Date ? data.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : data.time
    };
    setConsultations(prev => [...prev, newConsultation]);
  }

  function remove(id: string) {
    setConsultations(prev => prev.filter(c => c.id !== id));
  }

  function cancel(id: string) {
    setConsultations(prev => prev.map(consultation =>
      consultation.id === id
        ? { ...consultation, canceled: true }
        : consultation
    ));
  }

  function reschedule(id: string, date: Date | string, time: Date | string) {
    setConsultations(prev => prev.map(consultation => {
      if (consultation.id === id) {
        return {
          ...consultation,
          date: date instanceof Date ? date.toISOString().split('T')[0] : date,
          time: time instanceof Date ? time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : time
        };
      }
      return consultation;
    }));
  }

  return (
    <ConsultationsContext.Provider value={{
      consultations: sortedConsultations,
      getById,
      add,
      remove,
      cancel,
      reschedule
    }}>
      {children}
    </ConsultationsContext.Provider>
  );
}

export function useConsultations() {
  const context = useContext(ConsultationsContext);
  if (!context) {
    throw new Error("useConsultations deve ser usado dentro de ConsultationsProvider");
  }
  return context;
}
