"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface AnalyticsData {
    totalProjects: number;
    totalClips: number;
    avgViralScore: number;
    totalPredictedViews: number;
    recentProjects: any[];
    clips: any[];
}

export function useAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/analytics");
            setAnalytics(response.data.analytics);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch analytics");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        analytics,
        loading,
        error,
        fetchAnalytics,
    };
}
