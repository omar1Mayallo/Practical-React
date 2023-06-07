import axios, {AxiosError} from "axios";
import {useQuery} from "@tanstack/react-query";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const RQuery: React.FC = () => {
  const fetchTodos = async () => {
    const {data} = await axios.get<Todo[]>(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return data;
  };

  const {data, error, isLoading} = useQuery<Todo[], AxiosError>(
    ["todos"],
    fetchTodos
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <section>
      <h1>useEffect() vs React Query</h1>
      <div style={{textAlign: "center"}}>
        {data?.map((item, idx) => {
          return (
            <div
              key={idx}
              style={{
                padding: 10,
                margin: "5px 10px",
                border: "1px solid black",
              }}
            >
              {item.id}) {item.title}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RQuery;
