export const formatDate = (date) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date))
}