export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

let nextId = 4;

let todos: Todo[] = [
  { id: 1, title: "Learn TanStack Query", completed: false },
  { id: 2, title: "Implement mutation + invalidate", completed: false },
  { id: 3, title: "Try optimistic update", completed: false },
];

const sleep = (ms: number) => {
  return new Promise<void>((r) => setTimeout(r, ms));
};

const maybeFail = (rate: number) => {
  if (Math.random() < rate) {
    throw new Error("Simulated network error");
  }
};

export const listTodos = async (): Promise<Todo[]> => {
  await sleep(300);
  maybeFail(0.1); // 10%失敗
  return [...todos];
};

export const addTodo = async (title: string): Promise<Todo> => {
  await sleep(500);
  maybeFail(0.3); // 30%失敗（optimistic確認しやすく）
  const newTodo: Todo = { id: nextId++, title, completed: false };
  todos = [newTodo, ...todos];
  return newTodo;
};
