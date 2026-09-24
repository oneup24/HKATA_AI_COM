import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}
