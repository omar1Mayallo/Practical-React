import axios, {AxiosError} from "axios";
import {useEffect, useState} from "react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const UseEff: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTodos = async () => {
    try {
      const {data} = await axios.get<Todo[]>(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTodos(data);
      setLoading(false);
    } catch (err) {
      setError(err as AxiosError);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <section>
      <h1>useEffect() vs React Query</h1>
      <div style={{textAlign: "center"}}>
        {todos.map((item, id) => {
          return (
            <div
              key={id}
              style={{
                padding: 10,
                margin: "5px 10px",
                border: "1px solid black",
              }}
            >
              {item.title}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UseEff;
