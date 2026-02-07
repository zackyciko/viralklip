import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
    title: "Global Leaderboard",
    description: "See who is dominating the viral matrix. Top creators ranked by viral score and consistency.",
    openGraph: {
        title: "Global Viral Leaderboard - Season 04",
        description: "See who is dominating the viral matrix. Top creators ranked by viral score and consistency.",
        images: ["https://viralklip.vercel.app/leaderboard-og.jpg"]
    }
};

export default function Leaderboard() {
    return <LeaderboardClient />;
}
