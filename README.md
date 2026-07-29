# IFPI Organiza

MVP mobile desenvolvido para auxiliar alunos do IFPI na organização de tarefas acadêmicas, provas, trabalhos e prazos.

## Estado do projeto

**Etapa 2 — Implementação e Testes**

A versão mobile está disponível na branch `etapa-2-expo` e foi executada e verificada em um dispositivo Android por meio do Expo Go.

## Integrante

- **Ezequiel Victor Pinheiro Barros**

Projeto desenvolvido para a disciplina **Programação para Dispositivos Móveis — ADS 4 — IFPI Campus Picos**, ministrada pelo professor João Paulo.

## Tecnologias utilizadas

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- Expo SQLite
- Git
- GitHub
- Visual Studio Code

## Funcionalidades implementadas

As funcionalidades disponíveis na versão atual do MVP são:

- login simulado;
- navegação entre Dashboard, Tarefas, Prazos e Perfil;
- cadastro de tarefas;
- filtros Todas, Pendentes e Concluídas;
- conclusão de tarefas;
- exclusão de tarefas com confirmação;
- atualização automática dos contadores;
- atualização automática dos prazos;
- persistência local das tarefas com Expo SQLite.

## Funcionalidades testadas e aprovadas

Foram executados testes funcionais manuais em um dispositivo Android por meio do Expo Go.

| Funcionalidade verificada | Resultado |
| --- | --- |
| Login simulado | Aprovado |
| Navegação entre Dashboard, Tarefas, Prazos e Perfil | Aprovado |
| Cadastro de tarefas | Aprovado |
| Filtro Todas | Aprovado |
| Filtro Pendentes | Aprovado |
| Filtro Concluídas | Aprovado |
| Conclusão de tarefas | Aprovado |
| Exclusão de tarefas com confirmação | Aprovado |
| Atualização automática dos contadores | Aprovado |
| Atualização automática dos prazos | Aprovado |
| Persistência após fechar e reabrir o Expo Go | Aprovado |

## Documentação dos testes

Os procedimentos, resultados e limitações dos testes manuais estão registrados em:

[Consultar relatório de testes da Etapa 2](TESTES_ETAPA_2.md)

## Itens pendentes de verificação

Os seguintes itens ainda precisam ser executados ou avaliados:

- testes unitários automatizados;
- testes de integração automatizados;
- avaliação de usabilidade com o questionário SUS;
- execução em outros dispositivos Android;
- execução em outros sistemas operacionais.

## Persistência de dados

As tarefas são armazenadas localmente no dispositivo utilizando **Expo SQLite**.

A persistência foi verificada ao cadastrar tarefas, fechar o Expo Go, abrir novamente o aplicativo e confirmar que os dados continuavam armazenados.

Nesta versão, o projeto não utiliza backend remoto nem sincronização em nuvem.

## Instalação e execução

### Pré-requisitos

Para executar o projeto, é necessário possuir:

- Node.js;
- npm;
- Git;
- aplicativo Expo Go instalado em um dispositivo Android;
- computador e dispositivo móvel conectados à mesma rede, quando necessário.

### Clonar o repositório

```bash
git clone https://github.com/Ezequiel127/ifpi-organiza.git
```

### Acessar o repositório

```bash
cd ifpi-organiza
```

### Acessar a branch da Etapa 2

```bash
git checkout etapa-2-expo
```

### Acessar o projeto mobile

```bash
cd mobile
```

### Instalar as dependências

```bash
npm install
```

### Iniciar o projeto

```bash
npx expo start
```

Depois de iniciar o projeto:

1. abra o aplicativo Expo Go no dispositivo Android;
2. escaneie o QR Code exibido no terminal ou no navegador;
3. aguarde o carregamento do aplicativo.

## Resultados alcançados

- MVP mobile executado em ambiente Android;
- fluxo principal de gerenciamento de tarefas funcionando;
- cadastro, conclusão e exclusão de tarefas;
- filtragem das tarefas por situação;
- atualização automática das informações apresentadas;
- armazenamento local utilizando SQLite;
- persistência das tarefas confirmada após fechar e reabrir o Expo Go.

## Limitações da versão atual

- o login é apenas simulado;
- não há autenticação real;
- não há backend remoto;
- não há sincronização em nuvem;
- os dados permanecem armazenados somente no banco SQLite local do dispositivo;
- a execução foi verificada em apenas um dispositivo Android;
- outros dispositivos Android e outros sistemas operacionais ainda não foram verificados;
- testes automatizados ainda não foram executados;
- avaliação SUS ainda não foi realizada.

## Implementações futuras

As seguintes funcionalidades permanecem planejadas para versões futuras:

- autenticação real de usuários;
- backend remoto;
- sincronização de dados em nuvem.

## Estrutura do projeto

A implementação mobile está localizada na pasta:

```text
mobile/
```

O projeto utiliza o Expo Router para organizar as telas e a navegação da aplicação.

## Branch da Etapa 2

A implementação da Etapa 2 está disponível na branch:

```text
etapa-2-expo
```

## Repositório

```text
https://github.com/Ezequiel127/ifpi-organiza
```

## Observação

Este README registra apenas funcionalidades e resultados que foram executados e verificados na versão atual do MVP.

Autenticação real, backend remoto e sincronização em nuvem não estão implementados.
