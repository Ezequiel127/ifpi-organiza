export type Task = {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  type: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

export type NewTask = Pick<
  Task,
  'title' | 'subject' | 'deadline' | 'type' | 'description'
>;

export type TaskUpdate = Pick<
  Task,
  'title' | 'subject' | 'deadline' | 'type' | 'description'
>;
