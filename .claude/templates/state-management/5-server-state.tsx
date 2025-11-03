// 5. Server State (TanStack Query)
// Use: API/DB data with caching, revalidation, background sync
// Install: npm install @tanstack/react-query

import { useQuery } from "@tanstack/react-query";

async function fetchProducts() {
  const response = await fetch("/api/products");
  return response.json();
}

export function ComponentName() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <div>{JSON.stringify(data)}</div>;
}
