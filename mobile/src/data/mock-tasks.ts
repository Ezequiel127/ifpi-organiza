import type { Task } from '@/src/types/task';

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Entregar protótipo mobile',
    subject: 'Programação para Dispositivos Móveis',
    deadline: '2026-07-30',
    type: 'Trabalho',
    description: 'Finalizar as telas principais e revisar o fluxo de navegação.',
    completed: false,
    createdAt: '2026-07-25T09:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Revisar requisitos do MVP',
    subject: 'Engenharia de Software',
    deadline: '2026-08-02',
    type: 'Atividade',
    description: 'Conferir os requisitos funcionais e não funcionais do projeto.',
    completed: false,
    createdAt: '2026-07-24T14:30:00.000Z',
  },
  {
    id: 'task-3',
    title: 'Preparar apresentação do projeto',
    subject: 'Projeto Integrador',
    deadline: '2026-08-05',
    type: 'Seminário',
    description: 'Organizar os tópicos e ensaiar a apresentação do aplicativo.',
    completed: false,
    createdAt: '2026-07-23T16:00:00.000Z',
  },
  {
    id: 'task-4',
    title: 'Definir identidade visual',
    subject: 'Programação para Dispositivos Móveis',
    deadline: '2026-07-25',
    type: 'Atividade',
    description: 'Definir cores, tipografia e componentes visuais do protótipo.',
    completed: true,
    createdAt: '2026-07-20T11:15:00.000Z',
  },
];
