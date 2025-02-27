export const serializeDate = (date: Date) => {
    return date.toISOString();
};

export const deserializeDate = (dateString: string) => {
    return new Date(dateString);
};

export const formatDate = (date: Date) => {
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}; 