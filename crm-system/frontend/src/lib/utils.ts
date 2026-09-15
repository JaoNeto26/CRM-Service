type ClassValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | ClassValue[]
    | { [key: string]: boolean | null | undefined };

function classNames(value: ClassValue): string[] {
    if (!value) return [];
    if (typeof value === "string" || typeof value === "number") {
        return [String(value)];
    }
    if (Array.isArray(value)) return value.flatMap(classNames);
    return Object.entries(value)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([name]) => name);
}

export function cn(...inputs: ClassValue[]) {
    return inputs.flatMap(classNames).join(" ");
}
