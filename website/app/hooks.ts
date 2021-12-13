import { useEffect, useState } from "react";

export function useNoSSR(): boolean {
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => setReady(true), []);
  return ready;
}