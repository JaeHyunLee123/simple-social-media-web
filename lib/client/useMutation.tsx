import { useState } from "react";

interface IUseMutationState<T> {
  loading: boolean;
  result?: T | undefined;
  error?: object | undefined;
}

type UseMutationResult<T> = [(data: any) => void, IUseMutationState<T>];

const useMutation = <T = any,>(url: string): UseMutationResult<T> => {
  const [loading, setLoading] = useState(false);
  const [result, setData] = useState<T | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);

  const mutate = (data: any) => {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((json) => setData(json))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return [mutate, { loading, result, error }];
};

export default useMutation;
