export const CLASS_GRADES = [
  '1º Ano',
  '2º Ano',
  '3º Ano',
  '4º Ano',
  '5º Ano',
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1º EM',
  '2º EM',
  '3º EM',
];

export const CLASS_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Separa "9º Ano B" em série + letra (usado para preencher o formulário). */
export function parseClassValue(value: string): { grade: string; letter: string } {
  if (!value) return { grade: '', letter: '' };

  const clean = value.replace(/\uFFFD/g, 'º').replace(/\s+/g, ' ').trim();

  // Encontra a série conhecida em qualquer formato: "9º Ano B", "9º B",
  // "9B", "9ano b", "9º Ano"...
  const numberMatch = clean.match(/^\s*(\d{1,2})\s*(?:º|°|o)?\s*(EM|ano)?\s*([A-Za-z])?\s*$/i);

  if (numberMatch) {
    const number = Number(numberMatch[1]);
    const isHighSchool = (numberMatch[2] || '').toUpperCase() === 'EM';
    const letter = (numberMatch[3] || '').toUpperCase();

    const grade = isHighSchool
      ? `${number}º EM`
      : `${number}º Ano`;

    if (CLASS_GRADES.includes(grade)) {
      return { grade, letter };
    }
  }

  // Último recurso: valor já no formato canônico
  const match = clean.match(/^(.+?)\s*([A-Za-z])?$/);
  if (!match) return { grade: '', letter: '' };

  const grade = match[1].trim();
  const letter = (match[2] || '').toUpperCase();

  if (!CLASS_GRADES.includes(grade)) return { grade: '', letter: '' };

  return { grade, letter };
}

/** Junta série + letra no formato usado no payload ("9º Ano B"). */
export function formatClassValue(grade: string, letter: string): string {
  if (!grade) return '';
  return letter ? `${grade} ${letter}` : grade;
}
