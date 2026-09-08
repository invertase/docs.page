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
    // The tick follows the resolved write, so a rejected or unavailable
    // clipboard leaves it off rather than claiming a copy that never landed.
    void navigator.clipboard
      ?.writeText(text)
      .then(() => {
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        setCopied(true);
        copyTimeoutRef.current = setTimeout(() => {
          copyTimeoutRef.current = null;
          setCopied(false);
        }, 2000);
      })
      .catch(() => {
        // Leave the tick off — nothing reached the clipboard.
      });
  };

  return { copied, copy };
}
