import { Consultation } from "../types/Consultation";

function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = date.getMonth();
    const monthNum = String(monthIndex + 1).padStart(2, "0");
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();

    const showYear = year !== currentYear;

    const formattedDate = showYear
        ? `${day}/${monthNum}/${year}`
        : `${day}/${monthNum}`;

    return formattedDate;
}

const validateDateTime = (date: Date | null, time: Date | null) => {
    if (!date || !time) return true;

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

const getSectionTitle = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Normalizar datas para comparação (sem hora)
    const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const normalizedDate = normalizeDate(date);
    const normalizedToday = normalizeDate(today);
    const normalizedTomorrow = normalizeDate(tomorrow);
    const normalizedYesterday = normalizeDate(yesterday);

    if (normalizedDate.getTime() === normalizedToday.getTime()) {
        return 'Hoje';
    } else if (normalizedDate.getTime() === normalizedTomorrow.getTime()) {
        return 'Amanhã';
    } else if (normalizedDate.getTime() === normalizedYesterday.getTime()) {
        return 'Ontem';
    } else {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
        });
    }
};

const isPastConsultation = (consultation: Consultation) => {
    const now = new Date();
    const consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
    return consultationDateTime < now;
};

const isUpcomingConsultation = (consultation: Consultation) => {
    const now = new Date();
    const consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
    return consultationDateTime >= now && !consultation.canceled;
};

export {
    formatDate,
    validateDateTime,
    getSectionTitle,
    isPastConsultation,
    isUpcomingConsultation
};