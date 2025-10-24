import { useQuery } from "@tanstack/react-query";

export function useAuth() {
    const fetchUser = async () => {
        const res = await fetch("/api/user/current", {
            credentials: "include",
        });

        if (res.ok) return res.json();
        if (res.status === 401 || res.status === 403) return null; // not logged in

        // Unexpected error
        throw new Error(`Failed to fetch user: ${res.status}`);
    };

    const { data: user, isLoading } = useQuery({
        queryKey: ["auth", "user"],
        queryFn: fetchUser,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60, // 1 minute
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
    };
}