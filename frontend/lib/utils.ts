type ClassValue = string | number | null | undefined | false;

function clsx(...inputs: ClassValue[]): string {
  return inputs.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}

function twMerge(className: string): string {
  return className;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
