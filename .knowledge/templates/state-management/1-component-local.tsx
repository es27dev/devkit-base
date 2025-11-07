// 1. Component-local State
// Use: Default for <3 components

import { useState } from "react";

export function ComponentName() {
  const [count, setCount] = useState(0);

  return <div>{count}</div>;
}
