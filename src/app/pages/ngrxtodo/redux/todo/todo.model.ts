export interface Todo {
  _id: string;
  userid?: string;
  title: string;
  type?: number;
  tag?: string;
  notes?: string;
  completed: boolean;
  create_at?: string;
  finish_at?: string;
}


