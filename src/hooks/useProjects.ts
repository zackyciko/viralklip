"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface Project {
    id: string;
    user_id: string;
    video_url: string | null;
    video_title: string | null;
    video_duration: number | null;
    thumbnail_url: string | null;
    status: string;
    error_message: string | null;
    transcript: string | null;
    created_at: string;
    completed_at: string | null;
    viral_score?: number | null;
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/projects");
            setProjects(response.data.projects);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (videoUrl: string, videoTitle?: string) => {
        try {
            const response = await axios.post("/api/projects", {
                video_url: videoUrl,
                video_title: videoTitle,
            });
            setProjects([response.data.project, ...projects]);
            return response.data.project;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Failed to create project");
        }
    };

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
    };
}
