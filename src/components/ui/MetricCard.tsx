export default function MetricCard({
    title,
    value,
    trend,
    icon,
    color = "primary",
    sparkline = false
}: {
    title: string;
    value: string;
    trend?: string;
    icon: string;
    color?: "primary" | "secondary";
    sparkline?: boolean;
}) {
    const trendColor = trend?.startsWith("+") ? "text-primary" : "text-red-400";
    const iconColor = color === "primary" ? "text-primary" : "text-secondary";

    return (
        <div className="bg-white/5 rounded-lg p-5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                <span className="text-gray-400 text-sm font-medium">{title}</span>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                    {trend && (
                        <div className={`${trendColor} text-sm mt-1 font-medium flex items-center gap-1`}>
                            <span className="material-symbols-outlined text-sm">
                                {trend.startsWith("+") ? "trending_up" : "trending_down"}
                            </span>
                            {trend}
                        </div>
                    )}
                </div>

                {sparkline && (
                    <div className="h-10 w-24 flex items-end gap-1 mb-1">
                        {[40, 60, 30, 80, 100, 70].map((h, i) => (
                            <div
                                key={i}
                                className={`w-1/6 rounded-sm ${i === 4 ? (color === "primary" ? "bg-primary shadow-[0_0_10px_#c3ff0f]" : "bg-secondary shadow-[0_0_10px_#7B2FF7]") : "bg-white/10"}`}
                                style={{ height: `${h}%` }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
