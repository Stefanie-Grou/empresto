-- Emprestô - Empréstimo de livros
-- Modelo inicial do banco de dados
-- Projeto Integrador II - UNIVESP

CREATE TABLE pessoa (
    id_pessoa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo_pessoa VARCHAR(20) NOT NULL
);

CREATE TABLE livro (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    quantidade_exemplares INT NOT NULL,
    quantidade_disponivel INT NOT NULL
);

CREATE TABLE emprestimo (
    id_emprestimo INT AUTO_INCREMENT PRIMARY KEY,
    id_pessoa INT NOT NULL,
    id_livro INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    prazo_devolucao DATE NOT NULL,
    devolucao VARCHAR(20) NOT NULL,
    atraso VARCHAR(10) NOT NULL,

    FOREIGN KEY (id_pessoa) REFERENCES pessoa(id_pessoa),
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro)
);

CREATE TABLE fila_espera (
    id_fila INT AUTO_INCREMENT PRIMARY KEY,
    id_pessoa INT NOT NULL,
    id_livro INT NOT NULL,
    data_requisicao DATETIME NOT NULL,

    FOREIGN KEY (id_pessoa) REFERENCES pessoa(id_pessoa),
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro)
);