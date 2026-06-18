import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str);

  if (typeof window !== "undefined") {
    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return window.btoa(binary);
  }

  return Buffer.from(bytes).toString("base64");
}
