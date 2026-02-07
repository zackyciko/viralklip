export default function Card({
    children,
    className = "",
    hover = true
}: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}) {
    return (
        <div className={`bg-surface-card rounded-xl border border-white/5 overflow-hidden transition-all ${hover ? "hover:border-primary/30" : ""
            } ${className}`}>
            {children}
        </div>
    );
}
