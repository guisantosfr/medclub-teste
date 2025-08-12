import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockConsultations } from "../utils/mockConsultations";
import { Consultation } from "../types/Consultation";
//import { v4 as uuidv4 } from "uuid"; // npm install uuid

interface ConsultationsContextData {
  consultations: Consultation[];
  getById: (id: string) => Consultation | undefined;
  add: (data: Omit<Consultation, "id">) => void;
  remove: (id: string) => void;
}

const ConsultationsContext = createContext<ConsultationsContextData | undefined>(undefined);

export function ConsultationsProvider({ children }: { children: ReactNode }) {
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);

  function getById(id: string) {
    return consultations.find(c => c.id === id);
  }

  function add(data: Omit<Consultation, "id">) {
    // Convert Date objects to strings before storing
    const newConsultation = { 
      ...data, 
      id: Date.now().toString(), // Better than hardcoded '999'
      date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
      time: data.time instanceof Date ? data.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : data.time
    };
    setConsultations(prev => [...prev, newConsultation]);
  }

  function remove(id: string) {
    setConsultations(prev => prev.filter(c => c.id !== id));
  }

  return (
    <ConsultationsContext.Provider value={{ consultations, getById, add, remove }}>
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
