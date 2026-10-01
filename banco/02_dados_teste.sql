-- Emprestô - Dados de teste

INSERT INTO pessoa (nome, tipo_pessoa)
VALUES
('Ana Souza', 'Aluno'),
('Carlos Oliveira', 'Aluno'),
('Mariana Santos', 'Professor');

INSERT INTO livro
(titulo, autor, genero, quantidade_exemplares, quantidade_disponivel)
VALUES
('Dom Casmurro', 'Machado de Assis', 'Romance', 5, 3),
('O Cortiço', 'Aluísio Azevedo', 'Romance', 3, 2),
('Vidas Secas', 'Graciliano Ramos', 'Romance', 4, 4);