const doctors = [
    { id: 1, name: "Dr. João Silva", specialtyId: 1 },
    { id: 2, name: "Dra. Maria Souza", specialtyId: 1 },
    { id: 3, name: "Dr. Pedro Almeida", specialtyId: 1 },

    { id: 4, name: "Dr. Lucas Pereira", specialtyId: 2 },
    { id: 5, name: "Dra. Ana Beatriz Costa", specialtyId: 2 },
    { id: 6, name: "Dr. Carlos Henrique", specialtyId: 2 },

    { id: 7, name: "Dra. Fernanda Oliveira", specialtyId: 3 },
    { id: 8, name: "Dr. Rafael Martins", specialtyId: 3 },
    { id: 9, name: "Dr. Gustavo Lima", specialtyId: 3 }
]

const specialties = [
    { id: 1, name: "Cardiologista" },
    { id: 2, name: "Dermatologista" },
    { id: 3, name: "Ortopedista" }
]

const locations = [
    { id: 1, name: "Clínica Central" },
    { id: 2, name: "Hospital São Lucas" },
    { id: 3, name: "Centro Médico Zona Sul" }
]

export {
    doctors,
    specialties,
    locations
}
