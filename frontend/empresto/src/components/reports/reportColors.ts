// Paleta reutilizada dos StatCards + tons de apoio para fatiar os gráficos
export const REPORT_COLORS = {
  pendente: '#e0ba7b', // soft-yellow
  atrasado: '#bf6d6d', // soft-red
  aluno: '#01DF82', // secondary-light-green
  professor: '#5da3c9', // soft-blue
  funcionario: '#87B1A6', // secondary-light-gray
  linha: '#0E3D2D', // main-background-green
} as const;

// Fallback para fatiar turmas além das cores fixas
const FALLBACK_PALETTE = [
  '#0E3D2D',
  '#01DF82',
  '#5da3c9',
  '#e0ba7b',
  '#bf6d6d',
  '#87B1A6',
  '#1A594C',
  '#030F0F',
];

export function paletteColor(index: number): string {
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}
