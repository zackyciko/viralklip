"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface Team {
    id: string;
    name: string;
    plan: string;
    owner_id: string;
    my_role: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    email: string;
    status: string;
}

export function useTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (currentTeam?.id) {
            fetchMembers(currentTeam.id);
        }
    }, [currentTeam]);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/teams");
            const teamsData = response.data.teams;
            setTeams(teamsData);
            // Default to first team
            if (teamsData.length > 0 && !currentTeam) {
                setCurrentTeam(teamsData[0]);
            }
        } catch (err: any) {
            setError("Failed to load teams");
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (teamId: string) => {
        try {
            const response = await axios.get(`/api/teams/${teamId}/members`);
            setMembers(response.data.members);
        } catch (err) {
            console.error("Failed to load members", err);
        }
    };

    const createTeam = async (name: string) => {
        try {
            const response = await axios.post("/api/teams", { name });
            const newTeam = { ...response.data.team, my_role: 'owner' };
            setTeams([...teams, newTeam]);
            setCurrentTeam(newTeam);
            return newTeam;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Failed to create team");
        }
    };

    return {
        teams,
        currentTeam,
        setCurrentTeam,
        members,
        loading,
        error,
        createTeam,
        refreshMembers: () => currentTeam && fetchMembers(currentTeam.id)
    };
}
