# useEffect() Problems In Data Fetching

This repository does not cover the basic details of `useEffect()` and how it works. For a comprehensive understanding, you can refer to the [official React documentation](https://react.dev/reference/react/useEffect). However, the focus of this repository is to discuss the specific challenges that arise when using the `useEffect()` hook for data fetching from external APIs, including fetch or mutation operations.

## Data Fetching In React

When working with data fetching in React applications, using libraries like [React Query](https://tanstack.com/query/v4/docs/react/overview) and [SWR](https://swr.vercel.app/)can provide several advantages over relying solely on the `useEffect()` hook. These libraries offer powerful solutions for managing remote data, caching, and handling common data fetching challenges.

In this repository, we will focus on using **_React Query_** as a solution to the problems that arise when using `useEffect()` for data fetching. also, **_SWR_** (Stale-While-Revalidate) follows a similar concept to **_React Query_**, but we will primarily compare **_React Query_** with the `useEffect()` approach in this context.

To understand the differences between **_React Query_** and **_SWR_**, you can refer to a detailed comparison between the two libraries [React Query vs SWR](https://dev.to/lvieira268/swr-vs-react-query-5el0).

Now, Let's dive into **_React Query_** and how it can address the challenges of using `useEffect()` for data fetching.

## React Query vs useEffect()

- **_Problem 1: Loading and Error Handling_**

  - _useEffect()_

    Handling loading states and error handling with useEffect() can be repetitive and require additional conditional logic. You need to manually track loading states and handle error cases, which can make your code more complex and harder to maintain.

    ```ts
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
    ```

  - _React Query_

    React Query provides built-in loading and error handling mechanisms, reducing the need for manual state management and conditional rendering. It simplifies loading state management and error handling, resulting in cleaner and more concise code.

    ```ts
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
    ```

<div align="center">___________________________</div>

- **_Problem 2: Manual Caching and Invalidations_**

  Caching is a technique used to store and reuse data that is frequently accessed or computationally expensive to generate. It improves application performance by reducing the need to retrieve or calculate the same data repeatedly.

  Cache invalidation, on the other hand, refers to the process of removing or updating cached data when it becomes outdated or no longer valid. It ensures that the cached data remains accurate and reflects the latest state of the underlying data source.

  In summary, caching helps improve performance by storing and reusing data, while cache invalidation ensures that the cached data is kept up-to-date. By combining caching and cache invalidation strategies, you can optimize data fetching and provide a more efficient and responsive user experience.

- _useEffect()_

  With `useEffect()`, managing data caching and invalidation manually can be cumbersome. You need to implement logic to cache the fetched data, handle cache invalidation, and ensure consistent data fetching across components.

  With the `useEffect()` hook, implementing caching can be a bit more involved as you need to manually manage the caching logic. However, you can achieve caching by using local state or a separate caching mechanism like the browser's localStorage.

  ```ts
  import React, {useState, useEffect} from "react";

  const ExampleComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
      const cachedData = localStorage.getItem("cachedData");

      if (cachedData) {
        // If cached data exists, use it
        setData(JSON.parse(cachedData));
      } else {
        // Fetch data from API and store it in cache
        fetchData()
          .then((responseData) => {
            setData(responseData);
            localStorage.setItem("cachedData", JSON.stringify(responseData));
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }, []);

    const fetchData = async () => {
      // Fetch data from API
      const response = await fetch("https://api.example.com/data");
      const jsonData = await response.json();
      return jsonData;
    };

    return (
      <div>
        <p>{data}</p>
      </div>
    );
  };
  ```

  By implementing caching in this way, subsequent renders of the component will use the cached data instead of making unnecessary API requests. However, please note that this is a basic example, and in a real-world scenario, you might need to consider cache expiration, cache invalidation, and other caching strategies depending on your specific requirements.

- _React Query_

  React Query simplifies data caching and invalidation by providing a `built-in` cache, automatic invalidation, and easy data retrieval across components.

  React Query handles caching and invalidation automatically, and you can easily retrieve data using the `useQuery` hook. It manages fetching, caching, and updating the data, providing a smoother and more efficient data fetching experience.

<div align="center">___________________________</div>

- **_Problem 3: Data Refetching and Background Updates_**

  - _useEffect()_

    In `useEffect()`, manually triggering data refetching and handling background updates can be complex and error-prone. You need to manage when and how to refetch data, handle stale data scenarios, and ensure consistency across components.

    ```ts
    import React, {useState, useEffect} from "react";

    const ExampleComponent = () => {
      const [data, setData] = useState(null);

      useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Refetch data every 5 seconds
        return () => clearInterval(interval);
      }, []);

      const fetchData = async () => {
        const response = await fetch("https://api.example.com/data");
        const jsonData = await response.json();
        setData(jsonData);
      };

      return <div>{data ? <p>{data}</p> : <p>Loading...</p>}</div>;
    };
    ```

  - _React Query_

    React Query simplifies data refetching and background updates by providing built-in mechanisms for automatic background data synchronization, refetching on interval, and handling stale data scenarios.

    ```ts
    import React from "react";
    import {useQuery} from "react-query";

    const ExampleComponent = () => {
      const {data, isLoading, error} = useQuery("data", fetchData, {
        refetchInterval: 5000, // Refetch data every 5 seconds
      });

      const fetchData = async () => {
        const response = await fetch("https://api.example.com/data");
        const jsonData = await response.json();
        return jsonData;
      };

      if (isLoading) {
        return <p>Loading...</p>;
      }

      if (error) {
        return <p>Error: {error.message}</p>;
      }

      return (
        <div>
          <p>{data}</p>
        </div>
      );
    };
    ```

<div align="center">___________________________</div><br/>

In the end, React Query provides an excellent solution for data fetching and caching, offering significant advantages over using the useEffect() hook alone. By leveraging React Query's powerful features, such as automatic caching, background data synchronization, query invalidation and much more, developers can simplify the data management process and enhance the overall performance and user experience of their applications. Whether it's handling complex API interactions, managing real-time updates, or optimizing network requests, React Query offers a robust and intuitive approach to data fetching and caching, making it a valuable tool in modern React applications.

<hr/>

### Resources

- [https://tanstack.com/query/v4/docs/react/overview](https://tanstack.com/query/v4/docs/react/overview)
- [https://blog.openreplay.com/fetching-and-updating-data-with-react-query/](https://blog.openreplay.com/fetching-and-updating-data-with-react-query/)
- [https://articles.wesionary.team/why-useeffect-is-a-bad-place-to-make-api-calls-98a606735c1c](https://articles.wesionary.team/why-useeffect-is-a-bad-place-to-make-api-calls-98a606735c1c)
