import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const useUser = () => {
  const { data, error } = useSWR("/api/user/me");

  const router = useRouter();

  useEffect(() => {
    if (data && !data.ok) router.replace("/log-in");
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
};

export default useUser;
