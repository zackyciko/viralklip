export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "size-4",
        md: "size-8",
        lg: "size-12",
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`}
            ></div>
        </div>
    );
}
