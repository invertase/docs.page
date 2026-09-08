import { useEffect, useRef, useState } from "react";

export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    // Drop an in-flight tick when the payload changes (homepage tab switch).
    void text;
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = null;
    }
    setCopied(false);
  }, [text]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const copy = () => {
    void navigator.clipboard.writeText(text);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      copyTimeoutRef.current = null;
      setCopied(false);
    }, 2000);
  };

  return { copied, copy };
}
