export function formatDate(value?: string): string {
  if (!value) return '-';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    A: 'Ativo',
    I: 'Inativo',
    R: 'Recarga',
    S: 'Substituído'
  };
  return labels[status] ?? status;
}
