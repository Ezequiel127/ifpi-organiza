# Testes da Etapa 2 — IFPI Organiza

## Estado do documento

Este documento registra apenas testes executados e confirmados no Android por meio do Expo Go.

## Ambiente de execução

- plataforma: Android;
- ambiente de execução: Expo Go;
- Expo SDK 54;
- React Native;
- TypeScript;
- Expo Router;
- Expo SQLite.

## Testes funcionais manuais

| ID | Funcionalidade | Procedimento executado | Resultado esperado | Resultado obtido | Estado | Evidência |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Login simulado | Preencher ou utilizar os dados simulados e acessar o aplicativo. | Abrir o fluxo principal do aplicativo. | Acesso ao fluxo principal realizado. | Aprovado. | Pendente de anexação. |
| T02 | Navegação entre telas | Navegar por Dashboard, Tarefas, Prazos e Perfil. | Todas as telas abrirem corretamente. | Navegação realizada entre todas as telas. | Aprovado. | Pendente de anexação. |
| T03 | Cadastro de tarefas | Cadastrar uma nova tarefa. | A tarefa aparecer na listagem. | Tarefa cadastrada e exibida. | Aprovado. | Pendente de anexação. |
| T04 | Filtro Todas | Selecionar o filtro Todas. | Exibir todas as tarefas. | Todas as tarefas foram exibidas. | Aprovado. | Pendente de anexação. |
| T05 | Filtro Pendentes | Selecionar o filtro Pendentes. | Exibir somente tarefas pendentes. | Somente tarefas pendentes foram exibidas. | Aprovado. | Pendente de anexação. |
| T06 | Filtro Concluídas | Selecionar o filtro Concluídas. | Exibir somente tarefas concluídas. | Somente tarefas concluídas foram exibidas. | Aprovado. | Pendente de anexação. |
| T07 | Conclusão de tarefas | Marcar uma tarefa como concluída. | Atualizar o estado da tarefa. | Tarefa marcada como concluída. | Aprovado. | Pendente de anexação. |
| T08 | Exclusão com confirmação | Solicitar a exclusão de uma tarefa e confirmar. | Excluir a tarefa somente após confirmação. | Tarefa excluída após confirmação. | Aprovado. | Pendente de anexação. |
| T09 | Atualização dos contadores | Cadastrar, concluir ou excluir tarefas. | Atualizar automaticamente os contadores do Dashboard. | Contadores atualizados automaticamente. | Aprovado. | Pendente de anexação. |
| T10 | Atualização dos prazos | Cadastrar, concluir ou excluir tarefas com prazo. | Atualizar automaticamente as informações de prazos. | Prazos atualizados automaticamente. | Aprovado. | Pendente de anexação. |
| T11 | Persistência local | Cadastrar tarefas, fechar o Expo Go e abrir novamente o aplicativo. | Manter as tarefas armazenadas. | Tarefas permaneceram armazenadas após reabrir. | Aprovado. | Pendente de anexação. |

## Itens não verificados

- testes unitários automatizados — Não verificado;
- testes de integração automatizados — Não verificado;
- avaliação de usabilidade SUS — Não verificado;
- execução em outros dispositivos Android — Não verificado;
- execução em outros sistemas operacionais — Não verificado.

## Limitações dos testes

- os testes foram manuais;
- a execução foi verificada em apenas um dispositivo Android;
- não existem evidências anexadas ao repositório até o momento;
- autenticação real, backend remoto e sincronização em nuvem não foram testados porque não estão implementados.
