import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-primary", className)}
        >
            <path
                d="M14 14L50 50M50 14L14 50"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <circle cx="12" cy="52" r="7" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="52" cy="52" r="7" stroke="currentColor" strokeWidth="2.5" />
        </svg>
    );
}
