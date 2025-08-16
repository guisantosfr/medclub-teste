// Função para validar se o horário é no passado
export const validateDateTime = (date: Date | null, time: Date | null) => {
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