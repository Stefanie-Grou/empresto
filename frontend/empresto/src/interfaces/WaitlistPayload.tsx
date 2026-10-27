export interface WaitlistResponse {
  posicaoFila: string;
  mensagem: string;
}

export interface WaitlistPayload {
  nomeAluno: string;
  nomePessoa?: string;
  tipoPessoa?: 'Aluno' | 'Professor' | 'Funcionário' | string;
  personType?: 'Aluno' | 'Professor' | 'Funcionário' | string;
  serie?: string;
  turma?: string;
}
