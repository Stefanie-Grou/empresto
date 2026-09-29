-- Emprestô - Empréstimos de teste

INSERT INTO emprestimo
(id_pessoa, id_livro, data_emprestimo, prazo_devolucao, devolucao, atraso)
VALUES
(1, 1, '2026-09-20', '2026-09-27', 'Não feita', 'Não'),
(2, 2, '2026-09-18', '2026-09-25', 'Feita', 'Não');