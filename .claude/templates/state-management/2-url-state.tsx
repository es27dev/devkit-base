// 2. URL State
// Use: Shareable, bookmarkable filters/tabs

import { useSearchParams } from "react-router-dom";

export function ComponentName() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const updateFilter = (newFilter: string) => {
    setSearchParams({ filter: newFilter });
  };

  return <div>{filter}</div>;
}
