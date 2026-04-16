import { type ClassValue, type ClassValue } from 'clsx/tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}
