"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    subscription_tier: string;
    credits_remaining: number;
    credits_reset_date: string | null;
    stripe_customer_id: string | null;
    created_at: string;
    updated_at: string;
}

export function useUser() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/user");
            setProfile(response.data.profile);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
        try {
            const response = await axios.patch("/api/user", data);
            setProfile(response.data.profile);
            return response.data.profile;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Failed to update profile");
        }
    };

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
    };
}
