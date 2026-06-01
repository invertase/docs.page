import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toBase64(str: string) {
  if (typeof window !== "undefined") {
    return window.btoa(str);
  }

  return Buffer.from(str).toString("base64");
}
