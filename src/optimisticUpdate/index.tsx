import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useMemo, useState } from "react";
import { Link } from "react-router";
import { addTodo, listTodos, type Todo } from "./api/todos";

const todosQueryKey = ["todos"] as const;

const OptimisticUpdate = () => {
  const qc = useQueryClient();
  const todosQuery = useQuery({
    queryKey: todosQueryKey,
    queryFn: listTodos,
    staleTime: 10_000,
  });
  const addTodoMutation = useMutation({
    // 更新処理
    mutationFn: (newTitle: string) => addTodo(newTitle),

    // 仮更新
    onMutate: async (newTitle) => {
      await qc.cancelQueries({ queryKey: todosQueryKey });

      const previousTodos = qc.getQueryData<Todo[]>(todosQueryKey) ?? [];

      const optimisticTodo: Todo = {
        id: Date.now(), // 仮ID
        title: newTitle,
        completed: false,
      };

      qc.setQueryData<Todo[]>(todosQueryKey, [
        optimisticTodo,
        ...previousTodos,
      ]);

      return { previousTodos }; // mutation context に保管 （ React contextではない ）
    },

    // 巻き戻し
    onError: (_err, _newTitle, context) => {
      if (!context) return;
      qc.setQueryData(todosQueryKey, context.previousTodos);
    },

    // 同期
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: todosQueryKey });
    },

    // optimistic updateでは基本的に不要
    // onSuccess: async () => {
    //   await qc.invalidateQueries({ queryKey: todosQueryKey });
    // },
  });

  const [title, setTitle] = useState("");
  const todos = useMemo(() => {
    return todosQuery.data ?? [];
  }, [todosQuery.data]);
  const remaining = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    addTodoMutation.mutate(trimmed);
    setTitle("");
  };

  return (
    <div style={{ padding: 16, maxWidth: 680 }}>
      <h1>rq-lab: Todos</h1>

      <div style={{ marginBottom: 12 }}>
        <strong>Remaining:</strong> {remaining}
        {todosQuery.isFetching ? <span> (refreshing...)</span> : null}
      </div>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add todo"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={addTodoMutation.isPending}>
          {addTodoMutation.isPending ? "Adding..." : "Add"}
        </button>
      </form>

      {todosQuery.isLoading ? <div>Loading...</div> : null}
      {todosQuery.isError ? (
        <div style={{ color: "crimson" }}>
          Error: {(todosQuery.error as Error).message}
        </div>
      ) : null}

      {addTodoMutation.isError ? (
        <div style={{ color: "crimson" }}>
          Add Error: {(addTodoMutation.error as Error).message}
        </div>
      ) : null}

      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            #{t.id} {t.title}
          </li>
        ))}
      </ul>
      <br />
      <Link to="/">Home</Link>
    </div>
  );
};

export default OptimisticUpdate;
