"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface LeaderboardEntry {
    rank: number;
    creator: string;
    score: number;
    status: string;
    trend: string;
    img: string;
}

export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/leaderboard");
                setLeaderboard(response.data.leaderboard);
                setError(null);
            } catch (err: any) {
                console.error("Leaderboard fetch error:", err);
                setError("Failed to sync leaderboard matrix.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return { leaderboard, loading, error };
}
