import { useState, useEffect, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Toast, { type ToastType } from './Toast';
import { ENDPOINTS } from '../services/apiConfig';

interface BookOption {
  id: number;
  titulo: string;
  autor: string;
  tipo?: string;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
}

interface PersonOption {
  id: number;
  nome: string;
  tipoPessoa: string;
  turma?: string;
}

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanCreated?: (newLoan: any) => void;
}

function parseClassString(val: string): { grade: string; letter: string } {
  if (!val) return { grade: '', letter: '' };
  const clean = val.replace(/\uFFFD/g, 'º').trim();
  const emMatch = clean.match(/([1-3])\s*º?\s*EM\s*([A-Za-z])?/i);
  if (emMatch) {
    return {
      grade: `${emMatch[1]}º EM`,
      letter: (emMatch[2] || '').toUpperCase(),
    };
  }
  const fundMatch = clean.match(/([1-9])\s*º?\s*(?:ano)?\s*([A-Za-z])?/i);
  if (fundMatch) {
    return {
      grade: `${fundMatch[1]}º Ano`,
      letter: (fundMatch[2] || '').toUpperCase(),
    };
  }
  return { grade: '', letter: '' };
}

export default function NewLoanModal({ isOpen, onClose, onLoanCreated }: NewLoanModalProps) {
  const [books, setBooks] = useState<BookOption[]>([]);
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [livroId, setLivroId] = useState<string>('');
  const [nomePessoa, setNomePessoa] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [tipoPessoa, setTipoPessoa] = useState<string>('Aluno');
  const [prazoDevolucao, setPrazoDevolucao] = useState<string>('');

  const turma = selectedGrade
    ? selectedLetter
      ? `${selectedGrade} ${selectedLetter}`
      : selectedGrade
    : '';

  useEffect(() => {
    if (!isOpen) return;

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const dateFormatted = defaultDate.toISOString().split('T')[0];
    setPrazoDevolucao(dateFormatted);

    setLivroId('');
    setNomePessoa('');
    setSelectedGrade('');
    setSelectedLetter('');
    setTipoPessoa('Aluno');
    setToast(null);

    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [resBooks, resPeople] = await Promise.all([
          fetch(ENDPOINTS.INVENTORY).catch(() => null),
          fetch(`${ENDPOINTS.INVENTORY}/pessoas`).catch(() => null),
        ]);

        if (resBooks && resBooks.ok) {
          const booksData = await resBooks.json();
          setBooks(booksData);
        }

        if (resPeople && resPeople.ok) {
          const peopleData = await resPeople.json();
          setPeople(peopleData);
        }
      } catch (err) {
        console.error('Erro ao carregar dados para o modal:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNomeChange = (valor: string) => {
    setNomePessoa(valor);
    const pessoaEncontrada = people.find(
      (p) => p.nome.toLowerCase() === valor.trim().toLowerCase()
    );
    if (pessoaEncontrada) {
      if (pessoaEncontrada.tipoPessoa) {
        setTipoPessoa(pessoaEncontrada.tipoPessoa);
      }
      if (pessoaEncontrada.turma) {
        const parsed = parseClassString(pessoaEncontrada.turma);
        setSelectedGrade(parsed.grade);
        setSelectedLetter(parsed.letter);
      }
    }
  };

  const validateForm = (): boolean => {
    if (!livroId) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Livro obrigatório',
        message: 'Por favor, selecione um livro do acervo para realizar o empréstimo.',
      });
      return false;
    }

    const selectedBook = books.find((b) => String(b.id) === String(livroId));
    if (selectedBook && selectedBook.quantidadeDisponivel <= 0) {
      setToast({
        id: Date.now(),
        type: 'warning',
        title: 'Exemplar indisponível',
        message: 'Este livro não possui exemplares disponíveis para empréstimo no momento.',
      });
      return false;
    }

    if (!nomePessoa.trim()) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Nome obrigatório',
        message: 'Por favor, informe o nome.',
      });
      return false;
    }

    if (!prazoDevolucao) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Prazo obrigatório',
        message: 'Por favor, informe a data prevista para devolução.',
      });
      return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(prazoDevolucao + 'T00:00:00');
    if (dataSelecionada < hoje) {
      setToast({
        id: Date.now(),
        type: 'warning',
        title: 'Data inválida',
        message: 'O prazo de devolução não pode ser uma data retroativa.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(ENDPOINTS.LOANS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          livroId: Number(livroId),
          nomeAluno: nomePessoa.trim(),
          nomePessoa: nomePessoa.trim(),
          studentName: nomePessoa.trim(),
          tipoPessoa,
          turma: turma.trim() || '-',
          studentClass: turma.trim() || '-',
          prazoDevolucao,
          dueDate: prazoDevolucao,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao registrar empréstimo no banco de dados.');
      }

      setToast({
        id: Date.now(),
        type: 'success',
        title: 'Empréstimo registrado',
        message: 'O empréstimo foi gravado com sucesso no banco de dados!',
      });

      if (onLoanCreated) {
        onLoanCreated(data.emprestimo);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Erro ao registrar',
        message: err.message || 'Não foi possível conectar ao banco de dados.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden p-6 sm:p-8 relative transition-all">
        <div className="relative flex items-center justify-center mb-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 text-center font-sans">
            Cadastrar Novo Empréstimo
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg cursor-pointer"
            aria-label="Fechar"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-sm">
          <div className="flex items-center gap-4">
            <label htmlFor="livroSelect" className="text-gray-700 font-medium w-24 shrink-0">
              Livro
            </label>
            <div className="flex-1">
              <select
                id="livroSelect"
                value={livroId}
                onChange={(e) => setLivroId(e.target.value)}
                disabled={isLoadingData || isSubmitting}
                className="w-full bg-[#f0f2f5] text-gray-800 rounded-xl px-4 py-2.5 border border-transparent focus:border-main-background-green focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="">
                  {isLoadingData ? 'Carregando acervo...' : 'Selecione o livro...'}
                </option>
                {books.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    disabled={b.quantidadeDisponivel <= 0}
                  >
                    {b.titulo} - {b.autor} ({b.quantidadeDisponivel} {b.quantidadeDisponivel === 1 ? 'disponível' : 'disponíveis'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="nomeLeitor" className="text-gray-700 font-medium w-24 shrink-0">
              Nome
            </label>
            <div className="flex-1 relative">
              <input
                id="nomeLeitor"
                type="text"
                list="pessoas-list"
                value={nomePessoa}
                onChange={(e) => handleNomeChange(e.target.value)}
                placeholder="Nome"
                disabled={isSubmitting}
                className="w-full bg-[#f0f2f5] text-gray-800 rounded-xl px-4 py-2.5 border border-transparent focus:border-main-background-green focus:bg-white focus:outline-none transition-all"
              />
              <datalist id="pessoas-list">
                {people.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.tipoPessoa} {p.turma ? `(${p.turma})` : ''}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <label className="text-gray-700 font-medium w-24 shrink-0">
                Turma
              </label>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="relative flex-1 min-w-0">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2.5 bg-[#f0f2f5] text-gray-800 rounded-xl text-sm outline-none appearance-none pr-7 border border-transparent focus:border-main-background-green focus:bg-white transition-all cursor-pointer truncate"
                  >
                    <option value="">Série...</option>
                    <optgroup label="Fundamental">
                      <option value="1º Ano">1º Ano</option>
                      <option value="2º Ano">2º Ano</option>
                      <option value="3º Ano">3º Ano</option>
                      <option value="4º Ano">4º Ano</option>
                      <option value="5º Ano">5º Ano</option>
                      <option value="6º Ano">6º Ano</option>
                      <option value="7º Ano">7º Ano</option>
                      <option value="8º Ano">8º Ano</option>
                      <option value="9º Ano">9º Ano</option>
                    </optgroup>
                    <optgroup label="Ensino Médio">
                      <option value="1º EM">1º EM</option>
                      <option value="2º EM">2º EM</option>
                      <option value="3º EM">3º EM</option>
                    </optgroup>
                  </select>
                  <Icon
                    icon="lucide:chevron-down"
                    className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>

                <div className="relative w-16 shrink-0">
                  <select
                    value={selectedLetter}
                    onChange={(e) => setSelectedLetter(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-2 py-2.5 bg-[#f0f2f5] text-gray-800 rounded-xl text-sm text-center outline-none appearance-none pr-5 border border-transparent focus:border-main-background-green focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">-</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                  <Icon
                    icon="lucide:chevron-down"
                    className="w-3.5 h-3.5 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-44 shrink-0">
              <label htmlFor="tipoSelect" className="text-gray-700 font-medium shrink-0">
                Tipo
              </label>
              <div className="relative flex-1">
                <select
                  id="tipoSelect"
                  value={tipoPessoa}
                  onChange={(e) => setTipoPessoa(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#f0f2f5] text-gray-800 rounded-xl px-3 py-2.5 border border-transparent focus:border-main-background-green focus:bg-white focus:outline-none transition-all cursor-pointer appearance-none pr-7 text-sm"
                >
                  <option value="Aluno">Aluno</option>
                  <option value="Professor">Professor</option>
                  <option value="Funcionário">Funcionário</option>
                </select>
                <Icon
                  icon="lucide:chevron-down"
                  className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="prazoInput" className="text-gray-700 font-medium w-24 shrink-0">
              Devolução
            </label>
            <div className="flex-1">
              <input
                id="prazoInput"
                type="date"
                value={prazoDevolucao}
                onChange={(e) => setPrazoDevolucao(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#f0f2f5] text-gray-800 rounded-xl px-4 py-2.5 border border-transparent focus:border-main-background-green focus:bg-white focus:outline-none transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-7 py-2.5 bg-[#f0f2f5] hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-9 py-2.5 bg-main-background-green hover:bg-[#0a2f22] text-white font-medium rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
