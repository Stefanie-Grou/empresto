# Projeto Emprestô - Empréstimo de Livros

## Documento de Definição de Escopo e Requisitos

1. Visão Geral do Projeto

O projeto "Emprestô" visa solucionar a dificuldade de gestão da sala de leitura de uma escola estadual. Atualmente, o controle de acervo e empréstimos é feito manualmente em um caderno ata, dificultando a busca por exemplares, controle de devoluções e gestão de filas de espera. O sistema será uma plataforma web simples e de acesso exclusivo da professora responsável, substituindo o controle manual por um ambiente digital organizado.

2. Público-alvo
* Desenvolvedores frontend e backend
* Equipe do projeto PI (UNIVESP)
* Professores avaliadores
* Professora responsável pela sala de leitura

3. Arquitetura e tecnologias 
### Frontend
- React.js (Core do projeto)
- Vite (Build tool e servidor de desenvolvimento)
- Tailwind CSS (Utilizado para estilização moderna e responsiva)
- Recharts (Para os gráficos financeiros e de estoque no dashboard)
- Zod (Validação rigorosa de formulários de usuários e insumos)
- Native Fetch API (Realizar requisições HTTP assíncronas - buscar recursos de rede)

### Backend
- Node.js
- Express.js
- JWT (Autenticação segura de rotas)
- bcryptjs (Criptografia de senhas)
- Prisma ORM (Interface de comunicação com o banco de dados)
- Nodemailer (Integração com SMTP do Gmail para recuperação de senha)
- Express Rate Limit (Proteção contra ataques de força bruta no login e recuperação de senha)
- CORS (Gerenciamento de permissões de acesso entre domínios)

### Banco de Dados
PostgreSQL (Hospedado na Neon, que oferece escalabilidade e arquitetura serverless)

### Hospedagem
Render
GitHub

## O que está INCLUÍDO (In Scope)

- Sistema de acesso restrito (apenas para o(a) professor(a) administrador(a)).

- Gerenciamento completo (CRUD) do acervo da sala de leitura (livros de história, paradidáticos, didáticos e revistas).

- Gerenciamento de alunos/leitores (apenas para fins de registro de quem realizou o empréstimo).

- Controle de empréstimos e devoluções, incluindo registro de datas e cálculo de status (no prazo ou em atraso).

- Sistema de fila de espera para itens que não possuem exemplares disponíveis no momento.

- Painel de controle (Dashboard) simples com visão geral do acervo e empréstimos pendentes.

## O que está EXCLUÍDO (Out of Scope)

- Aplicativo ou portal de acesso para os alunos (leitura exclusiva do professor).

- Integração com APIs externas de busca de ISBN ou catalogação automática (para manter a simplicidade inicial).

- Sistema de multas financeiras ou penalidades automatizadas por atraso.

- Envio automatizado de e-mails/SMS para alunos (notificações serão apenas visuais na tela da professora).

## Requisitos Funcionais (RF)

- Os Requisitos Funcionais descrevem as ações e funcionalidades que o sistema deve ser capaz de realizar.

- RF01 - Autenticação: O sistema deve permitir o login do usuário administrador (professora) utilizando e-mail e senha.

- RF02 - Gestão de Acervo: O sistema deve permitir cadastrar, editar, visualizar e excluir itens do acervo (título, autor, tipo do material, quantidade total de exemplares).

- RF03 - Gestão de Leitores: O sistema deve permitir cadastrar, editar, visualizar e excluir dados básicos dos alunos (nome, turma).

- RF04 - Busca: O sistema deve permitir a busca rápida de itens do acervo por título ou autor, exibindo a quantidade de exemplares disponíveis no momento.

- RF05 - Registro de Empréstimo: O sistema deve permitir vincular um item do acervo a um aluno, registrando a data de saída e a data prevista de devolução. O sistema deve deduzir 1 da quantidade disponível daquele item.

- RF06 - Registro de Devolução: O sistema deve permitir registrar a devolução de um item, retornando o exemplar para a quantidade disponível no acervo.

- RF07 - Controle de Atrasos: O sistema deve identificar e destacar visualmente os empréstimos cuja data atual ultrapassou a data prevista de devolução.

- RF08 - Fila de Espera: O sistema deve permitir adicionar alunos a uma fila de espera para um título específico quando não houver exemplares disponíveis. A fila deve respeitar a ordem de chegada (data/hora).

- RF09 - Baixa na Fila: Ao registrar uma devolução de um item que possui fila de espera, o sistema deve alertar a professora sobre qual aluno é o próximo da fila.

- RF10 - Dashboard: O sistema deve exibir uma tela inicial com métricas simples: total de itens no acervo, total de itens emprestados e total de empréstimos em atraso.

## Requisitos Não Funcionais (RNF)

* Os Requisitos Não Funcionais descrevem os critérios de qualidade, restrições e tecnologias do sistema.

- RNF01 - Usabilidade: A interface deve ser simples, limpa e responsiva (adaptável a telas de computadores, tablets e celulares), visto que o tempo da professora é dividido com outras atividades escolares.

- RNF02 - Tecnologia e Arquitetura: O sistema deve ser desenvolvido utilizando um framework web, banco de dados relacional e controle de versão, atendendo aos critérios do Projeto Integrador da Univesp.

- RNF03 - Desempenho: O sistema deve ser leve e projetado para funcionar adequadamente em redes com conexões de internet potencialmente lentas (comum em infraestruturas de escolas públicas).

- RNF04 - Segurança: O sistema não deve permitir o acesso a nenhuma de suas rotas internas sem que o usuário administrador esteja devidamente autenticado.

- RNF05 - Disponibilidade: O sistema deve operar em ambiente web na nuvem, garantindo acesso de qualquer computador da escola ou da casa da professora.

## Regras de Negócio (RN)

- RN01: Um item só pode ser emprestado se a quantidade de exemplares "disponíveis" for maior que zero.

- RN02: Um aluno não pode entrar na fila de espera de um item que possui exemplares disponíveis na estante.

- RN03: O sistema deve permitir que um mesmo título tenha múltiplos exemplares físicos.