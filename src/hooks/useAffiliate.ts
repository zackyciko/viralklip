"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface AffiliateData {
    stats: {
        totalEarnings: number;
        activeReferrals: number;
        totalClicks: number;
        conversionRate: number;
    };
    referrals: any[];
    payouts: any[];
}

export function useAffiliate() {
    const [data, setData] = useState<AffiliateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/affiliate");
            setData(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch affiliate data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        fetchData,
    };
}
