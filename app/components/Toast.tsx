    "use client";

    interface ToastProps {
    message: string;
    isOpen: boolean;
    }

    export function Toast({ message, isOpen }: ToastProps) {
    return (
        <div
        className={`toast${isOpen ? " on" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        >
        {message}
        </div>
    );
    }
