import { useQuery } from "@tanstack/react-query";

type Todo = { id: number; title: string; completed: boolean };

const fetchTodo = async (): Promise<Todo> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const App = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todo", 1],
    queryFn: fetchTodo,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>rq-lab</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
