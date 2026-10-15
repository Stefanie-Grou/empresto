export function validateNotEmpty(value: string, fieldName: string): string | null {
    if (!value || !value.trim()) {
        return `O campo ${fieldName} não pode ficar vazio.`;
    }
    return null;
}

export function validateMinNumber(value: number, min: number, fieldName: string): string | null {
    if (value === undefined || value === null || Number.isNaN(value) || value < min) {
        return `O campo ${fieldName} deve ser maior ou igual a ${min}.`;
    }
    return null;
}