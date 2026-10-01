# empresto
Projeto Integrador do segundo semestre de 2026 (Univesp)

---

# Arquivos importantes:
* [Requisitos e Escopo](Requisitos.md)

---

# Backend

API RESTful desenvolvida em Node.js com TypeScript e Express para gerenciar o acervo, empréstimos, devoluções e fila de espera da sala de leitura da PEI EE Amélia dos Anjos Oliveira.

### Tecnologias e Ferramentas
* **Node.js** (Ambiente de execução)
* **Express.js** (Framework HTTP para rotas e middleware)
* **TypeScript** (Tipagem estática e segurança em tempo de compilação)
* **CORS** (Habilitação de requisições cross-origin com o frontend)
* **tsx** (Execução e recarga em tempo real no desenvolvimento)

### Como Executar

1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

O servidor iniciará por padrão na porta `8080`:
* **Base URL:** `http://localhost:8080/api/v1`

---

### Estrutura de Diretórios

```
backend/
├── src/
│   ├── controllers/       # Recepção das requisições e envio das respostas HTTP
│   │   ├── AcervoController.ts
│   │   └── EmprestimoController.ts
│   ├── services/          # Regras de negócio e validações (estoque, status)
│   │   ├── AcervoService.ts
│   │   └── EmprestimoService.ts
│   ├── models/            # Classes e entidades de domínio
│   │   ├── ItemAcervo.ts
│   │   ├── Emprestimo.ts
│   │   └── FilaEspera.ts
│   ├── repositories/      # Acesso e persistência de dados
│   │   └── Database.ts
│   ├── routes/            # Definição e mapeamento dos endpoints REST
│   │   ├── acervo.routes.ts
│   │   ├── emprestimo.routes.ts
│   │   └── index.ts
│   └── server.ts          # Configuração e inicialização da aplicação Express
├── package.json
└── tsconfig.json
```

---

### Endpoints da API

#### 1. Acervo

* **Listar Acervo**
  * **Método:** `GET`
  * **Rota:** `/api/v1/acervo`
  * **Parâmetros de Consulta (Opcional):** `?titulo={nome}`
  * **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "id": 1,
        "titulo": "História do Brasil",
        "tipo": "Livro Didático",
        "quantidadeTotal": 5,
        "quantidadeDisponivel": 3
      }
    ]
    ```

* **Cadastrar Novo Item**
  * **Método:** `POST`
  * **Rota:** `/api/v1/acervo`
  * **Corpo da Requisição:**
    ```json
    {
      "titulo": "Revista Pesquisa FAPESP",
      "tipo": "Revista",
      "autor": "Vários",
      "quantidadeTotal": 2
    }
    ```
  * **Resposta de Sucesso (201 Created):**
    ```json
    {
      "id": 2,
      "mensagem": "Item cadastrado com sucesso!"
    }
    ```

---

#### 2. Empréstimos

* **Registrar Empréstimo**
  * **Método:** `POST`
  * **Rota:** `/api/v1/emprestimos`
  * **Corpo da Requisição:**
    ```json
    {
      "acervoId": 1,
      "nomeAluno": "João Silva",
      "serie": "8º Ano A",
      "dataDevolucaoPrevista": "2026-09-25"
    }
    ```
  * **Resposta de Sucesso (201 Created):**
    ```json
    {
      "id": 1,
      "mensagem": "Empréstimo registrado com sucesso!",
      "emprestimo": {
        "id": 1,
        "acervoId": 1,
        "nomeAluno": "João Silva",
        "serie": "8º Ano A",
        "dataEmprestimo": "2026-09-26",
        "dataDevolucaoPrevista": "2026-09-25",
        "status": "ATIVO"
      }
    }
    ```
  * **Resposta de Erro - Sem Estoque (400 Bad Request):**
    ```json
    {
      "erro": "Nenhum exemplar disponível no momento. Deseja entrar na fila de espera?"
    }
    ```

* **Registrar Devolução**
  * **Método:** `PUT`
  * **Rota:** `/api/v1/emprestimos/{id}/devolucao`
  * **Resposta de Sucesso (200 OK):**
    ```json
    {
      "mensagem": "Devolução registrada com sucesso."
    }
    ```

---

#### 3. Fila de Espera

* **Adicionar à Fila de Espera**
  * **Método:** `POST`
  * **Rota:** `/api/v1/acervo/{acervoId}/fila`
  * **Corpo da Requisição:**
    ```json
    {
      "nomeAluno": "Carlos Pereira",
      "serie": "9º Ano B"
    }
    ```
  * **Resposta de Sucesso (201 Created):**
    ```json
    {
      "posicaoFila": 1,
      "mensagem": "Aluno adicionado à fila de espera."
    }
    ```

---

# Frontend
* [Figma](https://www.figma.com/design/o3SXdbvFGO3FBiRoWrlHOf/Projeto-Integrador?node-id=56-4560&t=BfuqiT3my2Qrv3BN-0)
