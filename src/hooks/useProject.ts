"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Project } from "./useProjects";

export function useProject(id: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/projects/${id}`);
            setProject(response.data.project);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch project");
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (updates: Partial<Project>) => {
        try {
            const response = await axios.put(`/api/projects/${id}`, updates);
            setProject(response.data.project);
            return response.data.project;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Failed to update project");
        }
    };

    return {
        project,
        loading,
        error,
        fetchProject,
        updateProject,
    };
}
