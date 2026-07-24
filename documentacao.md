# IFPI Organiza - Documentação do MVP

## 1. Cabeçalho

**Disciplina:** Programação para Dispositivos Móveis  
**Curso:** ADS 4 - IFPI/Picos  
**Professor:** João Paulo  
**Nome do Projeto/App:** IFPI Organiza  
**Data:** 01/07/2026  
**Etapa:** Projeto e Design do MVP

**Equipe:**

- Ezequiel Victor Pinheiro Barros: projeto, design, protótipo e documentação.

## 2. Visão geral/Justificativa

### Problema

Alunos do IFPI precisam acompanhar tarefas, provas, trabalhos e prazos de diferentes disciplinas ao longo do semestre. Quando essas informações ficam espalhadas em cadernos, mensagens ou anotações soltas, aumenta o risco de esquecimento, atraso nas entregas e dificuldade de organização da rotina acadêmica.

### Proposta de valor

O IFPI Organiza propõe centralizar os compromissos acadêmicos em uma interface simples, mobile e objetiva. A proposta é facilitar o acompanhamento das atividades, permitindo que o aluno visualize pendências, registre novas tarefas e acompanhe prazos importantes em um único lugar.

### Objetivos do MVP

- Apresentar um protótipo mobile navegável para validação da ideia.
- Simular o cadastro e a listagem de tarefas acadêmicas.
- Permitir a marcação de tarefas concluídas.
- Exibir um resumo das pendências do aluno.
- Organizar prazos em uma tela de calendário simplificado.

## 3. Público-alvo e requisitos de usuário

### Perfil do usuário

O público-alvo do IFPI Organiza é formado por alunos do IFPI, especialmente estudantes que precisam organizar tarefas, avaliações, trabalhos, seminários e prazos relacionados às disciplinas do curso.

### Histórias de usuário

- Como aluno, eu quero cadastrar tarefas para acompanhar minhas atividades acadêmicas.
- Como aluno, eu quero visualizar prazos para não esquecer entregas.
- Como aluno, eu quero marcar tarefas como concluídas para acompanhar meu progresso.
- Como aluno, eu quero ver um resumo das pendências para organizar minha rotina.

## 4. Definição técnica

**Modelo de desenvolvimento:** nesta etapa, o projeto é um protótipo mobile desenvolvido em HTML, CSS e JavaScript. Em uma versão futura, a proposta é evoluir para um aplicativo cross-platform com React Native ou Flutter.

**Linguagem de programação:** o protótipo utiliza JavaScript. Em uma implementação futura, poderão ser utilizados JavaScript/TypeScript com React Native ou Dart com Flutter.

**Persistência de dados:** nesta etapa não há banco de dados real. Os dados são simulados no próprio JavaScript. Futuramente, a persistência poderá ser feita com Firebase ou Supabase.

**Serviços de terceiros:** em uma etapa futura, poderão ser utilizados serviços de autenticação, banco de dados em nuvem e notificações.

## 5. Escopo de funcionalidades do MVP

### Funcionalidades essenciais

- Login simulado.
- Dashboard com resumo acadêmico.
- Listagem de tarefas.
- Cadastro de tarefas.
- Marcação de tarefa concluída.
- Calendário/prazos.
- Perfil do aluno.

### Funcionalidades desejáveis

- Edição e exclusão de tarefas.
- Notificações de prazos.
- Autenticação real.
- Sincronização em nuvem.
- Modo escuro.

## 6. Modelagem conceitual

### MER

A modelagem conceitual do IFPI Organiza pode ser representada pelas entidades Aluno, Tarefa, Disciplina e Prazo.

- **Aluno:** id, nome, e-mail, curso e período.
- **Tarefa:** id, título, descrição, tipo, status e data de criação.
- **Disciplina:** id, nome e professor.
- **Prazo:** id, data, hora, tipo e situação.

Um aluno pode possuir várias tarefas. Cada tarefa pode estar relacionada a uma disciplina e possuir um prazo associado.

### Casos de uso

O principal ator do sistema é o Aluno. As principais funcionalidades previstas são acessar o aplicativo, visualizar o dashboard, cadastrar tarefas, listar tarefas, marcar tarefas como concluídas, consultar prazos e visualizar o perfil.

### Diagrama de classes

As principais classes conceituais são:

- **Aluno:** representa o usuário do aplicativo, com dados de identificação acadêmica.
- **Tarefa:** representa uma atividade acadêmica cadastrada pelo aluno.
- **Disciplina:** representa a disciplina relacionada à tarefa.
- **Calendario:** organiza os prazos e permite a visualização das datas importantes.

### Fluxograma de telas

O fluxo de navegação proposto para o protótipo é:

**Login -> Início -> Tarefas -> Nova tarefa -> Prazos -> Perfil**

### Arquitetura

Na etapa atual, a arquitetura é composta por um protótipo executado no navegador, utilizando HTML para a estrutura das telas, CSS para a interface visual e JavaScript para navegação e dados simulados. Em uma etapa futura, a arquitetura poderá evoluir para um aplicativo mobile com autenticação, banco de dados em nuvem e notificações.

## 7. Design de UX e UI

### Wireframes

O protótipo possui telas de login, início, tarefas, nova tarefa, prazos e perfil. Essas telas simulam o fluxo principal de uso do aplicativo e permitem apresentar a ideia de forma navegável.

### Style Guide

A interface utiliza verde institucional como cor principal, fundo claro, cards brancos, tipografia sans-serif, botões verdes e layout mobile. O objetivo visual é manter uma aparência limpa, acadêmica e fácil de apresentar.

### Protótipo interativo

O protótipo é navegável no navegador e simula a experiência de um app mobile. A navegação entre telas é feita por botões e abas inferiores, sem backend real ou banco de dados nesta etapa.

## 8. Cronograma simplificado

| Etapa | Atividade | Situação |
| --- | --- | --- |
| 1 | Definição da ideia e público-alvo | Concluída |
| 2 | Levantamento do problema e requisitos | Concluída |
| 3 | Criação do protótipo navegável | Concluída |
| 4 | Documentação e roteiro de apresentação | Concluída |
| 5 | Implementação mobile real | Futura |

## 9. Limitações da etapa atual

- Sem backend real.
- Sem banco de dados real.
- Login apenas simulado.
- Dados simulados no JavaScript.

Essas limitações são coerentes com a etapa de Projeto e Design do MVP. A autenticação real, a persistência dos dados e os serviços em nuvem ficam previstos para a fase futura de implementação.

## 10. Considerações finais

O IFPI Organiza apresenta uma proposta simples e objetiva para apoiar a organização acadêmica dos alunos do IFPI. O protótipo permite visualizar o fluxo principal do aplicativo e validar a ideia antes de uma implementação mobile completa. Em uma próxima etapa, o projeto poderá evoluir para um aplicativo real com autenticação, banco de dados, sincronização em nuvem e notificações de prazos.
