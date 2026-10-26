// Erros de chamadas à API: quando o backend responde com { erro: "..." },
// a mensagem dele é usada no toast; caso contrário, cai no texto genérico.

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function extractMessage(body: unknown): string | null {
  if (!body) return null;

  if (typeof body === 'string') {
    const text = body.trim();
    return text && !text.startsWith('<') ? text : null;
  }

  if (typeof body === 'object') {
    const data = body as Record<string, unknown>;

    for (const key of ['erro', 'error', 'mensagem', 'message']) {
      const value = data[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
  }

  return null;
}

export async function parseErrorBody(response: Response): Promise<unknown> {
  try {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

export async function throwApiError(response: Response, fallback: string): Promise<never> {
  const body = await parseErrorBody(response);
  const message = extractMessage(body) || fallback;
  throw new ApiError(message, response.status, body);
}

export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message && error.message.trim()) {
    return error.message.trim();
  }
  return fallback;
}
