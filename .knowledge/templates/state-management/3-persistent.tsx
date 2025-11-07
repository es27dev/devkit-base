// 3. Persistent State
// Use: Browser-native persistence (theme, cookie banner)

import { useEffect, useState } from "react";

export function ComponentName() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <div>{theme}</div>;
}
